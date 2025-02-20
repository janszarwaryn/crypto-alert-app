import React, { useContext } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { StreamContext } from '../context/StreamContext';

const HomePage: React.FC = () => {
  const { isStreaming, startStream, stopStream } = useContext(StreamContext);

  const handleStreamToggle = () => {
    if (isStreaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: 'background.default',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Crypto Alerts Dashboard
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Stream Control
        </Typography>
        <Typography variant="body1" paragraph>
          {isStreaming
            ? 'Stream is active. Receiving real-time cryptocurrency data.'
            : 'Stream is inactive. Click the button below to start receiving data.'}
        </Typography>
        <Button
          variant="contained"
          color={isStreaming ? 'error' : 'primary'}
          onClick={handleStreamToggle}
          sx={{ minWidth: 150 }}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
        </Button>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxWidth: 600,
          width: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h6" gutterBottom>
          About This Dashboard
        </Typography>
        <Typography variant="body1" paragraph>
          This dashboard monitors BTC/USDT transactions from Binance in real-time and alerts you when:
        </Typography>
        <ul style={{ textAlign: 'left' }}>
          <li>Transaction price is below $50,000</li>
          <li>Transaction quantity is above 10 BTC</li>
          <li>Total transaction value exceeds $1,000,000</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default HomePage;