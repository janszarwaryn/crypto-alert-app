import React, { memo, useCallback, useMemo } from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { Order } from '../types';
import { styled, alpha } from '@mui/material';

interface VirtualizedOrderListProps {
  orders: Order[];
  className?: string;
}

const ListContainer = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  '& *::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
    backgroundColor: 'transparent',
  },
  '& *::-webkit-scrollbar-track': {
    background: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '4px',
  },
  '& *::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.4),
    },
  },
  '& *::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: `${alpha(theme.palette.primary.main, 0.3)} ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const StyledList = styled(List)(({ theme }) => ({
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    background: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.4),
    },
  },
  '&::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: `${alpha(theme.palette.primary.main, 0.3)} ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const OrderRowContainer = styled('div')(({ theme }) => ({
  display: 'table-row',
  width: '100%',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const Cell = styled('div')(({ theme }) => ({
  display: 'table-cell',
  padding: theme.spacing(1.5),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&.time-column': {
    width: '140px',
  },
  '&.type-column': {
    width: '80px',
  },
  '&.price-column': {
    width: '120px',
    textAlign: 'right',
  },
  '&.amount-column': {
    width: '160px',
    textAlign: 'right',
  },
  '&.total-column': {
    width: '120px',
    textAlign: 'right',
    paddingRight: theme.spacing(3),
  },
}));

const TableContainer = styled('div')({
  display: 'table',
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
});

const formatPrice = (price: number): string => 
  price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatBTC = (amount: number): string =>
  amount.toLocaleString(undefined, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const OrderRow = memo(({ order, style }: { order: Order; style: React.CSSProperties }) => {
  const formattedPrice = useMemo(() => formatPrice(order.price), [order.price]);
  const formattedBTC = useMemo(() => formatBTC(order.btcValue), [order.btcValue]);
  const formattedUSD = useMemo(() => formatPrice(order.usdValue), [order.usdValue]);
  const formattedTime = useMemo(() => formatTime(order.timestamp), [order.timestamp]);
  
  return (
    <TableContainer style={style}>
      <OrderRowContainer>
        <Cell className="time-column">
          {formattedTime}
        </Cell>
        <Cell className="type-column">
          {order.type.toUpperCase()}
        </Cell>
        <Cell className="price-column">
          ${formattedPrice}
        </Cell>
        <Cell className="amount-column">
          {formattedBTC}
        </Cell>
        <Cell className="total-column">
          ${formattedUSD}
        </Cell>
      </OrderRowContainer>
    </TableContainer>
  );
});

OrderRow.displayName = 'OrderRow';

const VirtualizedOrderList: React.FC<VirtualizedOrderListProps> = memo(({ orders, className }) => {
  const rowHeight = 48;

  const rowRenderer = useCallback(({ index, key, style }: ListRowProps) => (
    <OrderRow
      key={key}
      order={orders[index]}
      style={style}
    />
  ), [orders]);

  return (
    <ListContainer className={className}>
      <AutoSizer>
        {({ height, width }) => (
          <StyledList
            height={height}
            width={width}
            rowCount={orders.length}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
    </ListContainer>
  );
});

VirtualizedOrderList.displayName = 'VirtualizedOrderList';

export default VirtualizedOrderList;