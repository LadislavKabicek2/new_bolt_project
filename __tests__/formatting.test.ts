import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatChange,
  formatChangePct,
} from '../lib/utils/formatting';

describe('formatPrice', () => {
  it('should format prices >= 1 with 2 decimals', () => {
    expect(formatPrice(123.456)).toBe('123.46');
    expect(formatPrice(1.5)).toBe('1.50');
    expect(formatPrice(100)).toBe('100.00');
  });

  it('should format prices < 1 with 4 decimals', () => {
    expect(formatPrice(0.1234)).toBe('0.1234');
    expect(formatPrice(0.5678)).toBe('0.5678');
    expect(formatPrice(0.1)).toBe('0.1000');
  });
});

describe('formatChange', () => {
  it('should format positive changes with + sign', () => {
    expect(formatChange(1.23)).toBe('+1.23');
    expect(formatChange(0.01)).toBe('+0.01');
  });

  it('should format negative changes with - sign', () => {
    expect(formatChange(-1.23)).toBe('-1.23');
    expect(formatChange(-0.01)).toBe('-0.01');
  });

  it('should handle zero correctly', () => {
    expect(formatChange(0)).toBe('+0.00');
  });
});

describe('formatChangePct', () => {
  it('should format positive percentage changes', () => {
    expect(formatChangePct(5.67)).toBe('+5.67%');
    expect(formatChangePct(0.12)).toBe('+0.12%');
  });

  it('should format negative percentage changes', () => {
    expect(formatChangePct(-5.67)).toBe('-5.67%');
    expect(formatChangePct(-0.12)).toBe('-0.12%');
  });

  it('should handle zero percentage', () => {
    expect(formatChangePct(0)).toBe('+0.00%');
  });
});
