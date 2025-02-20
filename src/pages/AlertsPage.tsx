import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  Button,
  Dialog
} from '@mui/material';
import { StreamContext } from '../context/StreamContext';
import { useSettings } from '../context/SettingsContext';
import { Order } from '../types';
import { SettingsDialog } from '../components/SettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';

const ALERT_COLORS = {
  CHEAP: '#ff9800',
  SOLID: '#4caf50',
  BIG: '#2196f3'
};

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const formatPrice = (price: number): string => 
  price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatBTC = (amount: number): string =>
  amount.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

interface AlertTableProps {
  title: string;
  alerts: Order[];
  color: string;
  threshold: number;
  unit?: string;
  condition: string;
}

const AlertTable: React.FC<AlertTableProps> = ({
  title,
  alerts,
  color,
  threshold,
  unit = '$',
  condition
}) => {
  const theme = useTheme();
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  const filteredAlerts = alerts.filter(alert => {
    const isRecent = alert.timestamp > oneMinuteAgo;
    const value = unit === '$' ? alert.usdValue : alert.btcValue;
    const meetsThreshold = condition.includes('Above') ? value > threshold : value < threshold;
    return isRecent && meetsThreshold;
  });

  return (
    <Box
      sx={{
        marginBottom: 4,
        position: 'relative',
      }}
      className="transition-all duration-300 ease-out"
    >
      <Typography
        variant="h6"
        sx={{
          color,
          marginBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: color,
            animation: filteredAlerts.length > 0 ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                boxShadow: `0 0 0 0 ${alpha(color, 0.4)}`,
              },
              '70%': {
                boxShadow: `0 0 0 10px ${alpha(color, 0)}`,
              },
              '100%': {
                boxShadow: `0 0 0 0 ${alpha(color, 0)}`,
              },
            },
          }}
        />
        {title} ({filteredAlerts.length})
        <Box
          component="span"
          sx={{
            color: alpha(color, 0.7),
            marginLeft: 1,
            fontSize: '0.875rem'
          }}
        >
          {condition} {unit}{threshold.toLocaleString()}
        </Box>
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'background.paper',
          maxHeight: '300px',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
            },
          },
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95) + ' !important',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 'bold',
                  color: alpha(theme.palette.text.primary, 0.95),
                  borderBottom: `2px solid ${alpha(color, 0.3)}`,
                  width: '160px',
                  minWidth: '160px',
                }}
              >
                Time
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95) + ' !important',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 'bold',
                  color: alpha(theme.palette.text.primary, 0.95),
                  borderBottom: `2px solid ${alpha(color, 0.3)}`,
                  width: '100px',
                  minWidth: '100px',
                }}
              >
                Type
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95) + ' !important',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 'bold',
                  color: alpha(theme.palette.text.primary, 0.95),
                  borderBottom: `2px solid ${alpha(color, 0.3)}`,
                  width: '140px',
                  minWidth: '140px',
                }}
              >
                Price
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95) + ' !important',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 'bold',
                  color: alpha(theme.palette.text.primary, 0.95),
                  borderBottom: `2px solid ${alpha(color, 0.3)}`,
                  width: '180px',
                  minWidth: '180px',
                }}
              >
                Amount (BTC)
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95) + ' !important',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 'bold',
                  color: alpha(theme.palette.text.primary, 0.95),
                  borderBottom: `2px solid ${alpha(color, 0.3)}`,
                  width: '160px',
                  minWidth: '160px',
                }}
              >
                Total (USD)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.map((alert, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: alpha(color, index % 2 === 0 ? 0.03 : 0.05),
                  '&:hover': {
                    backgroundColor: alpha(color, 0.1),
                  },
                }}
              >
                <TableCell>{formatTime(alert.timestamp)}</TableCell>
                <TableCell>{alert.type.toUpperCase()}</TableCell>
                <TableCell align="right">${formatPrice(alert.price)}</TableCell>
                <TableCell align="right">{formatBTC(alert.btcValue)}</TableCell>
                <TableCell align="right">${formatPrice(alert.usdValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const AlertsPage: React.FC = () => {
  const { alerts } = useContext(StreamContext);
  const { settings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5">
          Real-time Alerts
        </Typography>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => setIsSettingsOpen(true)}
        >
          Configure Thresholds
        </Button>
      </Box>

      <Box 
        sx={{ 
          padding: 2, 
          marginBottom: 3, 
          backgroundColor: 'warning.main', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant="body1" color="warning.contrastText">
          ⚠️ Default alert thresholds may not show many alerts in current market conditions. 
          Click "Configure Thresholds" to adjust values for better monitoring.
        </Typography>
      </Box>

      <AlertTable
        title="Cheap Orders"
        alerts={alerts.cheap}
        color={ALERT_COLORS.CHEAP}
        threshold={settings.cheapThreshold}
        condition="Below "
      />

      <AlertTable
        title="Solid Orders"
        alerts={alerts.solid}
        color={ALERT_COLORS.SOLID}
        threshold={settings.solidThreshold}
        unit="BTC"
        condition="Above "
      />

      <AlertTable
        title="Big Business"
        alerts={alerts.big}
        color={ALERT_COLORS.BIG}
        threshold={settings.bigThreshold}
        condition="Above "
      />

      <SettingsDialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Box>
  );
};

export default AlertsPage;
