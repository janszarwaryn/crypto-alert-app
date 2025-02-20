import React, { useContext } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { StreamContext } from '../context/StreamContext';
import { Order } from '../types';

const MonitorPage: React.FC = () => {
  const { orders } = useContext(StreamContext);

  const getAlertType = (order: Order) => {
    if (order.usdValue > 1_000_000) return 'big';
    if (order.btcValue > 10) return 'solid';
    if (order.usdValue < 50_000) return 'cheap';
    return null;
  };

  const getAlertColor = (order: Order) => {
    const type = getAlertType(order);
    switch (type) {
      case 'big': return '#2196f3';
      case 'solid': return '#4caf50';
      case 'cheap': return '#ff9800';
      default: return 'inherit';
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Orders Feed (500)
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Amount (BTC)</TableCell>
              <TableCell align="right">Total (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={`${order.timestamp.getTime()}-${index}`}
                sx={{
                  color: getAlertColor(order),
                  '& > td': {
                    color: getAlertColor(order)
                  }
                }}
              >
                <TableCell>
                  {order.timestamp.toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  {order.type.toUpperCase()}
                </TableCell>
                <TableCell align="right">
                  ${order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right">
                  {order.btcValue.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 })}
                </TableCell>
                <TableCell align="right">
                  ${order.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MonitorPage;