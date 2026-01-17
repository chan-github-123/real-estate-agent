'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, SlidersHorizontal } from 'lucide-react'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyFilter } from '@/components/property/PropertyFilter'
import { MobileFilterDrawer } from '@/components/property/MobileFilterDrawer'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getProperties } from '@/lib/firebase/firestore'
import type { PropertyFilters, PropertyWithImages } from '@/types/property'

const SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'area_desc', label: '면적 넓은순' },
]

function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <Skeleton className="h-96 rounded-lg" />
        </aside>
        <main className="flex-1">
          <PropertyListSkeleton />
        </main>
      </div>
    </div>
  )
}

function PropertiesPageContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const filters: PropertyFilters = {
    property_type: searchParams.get('property_type') as PropertyFilters['property_type'] || undefined,
    transaction_type: searchParams.get('transaction_type') as PropertyFilters['transaction_type'] || undefined,
    city: searchParams.get('city') || undefined,
    district: searchParams.get('district') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    rooms: searchParams.get('rooms') ? Number(searchParams.get('rooms')) : undefined,
    search: searchParams.get('search') || undefined,
  }

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      const data = await getProperties({ ...filters, status: 'available' })
      setProperties(data)
      setLoading(false)
    }
    fetchProperties()
  }, [searchParams])

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return (a.price || 0) - (b.price || 0)
      case 'price_desc':
        return (b.price || 0) - (a.price || 0)
      case 'area_desc':
        return (b.area_m2 || 0) - (a.area_m2 || 0)
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    }
  })

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">매물 검색</h1>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setMobileFilterOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          필터
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <PropertyFilter filters={filters} />
          </div>
        </aside>

        {/* Property Grid */}
        <main className="flex-1">
          {/* Search Results Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <p className="text-sm text-muted-foreground">
              {loading ? '검색 중...' : `총 ${properties.length}개의 매물`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <PropertyListSkeleton />
          ) : sortedProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">검색 결과가 없습니다.</p>
              <p className="text-sm text-gray-400">
                다른 조건으로 검색해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
      />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PropertiesPageContent />
    </Suspense>
  )
}
