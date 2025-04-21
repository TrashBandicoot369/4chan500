import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomMemeSymbol(): string {
  const symbols = ["Ꞩ", "₥", "₿", "Ƶ", "Ξ", "৳", "₲", "₡", "₭", "₮"]
  return symbols[Math.floor(Math.random() * symbols.length)]
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatLulzScore(num: number): string {
  const symbol = getRandomMemeSymbol()
  return `${symbol}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num)}`
}

// For backward compatibility
export const formatCurrency = formatLulzScore

export function formatPercentage(num: number): string {
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
}

export function formatVibeShift(num: number): string {
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function getLulzTooltip(): string {
  return "This is a social score, not a token or currency"
}

export function getMemeHeatIndex(volume: number): number {
  return parseFloat((volume / 1000000).toFixed(1))
}
