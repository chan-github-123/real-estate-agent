export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'admin' | 'agent'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          role?: 'admin' | 'agent'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          role?: 'admin' | 'agent'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string | null
          title: string
          property_type: 'apartment' | 'villa' | 'officetel' | 'house' | 'commercial' | 'office' | 'land'
          transaction_type: 'sale' | 'jeonse' | 'monthly'
          status: 'available' | 'reserved' | 'completed'
          price: number | null
          deposit: number | null
          monthly_rent: number | null
          maintenance_fee: number | null
          area_m2: number | null
          area_py: number | null
          rooms: number | null
          bathrooms: number | null
          floor: number | null
          total_floors: number | null
          address: string
          city: string
          district: string
          dong: string | null
          latitude: number | null
          longitude: number | null
          description: string | null
          features: string[] | null
          move_in_date: string | null
          built_year: number | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          property_type: 'apartment' | 'villa' | 'officetel' | 'house' | 'commercial' | 'office' | 'land'
          transaction_type: 'sale' | 'jeonse' | 'monthly'
          status?: 'available' | 'reserved' | 'completed'
          price?: number | null
          deposit?: number | null
          monthly_rent?: number | null
          maintenance_fee?: number | null
          area_m2?: number | null
          area_py?: number | null
          rooms?: number | null
          bathrooms?: number | null
          floor?: number | null
          total_floors?: number | null
          address: string
          city: string
          district: string
          dong?: string | null
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          features?: string[] | null
          move_in_date?: string | null
          built_year?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          property_type?: 'apartment' | 'villa' | 'officetel' | 'house' | 'commercial' | 'office' | 'land'
          transaction_type?: 'sale' | 'jeonse' | 'monthly'
          status?: 'available' | 'reserved' | 'completed'
          price?: number | null
          deposit?: number | null
          monthly_rent?: number | null
          maintenance_fee?: number | null
          area_m2?: number | null
          area_py?: number | null
          rooms?: number | null
          bathrooms?: number | null
          floor?: number | null
          total_floors?: number | null
          address?: string
          city?: string
          district?: string
          dong?: string | null
          latitude?: number | null
          longitude?: number | null
          description?: string | null
          features?: string[] | null
          move_in_date?: string | null
          built_year?: number | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          storage_path: string
          order_index: number
          is_primary: boolean
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          storage_path: string
          order_index?: number
          is_primary?: boolean
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          storage_path?: string
          order_index?: number
          is_primary?: boolean
          alt_text?: string | null
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string | null
          name: string
          phone: string
          email: string | null
          message: string
          inquiry_type: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          admin_notes: string | null
          handled_by: string | null
          handled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          name: string
          phone: string
          email?: string | null
          message: string
          inquiry_type?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          admin_notes?: string | null
          handled_by?: string | null
          handled_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          name?: string
          phone?: string
          email?: string | null
          message?: string
          inquiry_type?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          admin_notes?: string | null
          handled_by?: string | null
          handled_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          preferred_date: string
          preferred_time: string
          consultation_type: string | null
          message: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          admin_notes: string | null
          handled_by: string | null
          confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          preferred_date: string
          preferred_time: string
          consultation_type?: string | null
          message?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          admin_notes?: string | null
          handled_by?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          preferred_date?: string
          preferred_time?: string
          consultation_type?: string | null
          message?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          admin_notes?: string | null
          handled_by?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'agent'
      property_type: 'apartment' | 'villa' | 'officetel' | 'house' | 'commercial' | 'office' | 'land'
      transaction_type: 'sale' | 'jeonse' | 'monthly'
      property_status: 'available' | 'reserved' | 'completed'
      inquiry_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    }
  }
}
