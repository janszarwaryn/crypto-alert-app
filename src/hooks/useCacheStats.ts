import { useState, useEffect } from 'react';
import { orderCache } from '../services/OrderCache';

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
  hitRatio: number;
}

export const useCacheStats = (updateInterval = 1000): CacheStats => {
  const [stats, setStats] = useState<CacheStats>({
    ...orderCache.getStats(),
    hitRatio: orderCache.getHitRatio()
  });

  useEffect(() => {
    const updateStats = () => {
      setStats({
        ...orderCache.getStats(),
        hitRatio: orderCache.getHitRatio()
      });
    };

    const interval = setInterval(updateStats, updateInterval);
    updateStats(); // Initial update

    return () => {
      clearInterval(interval);
    };
  }, [updateInterval]);

  return stats;
}; 