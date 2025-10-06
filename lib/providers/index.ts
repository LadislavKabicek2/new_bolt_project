import { PriceProvider } from '../types';
import { PolygonProvider } from './PolygonProvider';

export function createProvider(): PriceProvider {
  const provider = process.env.PROVIDER || 'polygon';
  const apiKey = process.env.POLYGON_API_KEY || '';

  switch (provider.toLowerCase()) {
    case 'polygon':
      return new PolygonProvider(apiKey);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export { PolygonProvider };
