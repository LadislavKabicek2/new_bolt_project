import { describe, it, expect, beforeEach, vi } from 'vitest';
import { priceCache } from '../lib/utils/cache';
import type { StockPrice } from '../lib/types';

describe('PriceCache', () => {
  const mockData: StockPrice = {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    price: 150.25,
    change: 2.5,
    changePct: 1.69,
    marketPhase: 'regular',
    lastTradeTime: '2025-10-05T15:59:59Z',
    currency: 'USD',
    source: 'polygon',
  };

  beforeEach(() => {
    priceCache.clear();
  });

  it('should return null for non-existent keys', () => {
    expect(priceCache.get('AAPL')).toBeNull();
  });

  it('should store and retrieve data', () => {
    priceCache.set('AAPL', mockData);
    const cached = priceCache.get('AAPL');
    expect(cached).toEqual(mockData);
  });

  it('should expire data after TTL', async () => {
    vi.useFakeTimers();

    priceCache.set('AAPL', mockData);
    expect(priceCache.get('AAPL')).toEqual(mockData);

    // Fast-forward time beyond TTL (15 seconds + 1 second)
    vi.advanceTimersByTime(16000);

    expect(priceCache.get('AAPL')).toBeNull();

    vi.useRealTimers();
  });

  it('should clear all cached data', () => {
    priceCache.set('AAPL', mockData);
    priceCache.set('MSFT', { ...mockData, ticker: 'MSFT' });

    priceCache.clear();

    expect(priceCache.get('AAPL')).toBeNull();
    expect(priceCache.get('MSFT')).toBeNull();
  });
});
