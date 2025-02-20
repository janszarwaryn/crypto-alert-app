import { useEffect, useContext } from 'react';
import { StreamContext } from '../context/StreamContext';
import { cryptoService } from '../services/cryptoService';
import { processOrderForAlerts } from '../utils/alertRules';
import { useSettings } from '../context/SettingsContext';

const useCryptoStream = (isActive: boolean, showLoading: boolean = true): void => {
  const { startStream, stopStream, addOrder, addAlerts, setConnectionStatus } = useContext(StreamContext);
  const { settings } = useSettings();

  useEffect(() => {
    // Ustaw callback dla aktualizacji stanu połączenia
    cryptoService.onConnection((status, substatus) => {
      setConnectionStatus({
        isLoading: showLoading,
        status,
        substatus
      });
    });

    if (isActive) {
      // Pokaż LoadingOverlay podczas inicjalizacji
      setConnectionStatus({
        isLoading: showLoading,
        status: 'Initializing',
        substatus: 'Connecting to Binance WebSocket stream...'
      });

      startStream();
      cryptoService.subscribe((order) => {
        // Dodaj zamówienie do listy
        addOrder(order);

        // Sprawdź czy zamówienie generuje alerty
        const alerts = processOrderForAlerts(order, settings);
        if (alerts.cheap) addAlerts('cheap', alerts.cheap);
        if (alerts.solid) addAlerts('solid', alerts.solid);
        if (alerts.big) addAlerts('big', alerts.big);
      });
      cryptoService.startStream();
    } else {
      stopStream();
      cryptoService.stopStream();
      // Wyłącz LoadingOverlay przy zatrzymaniu streama
      setConnectionStatus({
        isLoading: false,
        status: 'Disconnected',
        substatus: 'Stream has been stopped'
      });
    }

    return () => {
      cryptoService.stopStream();
      // Wyłącz LoadingOverlay przy odmontowaniu komponentu
      setConnectionStatus({
        isLoading: false,
        status: 'Disconnected',
        substatus: 'Stream has been stopped'
      });
    };
  }, [isActive, showLoading, startStream, stopStream, addOrder, addAlerts, settings, setConnectionStatus]);
};

export { useCryptoStream as default };