import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Re-export the cn function from existing utils
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomMemeSymbol(): string {
  const symbols = ["Ꞩ", "₥", "₿", "Ƶ", "Ξ", "৳", "₲", "₡", "₭", "₮"]
  return symbols[Math.floor(Math.random() * symbols.length)]
}

// Define a consistent lulz symbol - using 'Ł' (Polish złoty symbol)
export const LULZ_SYMBOL = "Ł";

export function formatNumber(num: number): string {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatLulzScore(num: number): string {
  if (typeof num !== 'number') return LULZ_SYMBOL + '0';
  return `${LULZ_SYMBOL}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num)}`
}

// For backward compatibility
export const formatCurrency = formatLulzScore

// Replacement functions that just return random values
export function formatPercentage(input: any): string {
  // Just return a random percentage between -10% and +10%
  const randomPct = (Math.random() * 20 - 10).toFixed(2);
  const prefix = parseFloat(randomPct) > 0 ? '+' : '';
  return `${prefix}${randomPct}%`;
}

export function formatVibeShift(input: any): string {
  // Just return a random percentage between -20% and +20%
  const randomPct = (Math.random() * 40 - 20).toFixed(2);
  const prefix = parseFloat(randomPct) > 0 ? '+' : '';
  return `${prefix}${randomPct}%`;
}

export function getLulzTooltip(): string {
  return "Click to view on Reddit. This value represents a social engagement score, not a currency."
}

export function getMemeHeatIndex(volume: number): number {
  if (typeof volume !== 'number') return 1.0;
  return parseFloat((volume / 1000000).toFixed(1)) || 1.0;
} 