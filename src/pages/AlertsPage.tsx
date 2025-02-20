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
  Button
} from '@mui/material';
import { StreamContext } from '../context/StreamContext';
import { useSettings } from '../context/SettingsContext';
import { format } from 'date-fns';
import { Order } from '../types';
import { SettingsDialog } from '../components/SettingsDialog';
import SettingsIcon from '@mui/icons-material/Settings';

const ALERT_COLORS = {
  CHEAP: '#ff9800',
  SOLID: '#4caf50',
  BIG: '#2196f3'
};

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
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.95) + ' !important',
                  backdropFilter: 'blur(8px)',
                  fontWeight: 'bold',
                  color: alpha(theme.palette.text.primary, 0.95),
                  borderBottom: `2px solid ${alpha(color, 0.3)}`,
                }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.map((alert, index) => (
              <TableRow
                key={`${alert.timestamp.getTime()}-${alert.price}-${alert.quantity}-${index}`}
                className="animate-slide-in opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TableCell component="th" scope="row">
                  {format(alert.timestamp, 'HH:mm:ss')}
                </TableCell>
                <TableCell>{alert.type.toUpperCase()}</TableCell>
                <TableCell align="right">
                  ${alert.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  {alert.btcValue.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}
                </TableCell>
                <TableCell align="right">
                  ${alert.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
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
