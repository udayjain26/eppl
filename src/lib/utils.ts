import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export function numberToString(num: number) {
//   return num.toString()
// }

//Inches to mm converter
export function inchesToMm(inches: number) {
  return inches * 25.4
}
