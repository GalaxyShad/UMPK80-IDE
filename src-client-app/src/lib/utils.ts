import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bitsToBooleanList = (value: number, bitsCount = 8) =>
  [...Array<boolean>(bitsCount)].map((_, i) => ((value >> i) & 1) === 1).reverse()

export const boolArrayToByte = (boolArray: boolean[]): number =>
  boolArray.reduce(
    (byte: number, current: boolean, index: number) =>
      byte | (current ? 1 << (7 - index) : 0),
    0,
  )

declare global {
  interface Number {
    toHexString(byteCount?: number): string
  }
}

Number.prototype.toHexString = function(byteCount: number = 1) {
  return this.valueOf()
    .toString(16)
    .padStart(byteCount * 2, '0')
    .toUpperCase()
}


