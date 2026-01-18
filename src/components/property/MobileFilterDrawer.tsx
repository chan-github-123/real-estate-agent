'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyFilter } from './PropertyFilter'
import { cn } from '@/lib/utils'
import type { PropertyFilters } from '@/types/property'

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: PropertyFilters
}

export function MobileFilterDrawer({ open, onClose, filters }: MobileFilterDrawerProps) {
  // 드로어가 열렸을 때 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 lg:hidden shadow-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">필터</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="min-touch-target touch-manipulation"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">닫기</span>
          </Button>
        </div>
        <div className="p-4 overflow-y-auto overscroll-bounce h-[calc(100vh-65px)] pb-safe">
          <PropertyFilter filters={filters} onFilterApply={onClose} />
        </div>
      </div>
    </>
  )
}
