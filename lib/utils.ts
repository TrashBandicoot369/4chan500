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

// Re-export everything from format-utils.ts
// This file is kept for backward compatibility with existing imports

export * from './format-utils'
