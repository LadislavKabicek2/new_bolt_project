export function formatPrice(price: number): string {
  // For prices < 1 USD, show 4 decimal places
  if (price < 1) {
    return price.toFixed(4);
  }
  // Otherwise show 2 decimal places
  return price.toFixed(2);
}

export function formatChange(change: number): string {
  const formatted = Math.abs(change).toFixed(2);
  return change >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatChangePct(changePct: number): string {
  const formatted = Math.abs(changePct).toFixed(2);
  return changePct >= 0 ? `+${formatted}%` : `-${formatted}%`;
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('cs-CZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}
