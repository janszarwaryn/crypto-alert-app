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
  // Cache threshold values for better performance
  const cheapThreshold = settings.cheapThreshold;
  const solidThreshold = settings.solidThreshold;
  const bigThreshold = settings.bigThreshold;

  // Calculate values once to avoid repeating
  const usdValue = order.usdValue;
  const btcValue = order.btcValue;
  const price = order.price;

  let alerts: AlertResults = {
    cheap: null,
    solid: null,
    big: null
  };

  // Check price for cheap orders (not total value)
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

  // Check if order is bigger then solid threshold
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

  // Check if its a big business order
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