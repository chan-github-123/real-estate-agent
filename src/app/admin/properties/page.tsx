'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Eye, Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatArea, formatDate } from '@/lib/utils'
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS } from '@/lib/constants'
import { getProperties, updatePropertyStatus } from '@/lib/firebase/firestore'
import type { PropertyWithImages, PropertyStatus } from '@/types/property'

const ITEMS_PER_PAGE = 10

const statusVariants: Record<string, 'success' | 'warning' | 'muted'> = {
  available: 'success',
  reserved: 'warning',
  completed: 'muted',
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    async function fetchProperties() {
      const data = await getProperties()
      setProperties(data)
      setFilteredProperties(data)
      setLoading(false)
    }
    fetchProperties()
  }, [])

  useEffect(() => {
    let result = [...properties]

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
          p.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter)
    }

    if (typeFilter) {
      result = result.filter((p) => p.property_type === typeFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.price || 0) - (b.price || 0)
        case 'price_desc':
          return (b.price || 0) - (a.price || 0)
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      }
    })

    setFilteredProperties(result)
    setCurrentPage(1)
  }, [properties, searchTerm, statusFilter, typeFilter, sortBy])

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleStatusChange = async (propertyId: string, newStatus: PropertyStatus) => {
    await updatePropertyStatus(propertyId, newStatus)
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
    )
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">매물 관리</h1>
          <p className="text-gray-600">총 {properties.length}개의 매물이 등록되어 있습니다.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 매물 등록
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="매물명, 주소 검색..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">전체 상태</option>
              {Object.entries(PROPERTY_STATUS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="">전체 유형</option>
              {Object.entries(PROPERTY_TYPES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="newest">최신순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {paginatedProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter || typeFilter
                  ? '검색 결과가 없습니다.'
                  : '등록된 매물이 없습니다.'}
              </p>
              {!searchTerm && !statusFilter && !typeFilter && (
                <Link href="/admin/properties/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    첫 매물 등록하기
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        매물명
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">유형</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">가격</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        등록일
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paginatedProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium line-clamp-1">{property.title}</p>
                            <p className="text-sm text-gray-500">
                              {property.city} {property.district}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES]}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {property.transaction_type === 'monthly'
                            ? `${formatPrice(property.deposit)}/${formatPrice(property.monthly_rent)}`
                            : formatPrice(property.price)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={property.status}
                            onChange={(e) =>
                              handleStatusChange(property.id, e.target.value as PropertyStatus)
                            }
                            className="text-xs border rounded px-2 py-1 bg-white"
                          >
                            {Object.entries(PROPERTY_STATUS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(property.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/properties/${property.id}`} target="_blank">
                              <Button variant="ghost" size="icon" title="보기">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/properties/${property.id}/edit`}>
                              <Button variant="ghost" size="icon" title="수정">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y">
                {paginatedProperties.map((property) => (
                  <div key={property.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{property.title}</p>
                        <p className="text-sm text-gray-500">
                          {property.city} {property.district}
                        </p>
                      </div>
                      <Badge variant={statusVariants[property.status]}>
                        {PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-semibold text-primary">
                        {property.transaction_type === 'monthly'
                          ? `${formatPrice(property.deposit)}/${formatPrice(property.monthly_rent)}`
                          : formatPrice(property.price)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link href={`/properties/${property.id}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            보기
                          </Button>
                        </Link>
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Button variant="outline" size="sm">
                            수정
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-gray-500">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} / 총{' '}
                    {filteredProperties.length}개
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
