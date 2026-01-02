import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a YYYY-MM-DD date string to dd/mm/yyyy format
 * without timezone conversion issues
 */
export function formatDateString(dateString: string): string {
  if (!dateString) return '';
  
  let date: Date;
  
  // If it's already in YYYY-MM-DD format, append T00:00:00 to force local timezone interpretation
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateString);
  }
  
  // Format as dd/mm/yyyy
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Formats a datetime string to dd/mm/yyyy HH:mm format
 */
export function formatDateTimeString(dateTimeString: string): string {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  
  // Format as dd/mm/yyyy HH:mm
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}



