import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bitsToBooleanList = (value: number, bitsCount = 8) =>
  [...Array(bitsCount)].map((_, i) => (value >> i) & 1).reverse()

declare global {
  interface Number {
    toHexString(): string
  }
}

Number.prototype.toHexString = function () {
  return this.valueOf()
    .toString(16)
    .padStart(this.valueOf() > 0xff ? 4 : 2, '0')
    .toUpperCase()
}
