import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 가격 포맷팅 (억/만 단위)
export function formatPrice(price: number | null): string {
  if (!price) return '-'

  const billion = Math.floor(price / 100000000)
  const million = Math.floor((price % 100000000) / 10000)

  if (billion > 0 && million > 0) {
    return `${billion}억 ${million}만원`
  } else if (billion > 0) {
    return `${billion}억원`
  } else {
    return `${million.toLocaleString()}만원`
  }
}

// 월세 포맷팅 (보증금/월세)
export function formatMonthlyRent(deposit: number | null, monthly: number | null): string {
  if (!deposit && !monthly) return '-'

  const depositStr = deposit ? formatPrice(deposit).replace('원', '') : '0'
  const monthlyStr = monthly ? formatPrice(monthly).replace('원', '') : '0'

  return `${depositStr}/${monthlyStr}`
}

// 면적 포맷팅
export function formatArea(areaM2: number | null): string {
  if (!areaM2) return '-'
  const areaPy = (areaM2 / 3.3058).toFixed(1)
  return `${areaM2}m² (${areaPy}평)`
}

// 날짜 포맷팅
export function formatDate(date: string | null): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 전화번호 포맷팅
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}
