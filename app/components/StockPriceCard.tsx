'use client';

import { StockPrice } from '@/lib/types';
import {
  formatPrice,
  formatChange,
  formatChangePct,
  formatDateTime,
} from '@/lib/utils/formatting';

interface StockPriceCardProps {
  data: StockPrice;
}

const marketPhaseLabels: Record<StockPrice['marketPhase'], string> = {
  'pre-market': 'Pre-market',
  regular: 'Běžné obchodování',
  'after-hours': 'After-hours',
  closed: 'Zavřeno',
  unknown: 'Neznámé',
};

export function StockPriceCard({ data }: StockPriceCardProps) {
  const isPositive = data.change >= 0;
  const changeColor = isPositive
    ? 'text-green-600'
    : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            {data.ticker}
          </h2>
          <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
            {marketPhaseLabels[data.marketPhase]}
          </span>
        </div>
        {data.companyName && (
          <p className="text-gray-600 text-sm mt-1">{data.companyName}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          ${formatPrice(data.price)}
        </div>
        <div className={`text-xl font-semibold ${changeColor}`}>
          {formatChange(data.change)} ({formatChangePct(data.changePct)})
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Poslední obchod:</span>
          <span className="font-medium">
            {formatDateTime(data.lastTradeTime)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Měna:</span>
          <span className="font-medium">{data.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Zdroj:</span>
          <span className="font-medium capitalize">{data.source}</span>
        </div>
      </div>
    </div>
  );
}
