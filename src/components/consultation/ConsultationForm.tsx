'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, Calendar } from 'lucide-react'
import { format, addDays, isSunday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { createConsultation } from '@/lib/firebase/firestore'
import { CONSULTATION_TYPES } from '@/lib/constants'

const consultationSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().min(10, '연락처를 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요').optional().or(z.literal('')),
  preferred_date: z.string().min(1, '상담 날짜를 선택해주세요'),
  preferred_time: z.string().min(1, '상담 시간을 선택해주세요'),
  consultation_type: z.string().min(1, '상담 방법을 선택해주세요'),
  message: z.string().optional(),
})

type ConsultationFormData = z.infer<typeof consultationSchema>

// 예약 가능한 날짜 생성 (7일 후부터 30일간, 일요일 제외)
function getAvailableDates() {
  const dates: Date[] = []
  let date = addDays(new Date(), 1)

  while (dates.length < 20) {
    if (!isSunday(date)) {
      dates.push(date)
    }
    date = addDays(date, 1)
  }

  return dates
}

// 상담 가능 시간대
const timeSlots = [
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

export function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableDates = getAvailableDates()

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
      setError('상담 예약 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">상담 예약이 완료되었습니다</h3>
        <p className="text-gray-600 mb-4">
          예약 확정 후 연락드리겠습니다.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          추가 예약하기
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferred_date">희망 날짜 *</Label>
          <Select
            id="preferred_date"
            {...register('preferred_date')}
            className="mt-1"
          >
            <option value="">날짜 선택</option>
            {availableDates.map((date) => (
              <option key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                {format(date, 'M월 d일 (EEE)', { locale: ko })}
              </option>
            ))}
          </Select>
          {errors.preferred_date && (
            <p className="text-sm text-red-500 mt-1">{errors.preferred_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="preferred_time">희망 시간 *</Label>
          <Select
            id="preferred_time"
            {...register('preferred_time')}
            className="mt-1"
          >
            <option value="">시간 선택</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </Select>
          {errors.preferred_time && (
            <p className="text-sm text-red-500 mt-1">{errors.preferred_time.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="consultation_type">상담 방법 *</Label>
        <Select
          id="consultation_type"
          {...register('consultation_type')}
          className="mt-1"
        >
          <option value="">선택해주세요</option>
          {Object.entries(CONSULTATION_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        {errors.consultation_type && (
          <p className="text-sm text-red-500 mt-1">{errors.consultation_type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">추가 메시지</Label>
        <Textarea
          id="message"
          placeholder="상담 시 필요한 내용을 입력해주세요"
          rows={3}
          {...register('message')}
          className="mt-1"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            예약 중...
          </>
        ) : (
          <>
            <Calendar className="mr-2 h-4 w-4" />
            상담 예약하기
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        예약 확정 후 알림을 보내드립니다.
      </p>
    </form>
  )
}
