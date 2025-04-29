import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Core utility functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomMemeSymbol(): string {
  const symbols = ["Ꞩ", "₥", "₿", "Ƶ", "Ξ", "৳", "₲", "₡", "₭", "₮"]
  return symbols[Math.floor(Math.random() * symbols.length)]
}

export function formatNumber(num: number): string {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatLulzScore(num: number): string {
  if (typeof num !== 'number') return getRandomMemeSymbol() + '0';
  const symbol = getRandomMemeSymbol()
  return `${symbol}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num)}`
}

// For backward compatibility
export const formatCurrency = formatLulzScore

// Completely new implementation with a different signature
export function formatVibeShift(input: any): string {
  // Just return a random percentage between -20% and +20%
  const randomPct = (Math.random() * 40 - 20).toFixed(2);
  const prefix = parseFloat(randomPct) > 0 ? '+' : '';
  return `${prefix}${randomPct}%`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function getLulzTooltip(): string {
  return "This is a social score, not a token or currency"
}

export function getMemeHeatIndex(volume: number): number {
  if (typeof volume !== 'number') return 1.0;
  return parseFloat((volume / 1000000).toFixed(1)) || 1.0;
}

/**
 * Fetches token data from Dexscreener API
 * @param ca Contract address of the token
 * @returns Object with marketCap and volume24h, or null if data not available
 */
export async function fetchDexData(ca: string): Promise<{ marketCap: number; volume24h: number } | null> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
    
    if (!response.ok) {
      console.error(`Dexscreener API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Check if valid data was returned
    if (!data.pairs || !data.pairs.length) {
      console.error('No pairs found for this token');
      return null;
    }
    
    // Use the first pair's data (usually the most liquid)
    const pair = data.pairs[0];
    
    return {
      marketCap: parseFloat(pair.fdv) || 0,
      volume24h: parseFloat(pair.volume.h24) || 0
    };
  } catch (error) {
    console.error('Error fetching Dexscreener data:', error);
    return null;
  }
}

// Format market cap to be displayed
export function formatMarketCap(marketCap: number): string {
  if (!marketCap) return 'N/A';
  
  if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  } else {
    return `$${marketCap.toFixed(2)}`;
  }
}

// Re-export everything from format-utils.ts
// This file is kept for backward compatibility with existing imports

export * from './format-utils'
