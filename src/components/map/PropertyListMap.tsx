'use client'

import { useEffect, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import type { PropertyWithImages } from '@/types/property'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface PropertyListMapProps {
  properties: PropertyWithImages[]
  className?: string
}

interface MarkerData {
  position: { lat: number; lng: number }
  property: PropertyWithImages
}

export function PropertyListMap({ properties, className = '' }: PropertyListMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [markers, setMarkers] = useState<MarkerData[]>([])
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithImages | null>(null)
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }) // Default: Seoul
  const [level, setLevel] = useState(8)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.kakao?.maps) {
      setIsLoading(false)
      return
    }

    const geocoder = new window.kakao.maps.services.Geocoder()
    const markerPromises: Promise<MarkerData | null>[] = []

    properties.forEach((property) => {
      // Use stored coordinates if available
      if (property.latitude && property.longitude) {
        markerPromises.push(
          Promise.resolve({
            position: { lat: property.latitude, lng: property.longitude },
            property,
          })
        )
      } else if (property.address) {
        // Otherwise, geocode the address
        const promise = new Promise<MarkerData | null>((resolve) => {
          geocoder.addressSearch(property.address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              resolve({
                position: { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) },
                property,
              })
            } else {
              resolve(null)
            }
          })
        })
        markerPromises.push(promise)
      }
    })

    Promise.all(markerPromises).then((results) => {
      const validMarkers = results.filter((m): m is MarkerData => m !== null)
      setMarkers(validMarkers)

      // Calculate center and zoom level to fit all markers
      if (validMarkers.length > 0) {
        const lats = validMarkers.map((m) => m.position.lat)
        const lngs = validMarkers.map((m) => m.position.lng)
        const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2
        const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2
        setCenter({ lat: centerLat, lng: centerLng })

        // Adjust zoom level based on marker spread
        const latDiff = Math.max(...lats) - Math.min(...lats)
        const lngDiff = Math.max(...lngs) - Math.min(...lngs)
        const maxDiff = Math.max(latDiff, lngDiff)

        if (maxDiff < 0.01) setLevel(3)
        else if (maxDiff < 0.05) setLevel(5)
        else if (maxDiff < 0.1) setLevel(6)
        else if (maxDiff < 0.5) setLevel(8)
        else setLevel(10)
      }

      setIsLoading(false)
    })
  }, [properties])

  if (!window.kakao?.maps) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">지도를 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">지도 로딩 중...</p>
      </div>
    )
  }

  if (markers.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">표시할 매물이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Map center={center} level={level} className="w-full h-full rounded-lg">
        {markers.map((marker, index) => (
          <MapMarker
            key={`${marker.property.id}-${index}`}
            position={marker.position}
            onClick={() => setSelectedProperty(marker.property)}
            title={marker.property.title}
          />
        ))}
      </Map>

      {selectedProperty && (
        <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 shadow-lg z-10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Link
                href={`/properties/${selectedProperty.id}`}
                className="font-semibold text-lg hover:text-primary transition-colors"
              >
                {selectedProperty.title}
              </Link>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{selectedProperty.address}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                {selectedProperty.property_type === 'apartment'
                  ? '아파트'
                  : selectedProperty.property_type === 'officetel'
                    ? '오피스텔'
                    : selectedProperty.property_type === 'house'
                      ? '주택'
                      : selectedProperty.property_type === 'villa'
                        ? '빌라'
                        : selectedProperty.property_type === 'commercial'
                          ? '상가'
                          : selectedProperty.property_type === 'office'
                            ? '사무실'
                            : '토지'}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                {selectedProperty.transaction_type === 'sale'
                  ? '매매'
                  : selectedProperty.transaction_type === 'jeonse'
                    ? '전세'
                    : '월세'}
              </span>
            </div>
            <p className="font-bold text-primary">
              {selectedProperty.transaction_type === 'sale'
                ? formatPrice(selectedProperty.price)
                : `${formatPrice(selectedProperty.deposit || 0)} / ${formatPrice(selectedProperty.monthly_rent || 0)}`}
            </p>
            <Link
              href={`/properties/${selectedProperty.id}`}
              className="text-sm text-primary hover:underline mt-2 inline-block"
            >
              자세히 보기 →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
