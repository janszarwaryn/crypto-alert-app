import React, { useContext } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, styled } from '@mui/material';
import { StreamContext } from '../context/StreamContext';
import VirtualizedOrderList from '../components/VirtualizedOrderList';
import CacheStats from '../components/CacheStats';

const TableContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 180px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

const TableHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  top: 0,
  zIndex: 1,
  width: '100%',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  width: '100%',
  tableLayout: 'fixed',
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  fontWeight: 'bold',
  '&.time-column': {
    width: '140px',
  },
  '&.type-column': {
    width: '80px',
  },
  '&.price-column': {
    width: '120px',
  },
  '&.amount-column': {
    width: '160px',
  },
  '&.total-column': {
    width: '120px',
  },
}));

const MonitorPage: React.FC = () => {
  const { orders } = useContext(StreamContext);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Orders Feed ({orders.length}/500)
      </Typography>
      <CacheStats />
      <TableContainer>
        <StyledTable size="small">
          <TableHeader>
            <TableRow>
              <HeaderCell className="time-column">Time</HeaderCell>
              <HeaderCell className="type-column">Type</HeaderCell>
              <HeaderCell className="price-column" align="right">Price</HeaderCell>
              <HeaderCell className="amount-column" align="right">Amount (BTC)</HeaderCell>
              <HeaderCell className="total-column" align="right">Total (USD)</HeaderCell>
            </TableRow>
          </TableHeader>
        </StyledTable>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <VirtualizedOrderList orders={orders} />
        </Box>
      </TableContainer>
    </Box>
  );
};

export default MonitorPage;