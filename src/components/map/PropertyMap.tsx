'use client'

import { useEffect, useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { Loader2 } from 'lucide-react'

interface PropertyMapProps {
  address: string
  title?: string
  latitude?: number
  longitude?: number
  className?: string
}

export function PropertyMap({
  address,
  title,
  latitude,
  longitude,
  className = 'w-full h-[400px]'
}: PropertyMapProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If coordinates are provided, use them
    if (latitude && longitude) {
      setCoords({ lat: latitude, lng: longitude })
      setLoading(false)
      return
    }

    // Otherwise, geocode the address
    if (!window.kakao || !window.kakao.maps) {
      setError('Kakao Maps not loaded')
      setLoading(false)
      return
    }

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setCoords({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
        })
        setLoading(false)
      } else {
        setError('주소를 찾을 수 없습니다')
        setLoading(false)
      }
    })
  }, [address, latitude, longitude])

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !coords) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-500 text-sm">{error || '지도를 표시할 수 없습니다'}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <Map
        center={coords}
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        level={3}
      >
        <MapMarker
          position={coords}
          title={title || address}
        />
      </Map>
    </div>
  )
}
