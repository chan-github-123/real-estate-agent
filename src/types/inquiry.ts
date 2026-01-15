import type { Database } from './database'
import type { Property } from './property'

export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
export type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']

export type Consultation = Database['public']['Tables']['consultations']['Row']
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert']
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update']

export type InquiryStatus = Database['public']['Enums']['inquiry_status']

export interface InquiryWithProperty extends Inquiry {
  property?: Property | null
}

export interface InquiryFormData {
  name: string
  phone: string
  email?: string
  message: string
  property_id?: string
}

export interface ConsultationFormData {
  name: string
  phone: string
  email?: string
  preferred_date: string
  preferred_time: string
  consultation_type: string
  message?: string
}
