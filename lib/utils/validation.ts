export function validateTicker(ticker: string): {
  isValid: boolean;
  error?: string;
} {
  if (!ticker || ticker.trim().length === 0) {
    return { isValid: false, error: 'Ticker nemůže být prázdný' };
  }

  const trimmed = ticker.trim();

  if (trimmed.length < 1 || trimmed.length > 10) {
    return {
      isValid: false,
      error: 'Ticker musí mít 1-10 znaků',
    };
  }

  const validPattern = /^[A-Z.\-]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Ticker může obsahovat pouze A-Z, tečku a pomlčku',
    };
  }

  return { isValid: true };
}

export function normalizeTicker(ticker: string): string {
  return ticker.trim().toUpperCase();
}
