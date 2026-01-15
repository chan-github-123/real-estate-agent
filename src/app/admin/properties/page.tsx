'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, formatArea, formatDate } from '@/lib/utils'
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS } from '@/lib/constants'
import { getProperties } from '@/lib/firebase/firestore'
import type { PropertyWithImages } from '@/types/property'

function getStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800'
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      const data = await getProperties()
      setProperties(data)
      setLoading(false)
    }
    fetchProperties()
  }, [])

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
          <p className="text-gray-600">등록된 매물을 관리합니다.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 매물 등록
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">등록된 매물이 없습니다.</p>
              <Link href="/admin/properties/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  첫 매물 등록하기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">매물명</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">유형</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">거래</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">가격</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">면적</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">등록일</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.city} {property.district}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES]}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {TRANSACTION_TYPES[property.transaction_type as keyof typeof TRANSACTION_TYPES]}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {property.transaction_type === 'monthly'
                          ? (property.deposit ? formatPrice(property.deposit) : '-') + '/' + (property.monthly_rent ? formatPrice(property.monthly_rent) : '-')
                          : formatPrice(property.price)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatArea(property.area_m2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={'px-2 py-1 text-xs rounded-full ' + getStatusColor(property.status)}>
                          {PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(property.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={'/properties/' + property.id} target="_blank">
                            <Button variant="ghost" size="icon" title="보기">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={'/admin/properties/' + property.id + '/edit'}>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
