import React, { createContext, useReducer, useCallback, useMemo } from 'react';
import { Order, Alert, AlertCategory, ConnectionStatus } from '../types';

interface StreamState {
  isStreaming: boolean;
  orders: Order[];
  alerts: Record<AlertCategory, Alert[]>;
  connectionStatus: ConnectionStatus;
}

type StreamAction =
  | { type: 'START_STREAM' }
  | { type: 'STOP_STREAM' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'ADD_ALERT'; payload: { category: AlertCategory; alert: Alert } }
  | { type: 'SET_CONNECTION_STATUS'; payload: Partial<ConnectionStatus> };

const MAX_ORDERS = 500;
const MAX_ALERTS = 100;

const initialState: StreamState = {
  isStreaming: false,
  orders: [],
  alerts: {
    cheap: [],
    solid: [],
    big: []
  },
  connectionStatus: {
    isLoading: false,
    status: 'Disconnected',
    substatus: undefined
  }
};

const streamReducer = (state: StreamState, action: StreamAction): StreamState => {
  switch (action.type) {
    case 'START_STREAM':
      return {
        ...state,
        isStreaming: true
      };

    case 'STOP_STREAM':
      return {
        ...state,
        isStreaming: false
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders].slice(0, MAX_ORDERS)
      };

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          [action.payload.category]: [
            action.payload.alert,
            ...state.alerts[action.payload.category]
          ].slice(0, MAX_ALERTS)
        }
      };

    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: {
          ...state.connectionStatus,
          ...action.payload
        }
      };

    default:
      return state;
  }
};

interface StreamContextType extends StreamState {
  startStream: () => void;
  stopStream: () => void;
  addOrder: (order: Order) => void;
  addAlert: (category: AlertCategory, alert: Alert) => void;
  setConnectionStatus: (status: Partial<ConnectionStatus>) => void;
}

export const StreamContext = createContext<StreamContextType>({
  ...initialState,
  startStream: () => {},
  stopStream: () => {},
  addOrder: () => {},
  addAlert: () => {},
  setConnectionStatus: () => {}
});

interface StreamProviderProps {
  children: React.ReactNode;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(streamReducer, initialState);

  const startStream = useCallback(() => {
    dispatch({ type: 'START_STREAM' });
  }, []);

  const stopStream = useCallback(() => {
    dispatch({ type: 'STOP_STREAM' });
  }, []);

  const addOrder = useCallback((order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, []);

  const addAlert = useCallback((category: AlertCategory, alert: Alert) => {
    dispatch({ type: 'ADD_ALERT', payload: { category, alert } });
  }, []);

  const setConnectionStatus = useCallback((status: Partial<ConnectionStatus>) => {
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
  }, []);

  const value = useMemo(() => ({
    ...state,
    startStream,
    stopStream,
    addOrder,
    addAlert,
    setConnectionStatus
  }), [state, startStream, stopStream, addOrder, addAlert, setConnectionStatus]);

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};

export default StreamContext;