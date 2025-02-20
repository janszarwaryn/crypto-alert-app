import React from 'react';
import { Box, CircularProgress, Typography, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import CloseIcon from '@mui/icons-material/Close';

interface LoadingOverlayProps {
  isVisible: boolean;
  status: string;
  substatus?: string;
  onClose?: () => void;
}

const StyledOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: theme.zIndex.modal + 1,
  opacity: 1,
  transition: 'opacity 0.3s ease-in-out',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  maxWidth: '400px',
  width: '90%',
  position: 'relative',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.grey[500],
}));

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
      return <ErrorIcon sx={{ fontSize: 48, color: getStatusColor(status) }} />;
    case 'connected':
    case 'live':
      return <CheckCircleIcon sx={{ fontSize: 48, color: getStatusColor(status) }} />;
    case 'disconnected':
      return <SyncIcon sx={{ fontSize: 48, color: getStatusColor(status) }} />;
    default:
      return <CircularProgress size={48} sx={{ color: getStatusColor(status) }} />;
  }
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, status, substatus, onClose }) => {
  if (!isVisible) return null;

  return (
    <StyledOverlay>
      <StyledPaper elevation={3}>
        {onClose && (
          <CloseButton
            aria-label="close"
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </CloseButton>
        )}
        {getStatusIcon(status)}
        <Box textAlign="center">
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ color: getStatusColor(status) }}
          >
            {status}
          </Typography>
          {substatus && (
            <Typography variant="body2" color="text.secondary">
              {substatus}
            </Typography>
          )}
        </Box>
      </StyledPaper>
    </StyledOverlay>
  );
};

export default LoadingOverlay;