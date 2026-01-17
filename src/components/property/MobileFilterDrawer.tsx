'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyFilter } from './PropertyFilter'
import type { PropertyFilters } from '@/types/property'

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: PropertyFilters
}

export function MobileFilterDrawer({ open, onClose, filters }: MobileFilterDrawerProps) {
  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-xl animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">필터</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
          <PropertyFilter filters={filters} onFilterApply={onClose} />
        </div>
      </div>
    </>
  )
}
