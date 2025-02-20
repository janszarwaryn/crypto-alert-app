import React, { createContext, useState, useCallback } from 'react';
import { Order, Alert } from '../types';

interface ConnectionStatus {
  isLoading: boolean;
  status: string;
  substatus?: string;
}

interface StreamContextType {
  isStreaming: boolean;
  orders: Order[];
  alerts: {
    cheap: Order[];
    solid: Order[];
    big: Order[];
  };
  connectionStatus: ConnectionStatus;
  showLoading: boolean;
  startStream: () => void;
  stopStream: () => void;
  addOrder: (order: Order) => void;
  addAlerts: (type: 'cheap' | 'solid' | 'big', alert: Order) => void;
  setConnectionStatus: (status: { status: string; substatus?: string; isLoading?: boolean }) => void;
}

export const StreamContext = createContext<StreamContextType>({
  isStreaming: false,
  orders: [],
  alerts: {
    cheap: [],
    solid: [],
    big: []
  },
  connectionStatus: {
    isLoading: false,
    status: 'Disconnected'
  },
  showLoading: false,
  startStream: () => {},
  stopStream: () => {},
  addOrder: () => {},
  addAlerts: () => {},
  setConnectionStatus: () => {}
});

interface StreamProviderProps {
  children: React.ReactNode;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<{
    cheap: Order[];
    solid: Order[];
    big: Order[];
  }>({
    cheap: [],
    solid: [],
    big: []
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isLoading: false,
    status: 'Disconnected'
  });
  const [showLoading, setShowLoading] = useState(false);

  const handleSetConnectionStatus = useCallback(({ status, substatus, isLoading }: { status: string; substatus?: string; isLoading?: boolean }) => {
    setConnectionStatus(prev => ({
      ...prev,
      status,
      substatus,
      isLoading: isLoading !== undefined ? isLoading : prev.isLoading
    }));
  }, []);

  const startStream = useCallback(() => {
    setIsStreaming(true);
  }, []);

  const stopStream = useCallback(() => {
    setIsStreaming(false);
    setOrders([]);
    setAlerts({ cheap: [], solid: [], big: [] });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const newOrders = [order, ...prev];
      if (newOrders.length > 500) {
        return newOrders.slice(0, 500);
      }
      return newOrders;
    });
  }, []);

  const addAlerts = useCallback((type: 'cheap' | 'solid' | 'big', alert: Order) => {
    setAlerts(prev => ({
      ...prev,
      [type]: [alert, ...prev[type]].slice(0, 100)
    }));
  }, []);

  const value = {
    isStreaming,
    orders,
    alerts,
    connectionStatus,
    showLoading,
    startStream,
    stopStream,
    addOrder,
    addAlerts,
    setConnectionStatus: handleSetConnectionStatus
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};

export default StreamContext;