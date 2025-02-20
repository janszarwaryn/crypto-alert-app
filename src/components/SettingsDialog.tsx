import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack
} from '@mui/material';
import { useSettings } from '../context/SettingsContext';
import { useContext } from 'react';
import { StreamContext } from '../context/StreamContext';

const DEFAULT_SETTINGS = {
  cheapThreshold: 50000,
  solidThreshold: 10,
  bigThreshold: 1000000,
  apiKey: process.env.REACT_APP_CRYPTO_API_KEY || ''
};

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const { setConnectionStatus } = useContext(StreamContext);
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field: keyof typeof settings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Allow empty input or decimal point
    if (value === '' || value === '.') {
      setLocalSettings(prev => ({ ...prev, [field]: value }));
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setLocalSettings(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleSave = () => {
    // Ensure all values are numbers before saving
    const finalSettings = {
      cheapThreshold: typeof localSettings.cheapThreshold === 'string' 
        ? parseFloat(localSettings.cheapThreshold) || DEFAULT_SETTINGS.cheapThreshold 
        : localSettings.cheapThreshold,
      solidThreshold: typeof localSettings.solidThreshold === 'string'
        ? parseFloat(localSettings.solidThreshold) || DEFAULT_SETTINGS.solidThreshold
        : localSettings.solidThreshold,
      bigThreshold: typeof localSettings.bigThreshold === 'string'
        ? parseFloat(localSettings.bigThreshold) || DEFAULT_SETTINGS.bigThreshold
        : localSettings.bigThreshold,
      apiKey: localSettings.apiKey // Keep current API key
    };
    
    // Update settings in context
    updateSettings(finalSettings);
    
    // Close dialog immediately
    onClose();

    // Show settings updated message
    setConnectionStatus({
      isLoading: true,
      status: 'Live',
      substatus: 'Real-time trade data stream is now active'
    });

    // Hide overlay after delay
    setTimeout(() => {
      setConnectionStatus({
        isLoading: false,
        status: 'Live',
        substatus: 'Real-time trade data stream is now active'
      });
    }, 1000);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Alert Thresholds Configuration
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Adjust these thresholds to control when different types of alerts are triggered.
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Cheap Order Threshold (USD)"
            value={localSettings.cheapThreshold}
            onChange={handleChange('cheapThreshold')}
            fullWidth
            type="number"
            InputProps={{
              startAdornment: '$',
            }}
          />
          <TextField
            label="Solid Order Threshold (BTC)"
            value={localSettings.solidThreshold}
            onChange={handleChange('solidThreshold')}
            fullWidth
            type="number"
            inputProps={{
              step: "0.0001"
            }}
            InputProps={{
              endAdornment: 'BTC',
            }}
          />
          <TextField
            label="Big Business Threshold (USD)"
            value={localSettings.bigThreshold}
            onChange={handleChange('bigThreshold')}
            fullWidth
            type="number"
            InputProps={{
              startAdornment: '$',
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleReset}
          variant="outlined"
          color="warning"
        >
          Reset to Defaults
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
