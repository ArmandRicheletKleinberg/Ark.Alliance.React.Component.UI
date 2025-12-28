import { ChartDataPoint } from '../types';

const BASE_URL = 'https://fapi.binance.com/fapi/v1/continuousKlines';

export const apiService = {
  async fetchHistoricalData(symbol: string, interval: string, limit: number = 180): Promise<ChartDataPoint[]> {
    try {
      // Params: pair, contractType, interval, limit
      const url = new URL(BASE_URL);
      url.searchParams.append('pair', symbol.toUpperCase());
      url.searchParams.append('contractType', 'PERPETUAL');
      url.searchParams.append('interval', interval);
      url.searchParams.append('limit', limit.toString());

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const rawData = await response.json();

      // Transform array format to ChartDataPoint objects
      // Format: [Open time, Open, High, Low, Close, Volume, Close time, ...]
      return rawData.map((k: any) => ({
        time: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));

    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      return [];
    }
  }
};