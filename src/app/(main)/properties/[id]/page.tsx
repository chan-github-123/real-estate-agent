'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Maximize, BedDouble, Bath, Calendar, Building, Layers, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PropertyStatusBadge } from '@/components/property/PropertyStatusBadge'
import { InquiryForm } from '@/components/inquiry/InquiryForm'
import { getProperty } from '@/lib/firebase/firestore'
import { formatPrice, formatMonthlyRent, formatArea, formatDate } from '@/lib/utils'
import { PROPERTY_TYPES, TRANSACTION_TYPES } from '@/lib/constants'
import type { PropertyWithImages } from '@/types/property'

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [property, setProperty] = useState<PropertyWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return
      const data = await getProperty(id)
      if (!data) {
        setNotFoundState(true)
      } else {
        setProperty(data)
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFoundState || !property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">매물을 찾을 수 없습니다</h1>
        <Link href="/properties">
          <Button>매물 목록으로</Button>
        </Link>
      </div>
    )
  }

  const images = property.property_images || []
  const primaryImage = images.find(img => img.is_primary) || images[0]

  const getPriceDisplay = () => {
    if (property.transaction_type === 'sale') {
      return { label: '매매가', value: formatPrice(property.price) }
    }
    if (property.transaction_type === 'jeonse') {
      return { label: '전세금', value: formatPrice(property.price) }
    }
    return {
      label: '월세',
      value: formatMonthlyRent(property.deposit, property.monthly_rent),
    }
  }

  const priceInfo = getPriceDisplay()

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 md:mb-6 py-2 touch-manipulation min-h-[44px]"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="text-sm md:text-base">목록으로</span>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Image Gallery */}
          <div className="relative aspect-[4/3] md:aspect-video rounded-lg overflow-hidden bg-gray-100 -mx-4 md:mx-0 md:rounded-lg">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div key={image.id} className="relative aspect-square rounded-md md:rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.url}
                    alt={`${property.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm md:text-base font-medium">
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Property Info */}
          <div>
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 flex-wrap">
              <Badge className="text-xs md:text-sm">{TRANSACTION_TYPES[property.transaction_type]}</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">{PROPERTY_TYPES[property.property_type]}</Badge>
              <PropertyStatusBadge status={property.status} />
            </div>

            <h1 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">{property.title}</h1>

            <div className="flex items-start text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 flex-shrink-0 mt-0.5" />
              <span>{property.address}</span>
            </div>

            <p className="text-2xl md:text-3xl font-bold text-primary">
              {priceInfo.value}
            </p>
            {property.maintenance_fee && (
              <p className="text-sm md:text-base text-gray-500 mt-1">
                관리비 월 {property.maintenance_fee.toLocaleString()}원
              </p>
            )}
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>상세 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Maximize className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">면적</p>
                    <p className="font-medium">{formatArea(property.area_m2)}</p>
                  </div>
                </div>

                {property.rooms && (
                  <div className="flex items-center gap-3">
                    <BedDouble className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">방</p>
                      <p className="font-medium">{property.rooms}개</p>
                    </div>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="flex items-center gap-3">
                    <Bath className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">욕실</p>
                      <p className="font-medium">{property.bathrooms}개</p>
                    </div>
                  </div>
                )}

                {property.floor && (
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">층수</p>
                      <p className="font-medium">
                        {property.floor}층 / {property.total_floors}층
                      </p>
                    </div>
                  </div>
                )}

                {property.built_year && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">준공년도</p>
                      <p className="font-medium">{property.built_year}년</p>
                    </div>
                  </div>
                )}

                {property.move_in_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">입주가능일</p>
                      <p className="font-medium">{formatDate(property.move_in_date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>특징</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {property.description && (
            <Card>
              <CardHeader>
                <CardTitle>상세 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Inquiry Form */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-lg md:text-xl">이 매물 문의하기</CardTitle>
              </CardHeader>
              <CardContent>
                <InquiryForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
