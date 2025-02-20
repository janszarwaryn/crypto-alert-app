// Base trade interface for common properties
interface BaseTrade {
  timestamp: Date;
  price: number;
  quantity: number;
  usdValue: number;
  btcValue: number;
  type: 'buy' | 'sell';
}

export type OrderType = 'buy' | 'sell';
export type AlertCategory = 'cheap' | 'solid' | 'big';
export type ConnectionStatusType = 'Initializing' | 'Connected' | 'Live' | 'Error' | 'Disconnected' | 'Updating' | 'Reconnecting';

export interface Order extends BaseTrade {
  // Order specific properties can be added here
}

export interface Alert extends BaseTrade {
  id: string;
  category: AlertCategory;
  alertMessage: string;
}

export interface Settings {
  cheapThreshold: number;  // USD price threshold for cheap orders
  solidThreshold: number;  // BTC amount threshold for solid orders
  bigThreshold: number;    // USD value threshold for big orders
  apiKey: string;
}

export interface ConnectionStatus {
  isLoading: boolean;
  status: ConnectionStatusType;
  substatus?: string;
}
