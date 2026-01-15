'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createInquiry } from '@/lib/firebase/firestore'

const inquirySchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().min(10, '연락처를 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요').optional().or(z.literal('')),
  message: z.string().min(10, '문의 내용을 10자 이상 입력해주세요'),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface InquiryFormProps {
  propertyId?: string
  propertyTitle?: string
}

export function InquiryForm({ propertyId, propertyTitle }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      message: propertyTitle ? `[${propertyTitle}] 매물에 대해 문의드립니다.\n\n` : '',
    },
  })

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      await createInquiry({
        property_id: propertyId || null,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message,
        inquiry_type: propertyId ? 'property' : 'general',
      })

      setIsSuccess(true)
      reset()
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      setError('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">문의가 접수되었습니다</h3>
        <p className="text-gray-600 mb-4">
          빠른 시일 내에 연락드리겠습니다.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          추가 문의하기
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div>
        <Label htmlFor="message">문의 내용 *</Label>
        <Textarea
          id="message"
          placeholder="문의하실 내용을 입력해주세요"
          rows={5}
          {...register('message')}
          className="mt-1"
        />
        {errors.message && (
          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            접수 중...
          </>
        ) : (
          '문의하기'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        개인정보는 문의 답변 목적으로만 사용됩니다.
      </p>
    </form>
  )
}
