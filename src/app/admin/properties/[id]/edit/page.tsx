'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { PropertyForm } from '@/components/property/PropertyForm'
import { getProperty } from '@/lib/firebase/firestore'
import { Button } from '@/components/ui/button'
import type { Property, PropertyImage } from '@/types/property'

export default function EditPropertyPage() {
  const params = useParams()
  const id = params.id as string
  const [property, setProperty] = useState<(Property & { property_images: PropertyImage[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return
      const data = await getProperty(id)
      if (!data) {
        setNotFound(true)
      } else {
        setProperty(data as Property & { property_images: PropertyImage[] })
      }
      setLoading(false)
    }
    fetchProperty()
  }, [id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !property) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">매물을 찾을 수 없습니다</h1>
        <Link href="/admin/properties">
          <Button>매물 목록으로</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Link
        href="/admin/properties"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        매물 목록으로
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">매물 수정</h1>
        <p className="text-gray-600">매물 정보를 수정합니다.</p>
      </div>

      <PropertyForm mode="edit" initialData={property} />
    </div>
  )
}
