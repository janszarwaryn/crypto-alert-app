import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { StreamContext } from '../context/StreamContext';

const NavigationBar: React.FC = () => {
  const { isStreaming, startStream, stopStream } = useContext(StreamContext);
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