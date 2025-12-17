import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPKR(amount: number) {
  try {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `Rs ${Math.round(amount)}`
  }
}

export const IMAGEKIT_BASE = 'https://ik.imagekit.io/vfhlzpxfu'

export function convertToImageKitPath(path: string) {
  const s = String(path || '')
  return s.replace(/^\s+|\s+$/g, '').replace(/^\/+/, '')
}

export function buildImageKitUrl(path: string) {
  const rel = convertToImageKitPath(path)
  return `${IMAGEKIT_BASE}/${rel}`
}

export function isImageKitUrl(src: string) {
  return /^https?:\/\/ik\.imagekit\.io\//i.test(String(src || ''))
}
