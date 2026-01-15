'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Maximize, BedDouble, Bath } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatMonthlyRent, formatArea } from '@/lib/utils'
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS } from '@/lib/constants'
import type { PropertyWithImages } from '@/types/property'

interface PropertyCardProps {
  property: PropertyWithImages
  showStatus?: boolean
}

export function PropertyCard({ property, showStatus = false }: PropertyCardProps) {
  const primaryImage = property.property_images?.find((img) => img.is_primary)
  const imageUrl = primaryImage?.url || '/images/placeholder-property.jpg'

  const getPriceDisplay = () => {
    if (property.transaction_type === 'monthly') {
      return formatMonthlyRent(property.deposit, property.monthly_rent)
    }
    return formatPrice(property.price)
  }

  const getStatusColor = () => {
    switch (property.status) {
      case 'available':
        return 'bg-green-500'
      case 'reserved':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Transaction Type Badge */}
          <Badge className="absolute top-3 left-3 bg-primary">
            {TRANSACTION_TYPES[property.transaction_type]}
          </Badge>
          {/* Status Badge */}
          {showStatus && (
            <Badge className={`absolute top-3 right-3 ${getStatusColor()}`}>
              {PROPERTY_STATUS[property.status]}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Property Type */}
          <p className="text-xs text-muted-foreground mb-1">
            {PROPERTY_TYPES[property.property_type]}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Price */}
          <p className="text-xl font-bold text-primary mb-3">
            {getPriceDisplay()}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.city} {property.district}
            </span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{formatArea(property.area_m2)}</span>
            </div>
            {property.rooms && (
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span>방 {property.rooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>욕실 {property.bathrooms}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
