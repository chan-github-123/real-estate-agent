import type { Database } from './database'

export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type PropertyImage = Database['public']['Tables']['property_images']['Row']
export type PropertyImageInsert = Database['public']['Tables']['property_images']['Insert']

export type PropertyType = Database['public']['Enums']['property_type']
export type TransactionType = Database['public']['Enums']['transaction_type']
export type PropertyStatus = Database['public']['Enums']['property_status']

export interface PropertyWithImages extends Property {
  property_images: PropertyImage[]
}

export interface PropertyFilters {
  city?: string
  district?: string
  property_type?: PropertyType
  transaction_type?: TransactionType
  status?: PropertyStatus
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
  rooms?: number
  search?: string
}

export interface PropertyFormData {
  title: string
  property_type: PropertyType
  transaction_type: TransactionType
  status: PropertyStatus
  price: number | null
  deposit: number | null
  monthly_rent: number | null
  maintenance_fee: number | null
  area_m2: number | null
  rooms: number | null
  bathrooms: number | null
  floor: number | null
  total_floors: number | null
  address: string
  city: string
  district: string
  dong: string | null
  description: string | null
  features: string[]
  move_in_date: string | null
  built_year: number | null
  images: File[]
}
