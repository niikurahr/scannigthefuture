import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This allows for conditional classes and resolves Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a string
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'ja-JP')
 * @returns A formatted date string
 */
export function formatDate(date: Date, locale: string = 'ja-JP'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Truncates a string to a specified length
 * @param str - The string to truncate
 * @param length - The maximum length of the string
 * @returns The truncated string
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) {
    return str
  }
  return str.slice(0, length) + '...'
}

/**
 * Generates a random ID
 * @returns A random string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

