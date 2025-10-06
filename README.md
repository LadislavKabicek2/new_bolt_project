# US Ticker Price

Jednoduchá webová aplikace pro zobrazení aktuální ceny amerických akcií s podporou real-time dat z Polygon.io API.

## Funkce

- Zadání US tickeru (např. AAPL, MSFT, NVDA)
- Zobrazení aktuální ceny, změny a procentuální změny
- Informace o fázi trhu (pre-market, regular, after-hours, closed)
- Cache mechanismus (15s) pro minimalizaci API požadavků
- Responsivní UI s českou lokalizací
- Kompletní error handling a validace vstupu

## Požadavky

- Node.js 18+ a npm
- Polygon.io API key (zdarma na https://polygon.io)

## Instalace

1. Naklonujte repozitář
2. Nainstalujte závislosti:

```bash
npm install
```

3. Nakonfigurujte `.env` soubor:

```env
PROVIDER=polygon
POLYGON_API_KEY=your_actual_api_key_here
```

**Důležité:** Nahraďte `your_actual_api_key_here` vaším skutečným API klíčem z Polygon.io.

## Spuštění

### Development

```bash
npm run dev
```

Aplikace běží na `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Testy

```bash
npm test
```

### Linting a Formátování

```bash
npm run lint
npm run format
```

## Struktura projektu

```
.
├── app/
│   ├── api/price/           # Server-side API endpoint
│   ├── components/          # React komponenty
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── lib/
│   ├── providers/           # Data provider abstrakce
│   │   ├── PolygonProvider.ts
│   │   └── index.ts
│   ├── types/               # TypeScript definice
│   └── utils/               # Utility funkce
│       ├── cache.ts         # Cache mechanismus
│       ├── formatting.ts    # Formátování hodnot
│       └── validation.ts    # Validace tickerů
├── __tests__/               # Unit testy
└── ...config files
```

## API Endpoint

### GET /api/price?ticker=NVDA

**Úspěšná odpověď (200 OK):**

```json
{
  "ticker": "NVDA",
  "companyName": "NVIDIA Corp.",
  "price": 123.45,
  "change": -1.23,
  "changePct": -0.99,
  "marketPhase": "regular",
  "lastTradeTime": "2025-10-05T15:59:59Z",
  "currency": "USD",
  "source": "polygon"
}
```

**Chybová odpověď (4xx/5xx):**

```json
{
  "error": "Neplatný ticker nebo ticker nenalezen",
  "details": "INVALID_TICKER"
}
```

## Datový Provider - Polygon.io

Aplikace používá **Polygon.io** jako výchozí datový zdroj:

- **Free tier:** 5 API požadavků/minutu
- **Data:** Real-time i delayed ceny (dle plánu)
- **Pokrytí:** Všechny US akcie, ETF a další instrumenty

### Limity a Doporučení

- Cache (15s) výrazně snižuje počet API volání
- Free tier je dostačující pro běžné použití
- Data mohou být zpožděná (15 minut) na free plánu
- Pro real-time data je potřeba placený plán

### Přidání Dalšího Provideru

Pro přidání nového provideru (např. Alpha Vantage):

1. Vytvořte novou třídu implementující `PriceProvider` interface:

```typescript
// lib/providers/AlphaVantageProvider.ts
import { PriceProvider, StockPrice } from '../types';

export class AlphaVantageProvider implements PriceProvider {
  constructor(apiKey: string) {
    // ...
  }

  getName(): string {
    return 'alphavantage';
  }

  async getPrice(ticker: string): Promise<StockPrice> {
    // Implementace volání Alpha Vantage API
  }
}
```

2. Přidejte do factory funkce v `lib/providers/index.ts`:

```typescript
import { AlphaVantageProvider } from './AlphaVantageProvider';

export function createProvider(): PriceProvider {
  const provider = process.env.PROVIDER || 'polygon';

  switch (provider.toLowerCase()) {
    case 'polygon':
      return new PolygonProvider(process.env.POLYGON_API_KEY || '');
    case 'alphavantage':
      return new AlphaVantageProvider(process.env.ALPHAVANTAGE_API_KEY || '');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
```

3. Aktualizujte `.env`:

```env
PROVIDER=alphavantage
ALPHAVANTAGE_API_KEY=your_key_here
```

## Technologie

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Vitest** (unit testy)
- **ESLint + Prettier** (code quality)

## Licence

ISC
