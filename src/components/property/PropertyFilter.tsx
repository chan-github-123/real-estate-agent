'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PROPERTY_TYPES, TRANSACTION_TYPES, CITIES, SEOUL_DISTRICTS } from '@/lib/constants'
import type { PropertyFilters } from '@/types/property'

interface PropertyFilterProps {
  filters: PropertyFilters
  onFilterApply?: () => void
}

export function PropertyFilter({ filters, onFilterApply }: PropertyFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: keyof PropertyFilters, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // 페이지 리셋
    params.delete('page')

    router.push(`/properties?${params.toString()}`)
    onFilterApply?.()
  }

  const clearFilters = () => {
    router.push('/properties')
  }

  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="mb-2 block">검색</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="매물명, 주소 검색..."
            className="pl-10"
            defaultValue={filters.search}
            onChange={(e) => {
              const value = e.target.value
              // 디바운스를 위해 타이머 사용
              const timer = setTimeout(() => {
                updateFilter('search', value || undefined)
              }, 500)
              return () => clearTimeout(timer)
            }}
          />
        </div>
      </div>

      {/* Property Type */}
      <div>
        <Label htmlFor="property_type" className="mb-2 block">매물 유형</Label>
        <Select
          id="property_type"
          value={filters.property_type || ''}
          onChange={(e) => updateFilter('property_type', e.target.value || undefined)}
        >
          <option value="">전체</option>
          {Object.entries(PROPERTY_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      {/* Transaction Type */}
      <div>
        <Label htmlFor="transaction_type" className="mb-2 block">거래 유형</Label>
        <Select
          id="transaction_type"
          value={filters.transaction_type || ''}
          onChange={(e) => updateFilter('transaction_type', e.target.value || undefined)}
        >
          <option value="">전체</option>
          {Object.entries(TRANSACTION_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      {/* City */}
      <div>
        <Label htmlFor="city" className="mb-2 block">시/도</Label>
        <Select
          id="city"
          value={filters.city || ''}
          onChange={(e) => {
            updateFilter('city', e.target.value || undefined)
            // 시/도가 변경되면 구/군 초기화
            if (e.target.value !== '서울특별시') {
              updateFilter('district', undefined)
            }
          }}
        >
          <option value="">전체</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </Select>
      </div>

      {/* District (Seoul only) */}
      {filters.city === '서울특별시' && (
        <div>
          <Label htmlFor="district" className="mb-2 block">구/군</Label>
          <Select
            id="district"
            value={filters.district || ''}
            onChange={(e) => updateFilter('district', e.target.value || undefined)}
          >
            <option value="">전체</option>
            {SEOUL_DISTRICTS.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min_price" className="mb-2 block">최소 가격 (만원)</Label>
          <Input
            id="min_price"
            type="number"
            placeholder="0"
            defaultValue={filters.min_price ? filters.min_price / 10000 : ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) * 10000 : undefined
              updateFilter('min_price', value?.toString())
            }}
          />
        </div>
        <div>
          <Label htmlFor="max_price" className="mb-2 block">최대 가격 (만원)</Label>
          <Input
            id="max_price"
            type="number"
            placeholder="무제한"
            defaultValue={filters.max_price ? filters.max_price / 10000 : ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) * 10000 : undefined
              updateFilter('max_price', value?.toString())
            }}
          />
        </div>
      </div>

      {/* Rooms */}
      <div>
        <Label htmlFor="rooms" className="mb-2 block">방 개수</Label>
        <Select
          id="rooms"
          value={filters.rooms?.toString() || ''}
          onChange={(e) => updateFilter('rooms', e.target.value || undefined)}
        >
          <option value="">전체</option>
          <option value="1">1개</option>
          <option value="2">2개</option>
          <option value="3">3개</option>
          <option value="4">4개 이상</option>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          필터 초기화
        </Button>
      )}
    </div>
  )
}
