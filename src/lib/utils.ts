import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hex = (x: number, pad: number = 2) => x.toString(16).padStart(pad, '0').toUpperCase();
