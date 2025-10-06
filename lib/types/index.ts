export interface StockPrice {
  ticker: string;
  companyName: string | null;
  price: number;
  change: number;
  changePct: number;
  marketPhase: 'pre-market' | 'regular' | 'after-hours' | 'closed' | 'unknown';
  lastTradeTime: string;
  currency: string;
  source: string;
}

export interface PriceError {
  error: string;
  details?: string;
}

export type PriceResponse = StockPrice | PriceError;

export interface PriceProvider {
  getPrice(ticker: string): Promise<StockPrice>;
  getName(): string;
}
