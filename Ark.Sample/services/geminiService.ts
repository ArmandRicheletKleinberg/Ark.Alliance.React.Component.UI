import { GoogleGenAI } from "@google/genai";
import { CryptoSymbol } from "../types";

// Helper to simulate analysis if no key is present, or use real API if available
export const analyzeMarketTrends = async (symbols: CryptoSymbol[]): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // Fallback simulation for demo purposes if no key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Simulation: Bullish divergence detected on BTC/ETH pairs. AI recommends accumulation in dip zones. Volatility index suggests caution for leverage > 10x.");
      }, 2000);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const symbolText = symbols.map(s => `${s.symbol}: $${s.price} (${s.change}%)`).join(', ');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these crypto market snippets concisely (max 30 words) for a dashboard: ${symbolText}. Focus on trend direction.`,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Analysis failed. Please check connection.";
  }
};