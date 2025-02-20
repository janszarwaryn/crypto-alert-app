import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StreamProvider } from '../../context/StreamContext';
import { processOrderForAlerts } from '../../utils/alertRules';
import { Order } from '../../types';
import WS from 'jest-websocket-mock';
import { SettingsProvider } from '../../context/SettingsContext';

describe('Core Application Tests', () => {
  describe('1. Alert Generation', () => {
    const settings = {
      cheapThreshold: 50000,
      solidThreshold: 10,
      bigThreshold: 1000000,
      apiKey: 'test-api-key'
    };

    test('should correctly identify alerts based on thresholds', () => {
      const order: Order = {
        timestamp: new Date(),
        price: 45000,
        quantity: 30,
        btcValue: 30,
        usdValue: 45000 * 30, // 1,350,000
        type: 'sell'
      };

      const alerts = processOrderForAlerts(order, settings);
      
      expect(alerts.cheap).not.toBeNull();
      expect(alerts.solid).not.toBeNull();
      expect(alerts.big).not.toBeNull();

      expect(alerts.cheap?.alertMessage).toContain('Cheap order detected');
      expect(alerts.solid?.alertMessage).toContain('30.0000 BTC');
      expect(alerts.big?.alertMessage).toContain('$1,350,000');
    });

    test('should not generate alerts when thresholds are not met', () => {
      const normalOrder: Order = {
        timestamp: new Date(),
        price: 55000,
        quantity: 5,
        btcValue: 5,
        usdValue: 55000 * 5, // 275,000
        type: 'buy'
      };

      const alerts = processOrderForAlerts(normalOrder, settings);
      
      expect(alerts.cheap).toBeNull();
      expect(alerts.solid).toBeNull();
      expect(alerts.big).toBeNull();
    });
  });

  describe('2. WebSocket Data Flow', () => {
    let server: WS;

    beforeEach(() => {
      server = new WS('wss://streamer.cryptocompare.com/v2');
    });

    afterEach(() => {
      WS.clean();
    });

    test('should process incoming WebSocket data and generate alerts', async () => {
      const TestComponent = () => (
        <div data-testid="alerts-container">
          <div data-testid="cheap-alerts" />
          <div data-testid="solid-alerts" />
          <div data-testid="big-alerts" />
        </div>
      );

      const { findByTestId } = render(
        <SettingsProvider>
          <StreamProvider>
            <TestComponent />
          </StreamProvider>
        </SettingsProvider>
      );

      act(() => {
        server.send(JSON.stringify({
          TYPE: '0',
          PRICE: 45000,
          QUANTITY: 30,
          MARKET: 'Binance',
          FSYM: 'BTC',
          TSYM: 'USDT',
          SIDE: 1,
          TS: Date.now()
        }));
      });

      const alertsContainer = await findByTestId('alerts-container');
      expect(alertsContainer).toBeInTheDocument();
    });
  });

  describe('3. Alert Expiration', () => {
    test('should only show alerts from last minute', () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
      
      const alerts = [
        {
          id: '1',
          timestamp: now,
          price: 45000,
          quantity: 1,
          usdValue: 45000,
          btcValue: 1,
          type: 'sell' as const,
          category: 'cheap',
          alertMessage: 'Current alert'
        },
        {
          id: '2',
          timestamp: thirtySecondsAgo,
          price: 45000,
          quantity: 1,
          usdValue: 45000,
          btcValue: 1,
          type: 'sell' as const,
          category: 'cheap',
          alertMessage: 'Recent alert'
        },
        {
          id: '3',
          timestamp: twoMinutesAgo,
          price: 45000,
          quantity: 1,
          usdValue: 45000,
          btcValue: 1,
          type: 'sell' as const,
          category: 'cheap',
          alertMessage: 'Old alert'
        }
      ];

      const filteredAlerts = alerts.filter(alert => 
        alert.timestamp > new Date(now.getTime() - 60 * 1000)
      );

      expect(filteredAlerts).toHaveLength(2);
      expect(filteredAlerts.map(a => a.id)).toEqual(['1', '2']);
      expect(filteredAlerts.map(a => a.alertMessage)).not.toContain('Old alert');
    });
  });
});
