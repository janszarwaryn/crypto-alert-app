import { orderCache } from '../services/OrderCache';
import { Order } from '../types';

const createMockOrder = (index: number): Order => ({
  timestamp: new Date(Date.now() - index * 1000),
  price: 50000 + Math.random() * 1000,
  quantity: Math.random() * 2,
  type: Math.random() > 0.5 ? 'buy' : 'sell',
  usdValue: 50000 + Math.random() * 1000,
  btcValue: Math.random() * 2
});

describe('Performance Tests', () => {
  beforeEach(() => {
    orderCache.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('OrderCache Performance', () => {
    it('should handle rapid cache operations efficiently', () => {
      const startTime = performance.now();
      const operations = 10000;

      // Test cache write performance
      for (let i = 0; i < operations; i++) {
        const order = createMockOrder(i);
        orderCache.set(order);
      }

      const writeTime = performance.now() - startTime;
      expect(writeTime).toBeLessThan(1000); // Should complete in less than 1 second

      // Test cache read performance
      const readStartTime = performance.now();
      for (let i = 0; i < operations; i++) {
        const order = createMockOrder(i);
        orderCache.has(order);
      }

      const readTime = performance.now() - readStartTime;
      expect(readTime).toBeLessThan(500); // Should complete in less than 500ms

      // Test cache eviction performance
      const stats = orderCache.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
      expect(stats.size).toBeLessThanOrEqual(1000);
    });

    it('should maintain good hit ratio under load', () => {
      const operations = 1000;
      const repeatedOperations = 500;

      // Create a pool of orders that we'll reuse
      const orderPool: Order[] = [];
      for (let i = 0; i < 100; i++) {
        orderPool.push(createMockOrder(i));
      }

      // Fill cache with initial data, using some orders multiple times
      for (let i = 0; i < operations; i++) {
        const order = orderPool[i % orderPool.length];
        orderCache.set(order);
      }

      // Perform repeated lookups using the same order pool
      for (let i = 0; i < repeatedOperations; i++) {
        const order = orderPool[i % orderPool.length];
        orderCache.has(order);
      }

      const stats = orderCache.getStats();
      const hitRatio = orderCache.getHitRatio();

      // We expect at least some cache hits since we're reusing orders
      expect(stats.hits).toBeGreaterThan(0);
      expect(hitRatio).toBeGreaterThan(0); // Just ensure we have some hits
    });
  });

  describe('Memory Usage', () => {
    it('should maintain stable memory usage', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const operations = 10000;
      const memoryMeasurements: number[] = [];

      // Perform many operations
      for (let i = 0; i < operations; i++) {
        const order = createMockOrder(i);
        orderCache.set(order);
        
        if (i % 100 === 0) {
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
      expect(maxMemoryGrowth).toBeLessThan(50 * 1024 * 1024); // Less than 50MB growth
    });
  });

  describe('Batch Processing', () => {
    it('should handle batch operations efficiently', () => {
      const batchSize = 100;
      const batches = 100;
      const startTime = performance.now();

      for (let batch = 0; batch < batches; batch++) {
        const orders = Array.from({ length: batchSize }, (_, i) => 
          createMockOrder(batch * batchSize + i)
        );

        // Measure batch processing time
        const batchStartTime = performance.now();
        orders.forEach(order => orderCache.set(order));
        const batchTime = performance.now() - batchStartTime;

        // Each batch should process quickly
        expect(batchTime).toBeLessThan(100); // Less than 100ms per batch
      }

      const totalTime = performance.now() - startTime;
      expect(totalTime).toBeLessThan(10000); // Total time less than 10 seconds
    });
  });
}); 