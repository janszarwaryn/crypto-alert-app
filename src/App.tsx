import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme, Box } from '@mui/material';
import MonitorPage from './pages/MonitorPage';
import AlertsPage from './pages/AlertsPage';
import NavigationBar from './components/NavigationBar';
import StatusBar from './components/StatusBar';
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
  const { isStreaming } = React.useContext(StreamContext);
  useCryptoStream(isStreaming);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavigationBar />
      <StatusBar />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/" element={<Navigate to="/monitor" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SettingsProvider>
          <StreamProvider>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
              }}
            >
              <AppContent />
            </Box>
          </StreamProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
