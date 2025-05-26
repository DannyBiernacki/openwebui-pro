import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Łączy klasy CSS z obsługą Tailwind
 * @param inputs - Klasy CSS do połączenia
 * @returns Połączone klasy CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 