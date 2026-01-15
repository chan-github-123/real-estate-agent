export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PropertyForm } from '@/components/property/PropertyForm'

export default function NewPropertyPage() {
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
        <h1 className="text-2xl font-bold">새 매물 등록</h1>
        <p className="text-gray-600">새로운 매물 정보를 입력하세요.</p>
      </div>

      <PropertyForm mode="create" />
    </div>
  )
}
