import { NextRequest, NextResponse } from 'next/server';
import { createProvider } from '@/lib/providers';
import { priceCache } from '@/lib/utils/cache';
import { validateTicker, normalizeTicker } from '@/lib/utils/validation';
import type { PriceError, StockPrice } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawTicker = searchParams.get('ticker');

    if (!rawTicker) {
      const error: PriceError = {
        error: 'Ticker je povinný parametr',
      };
      return NextResponse.json(error, { status: 400 });
    }

    const normalizedTicker = normalizeTicker(rawTicker);
    const validation = validateTicker(normalizedTicker);

    if (!validation.isValid) {
      const error: PriceError = {
        error: validation.error || 'Neplatný ticker',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Check cache first
    const cached = priceCache.get(normalizedTicker);
    if (cached) {
      console.log(`[Cache hit] ${normalizedTicker}`);
      return NextResponse.json(cached);
    }

    console.log(`[Cache miss] ${normalizedTicker} - fetching from provider`);

    // Fetch from provider
    const provider = createProvider();
    const priceData = await provider.getPrice(normalizedTicker);

    // Store in cache
    priceCache.set(normalizedTicker, priceData);

    return NextResponse.json(priceData);
  } catch (error) {
    console.error('[API Error]', error);

    let errorMessage = 'Nepodařilo se načíst cenu';
    let errorDetails: string | undefined;
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message === 'INVALID_TICKER') {
        errorMessage = 'Neplatný ticker nebo ticker nenalezen';
        errorDetails = 'INVALID_TICKER';
        statusCode = 404;
      } else if (error.message === 'RATE_LIMIT') {
        errorMessage = 'Překročen limit API požadavků, zkuste to později';
        errorDetails = 'RATE_LIMIT';
        statusCode = 429;
      } else if (error.message === 'API_ERROR') {
        errorMessage = 'Chyba při komunikaci s API';
        errorDetails = 'API_ERROR';
        statusCode = 503;
      } else if (error.message.includes('API key')) {
        errorMessage = 'Chyba konfigurace API';
        errorDetails = 'CONFIG_ERROR';
        statusCode = 500;
      }
    }

    const errorResponse: PriceError = {
      error: errorMessage,
      details: errorDetails,
    };

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
