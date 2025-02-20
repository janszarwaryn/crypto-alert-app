import { useEffect, useContext } from 'react';
import { StreamContext } from '../context/StreamContext';
import { cryptoService } from '../services/cryptoService';
import { processOrderForAlerts } from '../utils/alertRules';
import { useSettings } from '../context/SettingsContext';
import { ConnectionStatusType } from '../types';

const useCryptoStream = (isActive: boolean, showLoading: boolean = true): void => {
  const { startStream, stopStream, addOrder, addAlert, setConnectionStatus } = useContext(StreamContext);
  const { settings } = useSettings();

  useEffect(() => {
    cryptoService.onConnection((status: ConnectionStatusType, substatus?: string) => {
      setConnectionStatus({
        isLoading: showLoading,
        status,
        substatus
      });
    });

    if (isActive) {
      setConnectionStatus({
        isLoading: showLoading,
        status: 'Initializing',
        substatus: 'Connecting to Binance WebSocket stream...'
      });

      startStream();
      cryptoService.subscribe((order) => {
        addOrder(order);

        const alerts = processOrderForAlerts(order, settings);
        if (alerts.cheap) addAlert('cheap', alerts.cheap);
        if (alerts.solid) addAlert('solid', alerts.solid);
        if (alerts.big) addAlert('big', alerts.big);
      });
      cryptoService.startStream();
    } else {
      stopStream();
      cryptoService.stopStream();
      setConnectionStatus({
        isLoading: false,
        status: 'Disconnected',
        substatus: 'Stream has been stopped'
      });
    }

    return () => {
      cryptoService.stopStream();
      setConnectionStatus({
        isLoading: false,
        status: 'Disconnected',
        substatus: 'Stream has been stopped'
      });
    };
  }, [isActive, showLoading, startStream, stopStream, addOrder, addAlert, settings, setConnectionStatus]);
};

export { useCryptoStream as default };
