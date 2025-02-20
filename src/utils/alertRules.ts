import { Order, Alert, Settings } from '../types';

export type AlertResults = {
  cheap: Alert | null;
  solid: Alert | null;
  big: Alert | null;
};

export const formatBTC = (value: number): string => {
  return `${value.toFixed(4)} BTC`;
};

export const processOrderForAlerts = (
  order: Order,
  settings: Settings
): AlertResults => {
  // Memoizujemy wartości progowe
  const cheapThreshold = settings.cheapThreshold;
  const solidThreshold = settings.solidThreshold;
  const bigThreshold = settings.bigThreshold;

  // Obliczamy wartości tylko raz
  const usdValue = order.usdValue;
  const btcValue = order.btcValue;
  const price = order.price;

  let alerts: AlertResults = {
    cheap: null,
    solid: null,
    big: null
  };

  // Używamy price dla cheap orders (nie total value)
  if (price < cheapThreshold) {
    alerts.cheap = {
      id: `cheap-${Date.now()}-${Math.random()}`,
      timestamp: order.timestamp,
      price: order.price,
      quantity: order.quantity,
      usdValue: order.usdValue,
      btcValue: order.btcValue,
      type: order.type,
      category: 'cheap',
      alertMessage: `Cheap order detected: $${price.toLocaleString()}/BTC (Total: $${usdValue.toLocaleString()})`
    };
  }

  if (btcValue > solidThreshold) {
    alerts.solid = {
      id: `solid-${Date.now()}-${Math.random()}`,
      timestamp: order.timestamp,
      price: order.price,
      quantity: order.quantity,
      usdValue: order.usdValue,
      btcValue: order.btcValue,
      type: order.type,
      category: 'solid',
      alertMessage: `Solid order detected: ${formatBTC(btcValue)} ($${usdValue.toLocaleString()})`
    };
  }

  if (usdValue > bigThreshold) {
    alerts.big = {
      id: `big-${Date.now()}-${Math.random()}`,
      timestamp: order.timestamp,
      price: order.price,
      quantity: order.quantity,
      usdValue: order.usdValue,
      btcValue: order.btcValue,
      type: order.type,
      category: 'big',
      alertMessage: `Big business order detected: $${usdValue.toLocaleString()} (${formatBTC(btcValue)})`
    };
  }

  return alerts;
};

// Helper function to filter alerts from the last minute
export const filterLastMinuteAlerts = (alerts: Alert[]): Alert[] => {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  return alerts.filter(alert => alert.timestamp > oneMinuteAgo);
};