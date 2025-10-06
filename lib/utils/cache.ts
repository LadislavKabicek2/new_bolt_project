import { StockPrice } from '../types';

interface CacheEntry {
  data: StockPrice;
  timestamp: number;
}

class PriceCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly ttlMs: number;

  constructor(ttlSeconds: number = 15) {
    this.ttlMs = ttlSeconds * 1000;
  }

  get(ticker: string): StockPrice | null {
    const entry = this.cache.get(ticker);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.ttlMs) {
      this.cache.delete(ticker);
      return null;
    }

    return entry.data;
  }

  set(ticker: string, data: StockPrice): void {
    this.cache.set(ticker, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const priceCache = new PriceCache(15);
