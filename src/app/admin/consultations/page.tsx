'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatPhone } from '@/lib/utils'
import { INQUIRY_STATUS, CONSULTATION_TYPES } from '@/lib/constants'
import { getConsultations } from '@/lib/firebase/firestore'

interface Consultation {
  id: string
  name: string
  phone: string
  email: string | null
  preferredDate: string
  preferredTime: string
  consultationType: string | null
  message: string | null
  status: string
  createdAt: string
}

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

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConsultations() {
      const data = await getConsultations()
      setConsultations(data as Consultation[])
      setLoading(false)
    }
    fetchConsultations()
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
        <h1 className="text-2xl font-bold">상담 관리</h1>
        <p className="text-gray-600">상담 예약을 확인하고 관리합니다.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {consultations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">예약된 상담이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">예약자</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">연락처</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">희망일시</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상담유형</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">메모</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{consultation.name}</p>
                          {consultation.email && (
                            <p className="text-sm text-gray-500">{consultation.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatPhone(consultation.phone)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p>{formatDate(consultation.preferredDate)}</p>
                        <p className="text-gray-500">{consultation.preferredTime}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {consultation.consultationType
                          ? CONSULTATION_TYPES[consultation.consultationType as keyof typeof CONSULTATION_TYPES]
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={'px-2 py-1 text-xs rounded-full ' + getStatusColor(consultation.status)}>
                          {INQUIRY_STATUS[consultation.status as keyof typeof INQUIRY_STATUS]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {consultation.message || '-'}
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
