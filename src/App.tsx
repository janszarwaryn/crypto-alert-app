import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  createRoutesFromElements
} from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import MonitorPage from './pages/MonitorPage';
import AlertsPage from './pages/AlertsPage';
import NavigationBar from './components/NavigationBar';
import LoadingOverlay from './components/LoadingOverlay';
import { StreamContext, StreamProvider } from './context/StreamContext';
import { SettingsProvider } from './context/SettingsContext';
import useCryptoStream from './hooks/useCryptoStream';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const { isStreaming, connectionStatus, setConnectionStatus } = React.useContext(StreamContext);
  useCryptoStream(isStreaming);

  const handleOverlayClose = () => {
    setConnectionStatus({
      ...connectionStatus,
      isLoading: false
    });
  };

  return (
    <>
      <NavigationBar />
      <LoadingOverlay
        isVisible={connectionStatus.isLoading}
        status={connectionStatus.status}
        substatus={connectionStatus.substatus}
        onClose={handleOverlayClose}
      />
      <Routes>
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/" element={<Navigate to="/monitor" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SettingsProvider>
          <StreamProvider>
            <AppContent />
          </StreamProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
