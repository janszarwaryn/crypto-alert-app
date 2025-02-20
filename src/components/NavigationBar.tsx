import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { StreamContext } from '../context/StreamContext';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import CircularProgress from '@mui/material/CircularProgress';

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'error':
      return '#f44336'; // red
    case 'connected':
    case 'live':
      return '#4caf50'; // green
    case 'disconnected':
      return '#ff9800'; // orange
    default:
      return '#2196f3'; // blue
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'error':
      return <ErrorIcon sx={{ fontSize: 24, color: getStatusColor(status) }} />;
    case 'connected':
    case 'live':
      return <CheckCircleIcon sx={{ fontSize: 24, color: getStatusColor(status) }} />;
    case 'disconnected':
      return <SyncIcon sx={{ fontSize: 24, color: getStatusColor(status) }} />;
    default:
      return <CircularProgress size={24} sx={{ color: getStatusColor(status) }} />;
  }
};

const NavigationBar: React.FC = () => {
  const { isStreaming, startStream, stopStream, connectionStatus } = useContext(StreamContext);
  const location = useLocation();

  const handleStreamToggle = () => {
    if (isStreaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  return (
    <AppBar position="static" sx={{ marginBottom: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/monitor"
            color="inherit"
            variant={location.pathname === '/monitor' ? 'outlined' : 'text'}
          >
            Monitor
          </Button>
          <Button
            component={Link}
            to="/alerts"
            color="inherit"
            variant={location.pathname === '/alerts' ? 'outlined' : 'text'}
          >
            Alerts
          </Button>
        </Box>

        {/* Status display in the center */}
        <Box sx={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {getStatusIcon(connectionStatus.status)}
          <Box>
            <Typography variant="body1" sx={{ color: getStatusColor(connectionStatus.status) }}>
              {connectionStatus.status}
            </Typography>
            {connectionStatus.substatus && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {connectionStatus.substatus}
              </Typography>
            )}
          </Box>
        </Box>

        <Button
          color="inherit"
          variant={isStreaming ? 'outlined' : 'contained'}
          onClick={handleStreamToggle}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;