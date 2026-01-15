'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatPhone } from '@/lib/utils'
import { INQUIRY_STATUS } from '@/lib/constants'
import { getInquiries } from '@/lib/firebase/firestore'
import type { Inquiry } from '@/types/inquiry'

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInquiries() {
      const data = await getInquiries()
      setInquiries(data)
      setLoading(false)
    }
    fetchInquiries()
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">문의 관리</h1>
        <p className="text-gray-600">고객 문의를 확인하고 처리합니다.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">문의가 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium">{inquiry.name}</span>
                      <span className="text-gray-500 ml-2">{formatPhone(inquiry.phone)}</span>
                      {inquiry.email && (
                        <span className="text-gray-500 ml-2">{inquiry.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={'px-2 py-1 text-xs rounded-full ' + getStatusColor(inquiry.status)}>
                        {INQUIRY_STATUS[inquiry.status as keyof typeof INQUIRY_STATUS]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(inquiry.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
