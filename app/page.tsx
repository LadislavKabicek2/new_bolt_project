'use client';

import { useState } from 'react';
import { TickerInput } from './components/TickerInput';
import { StockPriceCard } from './components/StockPriceCard';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { StockPrice, PriceError } from '@/lib/types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StockPrice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastTicker, setLastTicker] = useState<string>('');

  const fetchPrice = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    setLastTicker(ticker);

    try {
      const response = await fetch(`/api/price?ticker=${encodeURIComponent(ticker)}`);
      const json = await response.json();

      if (!response.ok) {
        const errorData = json as PriceError;
        setError(errorData.error);
        return;
      }

      setData(json as StockPrice);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Nepodařilo se načíst data. Zkontrolujte připojení k internetu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastTicker) {
      fetchPrice(lastTicker);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            US Ticker Price
          </h1>
          <p className="text-gray-600">
            Zobrazení aktuální ceny amerických akcií
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Data mohou být zpožděná dle poskytovatele
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <TickerInput onSubmit={fetchPrice} isLoading={loading} />

          {loading && <LoadingSpinner />}

          {error && !loading && (
            <ErrorDisplay message={error} onRetry={handleRetry} />
          )}

          {data && !loading && !error && <StockPriceCard data={data} />}
        </div>
      </div>
    </main>
  );
}
