import { describe, it, expect } from 'vitest';
import { validateTicker, normalizeTicker } from '../lib/utils/validation';

describe('validateTicker', () => {
  it('should accept valid tickers', () => {
    expect(validateTicker('AAPL').isValid).toBe(true);
    expect(validateTicker('MSFT').isValid).toBe(true);
    expect(validateTicker('BRK.B').isValid).toBe(true);
    expect(validateTicker('BRK-B').isValid).toBe(true);
  });

  it('should reject empty tickers', () => {
    const result = validateTicker('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Ticker nemůže být prázdný');
  });

  it('should reject tickers that are too long', () => {
    const result = validateTicker('VERYLONGTICKER');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Ticker musí mít 1-10 znaků');
  });

  it('should reject tickers with invalid characters', () => {
    const result = validateTicker('AAPL123');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      'Ticker může obsahovat pouze A-Z, tečku a pomlčku'
    );
  });

  it('should reject lowercase tickers', () => {
    const result = validateTicker('aapl');
    expect(result.isValid).toBe(false);
  });
});

describe('normalizeTicker', () => {
  it('should convert to uppercase', () => {
    expect(normalizeTicker('aapl')).toBe('AAPL');
    expect(normalizeTicker('msft')).toBe('MSFT');
  });

  it('should trim whitespace', () => {
    expect(normalizeTicker('  AAPL  ')).toBe('AAPL');
    expect(normalizeTicker('MSFT ')).toBe('MSFT');
  });
});
