'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, Calendar, Clock, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createConsultation } from '@/lib/firebase/firestore'
import { CONSULTATION_TYPES } from '@/lib/constants'

const consultationSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().min(10, '연락처를 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요').optional().or(z.literal('')),
  preferred_date: z.string().min(1, '희망 날짜를 선택해주세요'),
  preferred_time: z.string().min(1, '희망 시간을 선택해주세요'),
  consultation_type: z.string().min(1, '상담 유형을 선택해주세요'),
  message: z.string().optional(),
})

type ConsultationFormData = z.infer<typeof consultationSchema>

const timeSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
]

export default function ConsultationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  })

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await createConsultation({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        consultation_type: data.consultation_type,
        message: data.message || null,
      })

      setIsSuccess(true)
      reset()
    } catch (err) {
      console.error('Error submitting consultation:', err)
      setError('예약 접수 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get min date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">예약이 접수되었습니다</h2>
            <p className="text-gray-600 mb-6">
              확인 후 연락드리겠습니다. 감사합니다.
            </p>
            <Button onClick={() => setIsSuccess(false)}>
              추가 예약하기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">상담 예약</h1>
          <p className="text-gray-600">
            원하시는 날짜와 시간에 전문 상담을 받아보세요.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    {...register('name')}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    {...register('phone')}
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register('email')}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred_date">희망 날짜 *</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    min={minDate}
                    {...register('preferred_date')}
                    className="mt-1"
                  />
                  {errors.preferred_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.preferred_date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="preferred_time">희망 시간 *</Label>
                  <select
                    id="preferred_time"
                    {...register('preferred_time')}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">선택</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.preferred_time && (
                    <p className="text-sm text-red-500 mt-1">{errors.preferred_time.message}</p>
                  )}
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <Label htmlFor="consultation_type">상담 유형 *</Label>
                <select
                  id="consultation_type"
                  {...register('consultation_type')}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">선택</option>
                  {Object.entries(CONSULTATION_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.consultation_type && (
                  <p className="text-sm text-red-500 mt-1">{errors.consultation_type.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">추가 메시지</Label>
                <Textarea
                  id="message"
                  placeholder="상담 시 참고할 내용을 적어주세요"
                  rows={4}
                  {...register('message')}
                  className="mt-1"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    예약 접수 중...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    상담 예약하기
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">상담 가능 시간</h3>
              <p className="text-sm text-gray-600">
                평일 09:00 - 18:00<br />
                토요일 10:00 - 14:00
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">전화 상담</h3>
              <p className="text-sm text-gray-600">
                급하신 경우 전화로 문의해 주세요.<br />
                02-1234-5678
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
