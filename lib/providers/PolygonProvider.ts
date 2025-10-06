import { PriceProvider, StockPrice } from '../types';

interface PolygonTickerDetails {
  results?: {
    name?: string;
  };
}

interface PolygonPreviousClose {
  results?: Array<{
    c?: number;
  }>;
}

interface PolygonSnapshot {
  ticker?: {
    day?: {
      c?: number;
      o?: number;
    };
    prevDay?: {
      c?: number;
    };
    lastTrade?: {
      p?: number;
      t?: number;
    };
    todaysChange?: number;
    todaysChangePerc?: number;
  };
}

export class PolygonProvider implements PriceProvider {
  private apiKey: string;
  private baseUrl = 'https://api.polygon.io';

  constructor(apiKey: string) {
    if (!apiKey || apiKey === 'your_polygon_api_key_here') {
      throw new Error('Polygon API key is required');
    }
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'polygon';
  }

  async getPrice(ticker: string): Promise<StockPrice> {
    try {
      // Get ticker details for company name
      const detailsPromise = this.fetchTickerDetails(ticker);

      // Get snapshot for current and previous prices
      const snapshotPromise = this.fetchSnapshot(ticker);

      const [details, snapshot] = await Promise.all([
        detailsPromise,
        snapshotPromise,
      ]);

      const companyName = details?.results?.name || null;
      const lastTrade = snapshot?.ticker?.lastTrade;
      const prevClose = snapshot?.ticker?.prevDay?.c;
      const todaysChange = snapshot?.ticker?.todaysChange;
      const todaysChangePerc = snapshot?.ticker?.todaysChangePerc;

      if (!lastTrade?.p || prevClose === undefined) {
        throw new Error('Price data not available');
      }

      const price = lastTrade.p;
      const change = todaysChange ?? price - prevClose;
      const changePct = todaysChangePerc ?? (change / prevClose) * 100;

      const lastTradeTime = lastTrade.t
        ? new Date(lastTrade.t / 1000000).toISOString()
        : new Date().toISOString();

      const marketPhase = this.getMarketPhase(new Date(lastTradeTime));

      return {
        ticker: ticker.toUpperCase(),
        companyName,
        price,
        change,
        changePct,
        marketPhase,
        lastTradeTime,
        currency: 'USD',
        source: 'polygon',
      };
    } catch (error) {
      console.error('Polygon API error:', error);
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('INVALID_TICKER');
        }
        if (error.message.includes('429')) {
          throw new Error('RATE_LIMIT');
        }
      }
      throw new Error('API_ERROR');
    }
  }

  private async fetchTickerDetails(
    ticker: string
  ): Promise<PolygonTickerDetails> {
    const url = `${this.baseUrl}/v3/reference/tickers/${ticker}?apiKey=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  private async fetchSnapshot(ticker: string): Promise<PolygonSnapshot> {
    const url = `${this.baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  private getMarketPhase(
    tradeTime: Date
  ): 'pre-market' | 'regular' | 'after-hours' | 'closed' | 'unknown' {
    const hours = tradeTime.getUTCHours();
    const minutes = tradeTime.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // US Eastern Time market hours (in UTC):
    // Pre-market: 4:00 AM - 9:30 AM ET = 8:00 - 13:30 UTC (summer) or 9:00 - 14:30 UTC (winter)
    // Regular: 9:30 AM - 4:00 PM ET = 13:30 - 20:00 UTC (summer) or 14:30 - 21:00 UTC (winter)
    // After-hours: 4:00 PM - 8:00 PM ET = 20:00 - 00:00 UTC (summer) or 21:00 - 01:00 UTC (winter)

    // Simplified approach (assumes summer time)
    const preMarketStart = 8 * 60; // 8:00 UTC
    const regularStart = 13 * 60 + 30; // 13:30 UTC
    const regularEnd = 20 * 60; // 20:00 UTC
    const afterHoursEnd = 24 * 60; // 24:00 UTC

    if (timeInMinutes >= preMarketStart && timeInMinutes < regularStart) {
      return 'pre-market';
    } else if (timeInMinutes >= regularStart && timeInMinutes < regularEnd) {
      return 'regular';
    } else if (timeInMinutes >= regularEnd && timeInMinutes < afterHoursEnd) {
      return 'after-hours';
    }

    return 'closed';
  }
}
