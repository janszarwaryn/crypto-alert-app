import React from 'react';
import { render } from '@testing-library/react';
import { Order } from '../types';
import VirtualizedOrderList from '../components/VirtualizedOrderList';
import CacheStats from '../components/CacheStats';
import { StreamContext } from '../context/StreamContext';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

const createMockOrder = (index: number): Order => ({
  timestamp: new Date(Date.now() - index * 1000),
  price: 50000 + Math.random() * 1000,
  quantity: Math.random() * 2,
  type: Math.random() > 0.5 ? 'buy' : 'sell',
  usdValue: 50000 + Math.random() * 1000,
  btcValue: Math.random() * 2
});

const createMockOrders = (count: number): Order[] =>
  Array.from({ length: count }, (_, i) => createMockOrder(i));

describe('Component Performance Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('VirtualizedOrderList Performance', () => {
    it('should render large lists efficiently', () => {
      const orders = createMockOrders(1000);

      const startTime = performance.now();

      render(
        <ThemeProvider theme={theme}>
          <div style={{ height: '500px', width: '800px' }}>
            <VirtualizedOrderList orders={orders} />
          </div>
        </ThemeProvider>
      );

      const renderTime = performance.now() - startTime;
      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
    });

    it('should handle updates efficiently', () => {
      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <div style={{ height: '500px', width: '800px' }}>
            <VirtualizedOrderList orders={createMockOrders(100)} />
          </div>
        </ThemeProvider>
      );

      const updateTimes: number[] = [];

      // Test multiple updates
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();

        rerender(
          <ThemeProvider theme={theme}>
            <div style={{ height: '500px', width: '800px' }}>
              <VirtualizedOrderList orders={createMockOrders(100)} />
            </div>
          </ThemeProvider>
        );

        updateTimes.push(performance.now() - startTime);
      }

      // Calculate average update time
      const avgUpdateTime = updateTimes.reduce((a, b) => a + b) / updateTimes.length;
      expect(avgUpdateTime).toBeLessThan(50); // Average update should be less than 50ms
    });
  });

  describe('CacheStats Performance', () => {
    it('should render and update efficiently', () => {
      const mockStats = {
        hits: 1000,
        misses: 200,
        size: 500,
        evictions: 100,
        hitRatio: 0.8
      };

      const startTime = performance.now();

      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <CacheStats />
        </ThemeProvider>
      );

      const initialRenderTime = performance.now() - startTime;
      expect(initialRenderTime).toBeLessThan(50); // Initial render should be fast

      const updateTimes: number[] = [];

      // Test multiple updates
      for (let i = 0; i < 10; i++) {
        const updateStartTime = performance.now();

        rerender(
          <ThemeProvider theme={theme}>
            <CacheStats />
          </ThemeProvider>
        );

        updateTimes.push(performance.now() - updateStartTime);
      }

      const avgUpdateTime = updateTimes.reduce((a, b) => a + b) / updateTimes.length;
      expect(avgUpdateTime).toBeLessThan(20); // Updates should be very fast
    });
  });

  describe('Component Memory Usage', () => {
    it('should not leak memory during updates', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const orders = createMockOrders(1000);
      const memoryMeasurements: number[] = [];

      const { rerender } = render(
        <ThemeProvider theme={theme}>
          <div style={{ height: '500px', width: '800px' }}>
            <VirtualizedOrderList orders={orders} />
          </div>
        </ThemeProvider>
      );

      // Perform multiple updates
      for (let i = 0; i < 100; i++) {
        rerender(
          <ThemeProvider theme={theme}>
            <div style={{ height: '500px', width: '800px' }}>
              <VirtualizedOrderList orders={createMockOrders(1000)} />
            </div>
          </ThemeProvider>
        );

        if (i % 10 === 0) {
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }

          const currentMemory = process.memoryUsage().heapUsed;
          const memoryDiff = currentMemory - initialMemory;
          memoryMeasurements.push(memoryDiff);
        }
      }

      // Verify all memory measurements are within bounds
      const maxMemoryGrowth = Math.max(...memoryMeasurements);
      expect(maxMemoryGrowth).toBeLessThan(20 * 1024 * 1024); // Less than 20MB growth
    });
  });
});
