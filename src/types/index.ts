export interface Order {
  timestamp: Date;
  price: number;
  quantity: number;
  usdValue: number;
  btcValue: number;
  type: 'buy' | 'sell';
  total?: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  price: number;
  quantity: number;
  usdValue: number;
  btcValue: number;
  type: 'buy' | 'sell';
  category: 'cheap' | 'solid' | 'big';
  alertMessage?: string;
}

export interface Settings {
  cheapThreshold: number;
  solidThreshold: number;
  bigThreshold: number;
  apiKey: string;
}

export interface ConnectionStatus {
  isLoading: boolean;
  status: string;
  substatus?: string;
}
