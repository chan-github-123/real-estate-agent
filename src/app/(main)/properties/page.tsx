'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyFilter } from '@/components/property/PropertyFilter'
import { Skeleton } from '@/components/ui/skeleton'
import { getProperties } from '@/lib/firebase/firestore'
import type { PropertyFilters, PropertyWithImages } from '@/types/property'

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

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <PropertyListSkeleton />
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">검색 결과가 없습니다.</p>
        <p className="text-sm text-gray-400">
          다른 조건으로 검색해보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

export default function PropertiesPage() {
  const searchParams = useSearchParams()

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">매물 검색</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <PropertyFilter filters={filters} />
          </div>
        </aside>

        {/* Property Grid */}
        <main className="flex-1">
          <Suspense fallback={<PropertyListSkeleton />}>
            <PropertiesContent />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
