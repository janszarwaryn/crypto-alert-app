import { Order } from '../types';

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
}

export class OrderCache {
  private static instance: OrderCache;
  private cache: Map<string, Order>;
  private stats: CacheStats;
  private readonly maxSize: number;
  private readonly evictionBatchSize: number;

  private constructor(maxSize = 1000, evictionBatchSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.evictionBatchSize = evictionBatchSize;
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      evictions: 0
    };
  }

  public static getInstance(): OrderCache {
    if (!OrderCache.instance) {
      OrderCache.instance = new OrderCache();
    }
    return OrderCache.instance;
  }

  private generateKey(order: Order): string {
    return `${order.timestamp.getTime()}-${order.price}-${order.quantity}`;
  }

  private evictOldest(): void {
    if (this.cache.size <= this.maxSize - this.evictionBatchSize) {
      return;
    }

    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp.getTime() - b.timestamp.getTime());

    const toEvict = entries.slice(0, this.evictionBatchSize);
    toEvict.forEach(([key]) => {
      this.cache.delete(key);
      this.stats.evictions++;
    });

    this.stats.size = this.cache.size;
  }

  public set(order: Order): void {
    const key = this.generateKey(order);
    
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, order);
    this.stats.size = this.cache.size;
  }

  public get(order: Order): Order | undefined {
    const key = this.generateKey(order);
    const cachedOrder = this.cache.get(key);

    if (cachedOrder) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }

    return cachedOrder;
  }

  public has(order: Order): boolean {
    const key = this.generateKey(order);
    const exists = this.cache.has(key);

    if (exists) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }

    return exists;
  }

  public clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.evictions = 0;
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public getHitRatio(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }
}

export const orderCache = OrderCache.getInstance(); 