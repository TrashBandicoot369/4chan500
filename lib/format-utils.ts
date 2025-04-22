import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Re-export the cn function from existing utils
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function formatPercentage(num: number): string {
  if (typeof num !== 'number') return '0%';
  const prefix = num >= 0 ? '+' : '';
  return `${prefix}${num.toFixed(2)}%`;
}

export function formatVibeShift(num: number): string {
  if (typeof num !== 'number') return '0%';
  const prefix = num >= 0 ? '+' : '';
  return `${prefix}${num.toFixed(2)}%`;
}

export function getLulzTooltip(): string {
  return "Click score to sort, click 🔗 to view on Reddit. This value represents a social engagement score, not a currency."
}

export function getMemeHeatIndex(volume: number): number {
  if (typeof volume !== 'number') return 1.0;
  return parseFloat((volume / 1000000).toFixed(1)) || 1.0;
} 