import { Order, ConnectionStatusType } from '../types';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { orderCache } from './OrderCache';

const WEBSOCKET_URL = 'wss://streamer.cryptocompare.com/v2?api_key=';
const API_KEY = process.env.REACT_APP_CRYPTO_API_KEY || '';

// Type definitions for WebSocket messages and callbacks
type MessageListener = (order: Order) => void;
type WebSocketMessageType = '0' | '401' | '429' | '500';
type ConnectionCallback = (status: ConnectionStatusType, substatus?: string, showLoading?: boolean) => void;

interface WebSocketMessage {
  TYPE: WebSocketMessageType;
  MESSAGE?: string;
  PRICE?: number;
  QUANTITY?: number;
  MARKET?: string;
  FSYM?: string;
  TSYM?: string;
  SIDE?: number;
  ACTION?: number;
  SUB?: string;
  M?: string;
  P?: number;
  Q?: number;
  F?: string;
  ID?: string;
  TS?: number;
  TOTAL?: number;
}

export class CryptoService {
  private ws: ReconnectingWebSocket | null = null;
  private subscribers: ((data: Order) => void)[] = [];
  private isActive = false;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private readonly TIMEOUT_DURATION = 30000;
  private readonly RECONNECT_DELAY = 5000;
  private onConnectionUpdate: ConnectionCallback | null = null;
  private isSubscribed = false;
  private pendingSubscription = false;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private overlayManuallyClosed = false;
  private isInitialConnection = true;

  constructor() {
    this.setupWebSocket = this.setupWebSocket.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.subscribe = this.subscribe.bind(this);

    // Listen for network status changes
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline() {
    if (this.isActive) {
      console.log('Network connection restored, reconnecting...');
      this.reconnectWithDelay();
    }
  }

  private handleOffline() {
    console.log('Network connection lost');
    this.cleanup();
  }

  private reconnectWithDelay() {
    // Cancel existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // Wait before attempting reconnection
    this.reconnectTimer = setTimeout(() => {
      if (this.isActive) {
        console.log('Attempting to reconnect...');
        this.setupWebSocket();
      }
    }, this.RECONNECT_DELAY);
  }

  private updateConnectionStatus(status: ConnectionStatusType, substatus?: string, showLoading: boolean = true) {
    if (this.onConnectionUpdate) {
      const shouldShowOverlay =
        status === 'Error' ||
        status === 'Disconnected' ||
        status === 'Initializing' ||
        (status === 'Live' && this.isInitialConnection);

      if (shouldShowOverlay && !this.overlayManuallyClosed) {
        this.onConnectionUpdate(status, substatus, showLoading);

        // If we're going live, mark initial connection as complete
        if (status === 'Live') {
          this.isInitialConnection = false;
        }
      }
    }
  }

  private setupWebSocket() {
    this.cleanup();

    if (!this.isActive) {
      console.log('Setup cancelled - stream is not active');
      return;
    }

    this.updateConnectionStatus('Initializing', 'Setting up WebSocket connection...', true);

    const wsUrl = `${WEBSOCKET_URL}${API_KEY}`;

    // Initialize WebSocket with reconnection settings
    this.ws = new ReconnectingWebSocket(wsUrl, [], {
      maxRetries: 5,
      connectionTimeout: 30000,
      minReconnectionDelay: 5000,
      maxReconnectionDelay: 10000,
      reconnectionDelayGrowFactor: 1.5
    });

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }

      if (this.ws && this.isActive) {
        this.updateConnectionStatus('Connected', 'WebSocket connected, preparing subscription...', true);
        this.sendSubscription();
      }
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;

        if (data.TYPE === '0') {
          const order: Order = {
            price: data.P || 0,
            quantity: data.Q || 0,
            type: data.SIDE === 1 ? 'buy' : 'sell',
            timestamp: new Date(),
            usdValue: data.TOTAL || (data.P || 0) * (data.Q || 0),
            btcValue: data.Q || 0
          };

          // Check cache before processing
          if (!orderCache.has(order)) {
            orderCache.set(order);
            this.subscribers.forEach(callback => callback(order));

            if (!this.isSubscribed) {
              this.isSubscribed = true;
              this.pendingSubscription = false;
              this.updateConnectionStatus('Live', 'Real-time trade data stream is now active', !this.overlayManuallyClosed);

              if (!this.overlayManuallyClosed) {
                setTimeout(() => {
                  this.updateConnectionStatus('Live', 'Real-time trade data stream is now active', false);
                }, 1000);
              }
            }
          }
        } else if (data.TYPE === '500' || data.TYPE === '401' || data.TYPE === '429') {
          console.error('WebSocket error:', data.MESSAGE);
          this.overlayManuallyClosed = false;
          this.updateConnectionStatus('Error', `API Error: ${data.MESSAGE}. Attempting to reconnect...`, true);
          this.cleanup();
          this.reconnectWithDelay();
        }
      } catch (error) {
        console.error('Error processing message:', error);
        this.overlayManuallyClosed = false;
        this.updateConnectionStatus('Error', 'Failed to process message. Attempting to reconnect...', true);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      if (this.isActive) {
        this.updateConnectionStatus('Disconnected', 'WebSocket connection closed. Attempting to reconnect...', true);
        this.reconnectWithDelay();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.cleanup();
      if (this.isActive) {
        this.reconnectWithDelay();
      }
    };

    // ReconnectingWebSocket opens connection automatically
    console.log('WebSocket instance created, waiting for connection...');
  }

  private sendSubscription() {
    if (!this.ws || !this.isActive || this.pendingSubscription || this.isSubscribed) {
      return;
    }

    // Check if connection is readyyy
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready for subscription, current state:', this.ws.readyState);
      return;
    }

    this.pendingSubscription = true;
    console.log('Sending subscription request...');

    if (this.onConnectionUpdate) {
      this.onConnectionUpdate('Connected', 'Subscribing to BTC/USDT feed. Data will appear shortly...', true);
    }

    const subscribeMsg = {
      action: 'SubAdd',
      subs: ['0~Binance~BTC~USDT'],
    };

    try {
      this.ws.send(JSON.stringify(subscribeMsg));
      console.log('Subscription request sent successfully');

      // Update user about waiting for data
      if (this.onConnectionUpdate) {
        this.onConnectionUpdate('Connected', 'Subscription active. Waiting for first trade data...', true);
      }
    } catch (error) {
      console.error('Failed to send subscription:', error);
      this.pendingSubscription = false;
      if (this.onConnectionUpdate) {
        this.onConnectionUpdate('Error', 'Failed to subscribe. Retrying connection...', true);
      }
      this.cleanup();
      setTimeout(() => this.setupWebSocket(), this.RECONNECT_DELAY);
    }
  }

  private cleanup() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Show disconnection status before cleanup
    if (this.isActive && this.onConnectionUpdate) {
      this.onConnectionUpdate('Disconnected', 'Connection closed', true);
    }

    this.isSubscribed = false;
    this.pendingSubscription = false;

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (error) {
        console.error('Error closing WebSocket:', error);
      }
      this.ws = null;

    }

  }

  public startStream() {
    console.log('Starting stream...');
    if (this.isActive) {
      console.log('Stream is already active');
      return;
    }

    // Reset all states when starting
    this.isActive = true;
    this.isSubscribed = false;
    this.pendingSubscription = false;
    this.reconnectAttempts = 0;
    this.overlayManuallyClosed = false;
    this.isInitialConnection = true;

    this.updateConnectionStatus('Initializing', 'Starting connection...', true);

    this.setupWebSocket();
  }

  public stopStream() {
    console.log('Stopping stream...');
    this.isActive = false;
    this.overlayManuallyClosed = false;
    this.isInitialConnection = true;

    this.updateConnectionStatus('Disconnected', 'Stream stopped', false);

    this.cleanup();
  }

  public subscribe(callback: MessageListener) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: MessageListener) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  }

  public onConnection(callback: ConnectionCallback) {
    this.onConnectionUpdate = callback;
  }

  public hideOverlay() {
    this.overlayManuallyClosed = true;
    if (this.onConnectionUpdate) {
      this.onConnectionUpdate(
        this.isSubscribed ? 'Live' : 'Disconnected',
        this.isSubscribed ? 'Real-time trade data stream is now active' : 'Connection closed',
        false
      );
    }
  }
}

export const cryptoService = new CryptoService();

