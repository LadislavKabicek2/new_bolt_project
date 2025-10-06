'use client';

import { useState, FormEvent } from 'react';

interface TickerInputProps {
  onSubmit: (ticker: string) => void;
  isLoading: boolean;
}

export function TickerInput({ onSubmit, isLoading }: TickerInputProps) {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (ticker.trim() && !isLoading) {
      onSubmit(ticker.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="ticker"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            US Ticker
          </label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Zadej US ticker, např. AAPL"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
            maxLength={10}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !ticker.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isLoading ? 'Načítám...' : 'Zobrazit cenu'}
        </button>
      </div>
    </form>
  );
}
