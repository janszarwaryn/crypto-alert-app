import React, { useContext } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
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

const getStatusIcon = (status: string, isMobile: boolean) => {
  const iconSize = isMobile ? 16 : 20;
  switch (status.toLowerCase()) {
    case 'error':
      return <ErrorIcon sx={{ fontSize: iconSize, color: getStatusColor(status) }} />;
    case 'connected':
    case 'live':
      return <CheckCircleIcon sx={{ fontSize: iconSize, color: getStatusColor(status) }} />;
    case 'disconnected':
      return <SyncIcon sx={{ fontSize: iconSize, color: getStatusColor(status) }} />;
    default:
      return <CircularProgress size={iconSize} sx={{ color: getStatusColor(status) }} />;
  }
};

const StatusBar: React.FC = () => {
  const { connectionStatus } = useContext(StreamContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? 0.25 : 0.5,
        marginBottom: 2,
        backgroundColor: 'background.paper',
        borderRadius: 0
      }}
    >
      <Box sx={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: isMobile ? 0.5 : 1,
        padding: isMobile ? '2px 8px' : '4px 12px',
        borderRadius: 1,
        backgroundColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {getStatusIcon(connectionStatus.status, isMobile)}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: 1,
          minWidth: 0, // Dla lepszego działania text-overflow
          flexShrink: 1
        }}>
          <Typography 
            variant={isMobile ? "body2" : "body1"}
            sx={{ 
              color: getStatusColor(connectionStatus.status),
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {connectionStatus.status}
          </Typography>
          {connectionStatus.substatus && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                marginLeft: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexShrink: 1
              }}
            >
              {connectionStatus.substatus}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatusBar;
