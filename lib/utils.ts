import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a YYYY-MM-DD date string to a localized date string
 * without timezone conversion issues
 */
export function formatDateString(dateString: string): string {
  if (!dateString) return '';
  // If it's already in YYYY-MM-DD format, append T00:00:00 to force local timezone interpretation
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString + 'T00:00:00').toLocaleDateString();
  }
  // Otherwise, try to parse it normally
  return new Date(dateString).toLocaleDateString();
}



