'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, X, ImageIcon, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createProperty, updateProperty, addPropertyImage } from '@/lib/firebase/firestore'
import { uploadImage, generateImagePath } from '@/lib/firebase/storage'
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS, CITIES, PROPERTY_FEATURES, DAEGU_DISTRICTS, DAEGU_DONGS } from '@/lib/constants'
import type { Property, PropertyImage } from '@/types/property'

const propertySchema = z.object({
  title: z.string().min(2, '제목을 입력해주세요'),
  property_type: z.string().min(1, '매물 유형을 선택해주세요'),
  transaction_type: z.string().min(1, '거래 유형을 선택해주세요'),
  status: z.string().min(1, '상태를 선택해주세요'),
  price: z.string().optional(),
  deposit: z.string().optional(),
  monthly_rent: z.string().optional(),
  maintenance_fee: z.string().optional(),
  area_m2: z.string().min(1, '면적을 입력해주세요'),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  floor: z.string().optional(),
  total_floors: z.string().optional(),
  address: z.string().min(2, '주소를 입력해주세요'),
  city: z.string().min(1, '시/도를 선택해주세요'),
  district: z.string().min(1, '구/군을 입력해주세요'),
  dong: z.string().optional(),
  description: z.string().optional(),
  built_year: z.string().optional(),
  move_in_date: z.string().optional(),
  owner_phone: z.string().optional(),
  door_password: z.string().optional(),
  owner_desired_price: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  initialData?: Property & { property_images?: PropertyImage[] }
  mode: 'create' | 'edit'
}

export function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialData?.features || []
  )
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<PropertyImage[]>(
    initialData?.property_images || []
  )
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      property_type: initialData?.property_type || '',
      transaction_type: initialData?.transaction_type || '',
      status: initialData?.status || 'available',
      price: initialData?.price ? Math.round(initialData.price / 10000).toString() : '',
      deposit: initialData?.deposit ? Math.round(initialData.deposit / 10000).toString() : '',
      monthly_rent: initialData?.monthly_rent ? Math.round(initialData.monthly_rent / 10000).toString() : '',
      maintenance_fee: initialData?.maintenance_fee ? Math.round(initialData.maintenance_fee / 10000).toString() : '',
      area_m2: initialData?.area_m2?.toString() || '',
      rooms: initialData?.rooms?.toString() || '',
      bathrooms: initialData?.bathrooms?.toString() || '',
      floor: initialData?.floor?.toString() || '',
      total_floors: initialData?.total_floors?.toString() || '',
      address: initialData?.address || '',
      city: initialData?.city || '대구광역시',
      district: initialData?.district || '',
      dong: initialData?.dong || '',
      description: initialData?.description || '',
      built_year: initialData?.built_year?.toString() || '',
      move_in_date: initialData?.move_in_date || '',
      owner_phone: initialData?.owner_phone || '',
      door_password: initialData?.door_password || '',
      owner_desired_price: initialData?.owner_desired_price ? Math.round(initialData.owner_desired_price / 10000).toString() : '',
    },
  })

  const transactionType = watch('transaction_type')
  const selectedCity = watch('city')
  const selectedDistrict = watch('district')
  const watchPrice = watch('price')
  const watchDeposit = watch('deposit')
  const watchMonthlyRent = watch('monthly_rent')
  const watchMaintenanceFee = watch('maintenance_fee')
  const watchOwnerDesiredPrice = watch('owner_desired_price')

  // 만원 단위를 한글 형식으로 변환 (예: 50000 -> "5억원", 25000 -> "2억 5000만원")
  const formatPriceKorean = (value: string | undefined): string => {
    if (!value || isNaN(Number(value))) return ''
    const num = Number(value)
    if (num === 0) return '0원'

    const eok = Math.floor(num / 10000) // 억
    const cheon = num % 10000 // 만원 단위

    let result = ''
    if (eok > 0) result += `${eok}억`
    if (cheon > 0) result += ` ${cheon.toLocaleString()}만`
    result += '원'

    return result.trim()
  }

  // 대구시 선택 시 구/군 목록
  const isDaegu = selectedCity === '대구광역시'
  const availableDongs = isDaegu && selectedDistrict ? DAEGU_DONGS[selectedDistrict] || [] : []

  // 시/도 변경 시 구/군, 동 초기화
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value
    setValue('city', newCity)
    setValue('district', '')
    setValue('dong', '')
  }

  // 구/군 변경 시 동 초기화
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newDistrict = e.target.value
    setValue('district', newDistrict)
    setValue('dong', '')
  }

  // AI 설명 생성
  const generateAIDescription = async () => {
    setIsGeneratingAI(true)
    try {
      const formData = watch()
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType: PROPERTY_TYPES[formData.property_type as keyof typeof PROPERTY_TYPES] || formData.property_type,
          transactionType: TRANSACTION_TYPES[formData.transaction_type as keyof typeof TRANSACTION_TYPES] || formData.transaction_type,
          area: formData.area_m2,
          rooms: formData.rooms,
          bathrooms: formData.bathrooms,
          floor: formData.floor,
          features: selectedFeatures,
          address: formData.address,
          city: formData.city,
          district: formData.district,
        }),
      })
      const data = await response.json()
      if (data.description) {
        setValue('description', data.description)
      } else if (data.error) {
        alert('AI 설명 생성에 실패했습니다: ' + data.error)
      }
    } catch (err) {
      console.error('AI generation error:', err)
      alert('AI 설명 생성 중 오류가 발생했습니다.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeExistingImage = (id: string) => {
    setExistingImages(existingImages.filter((img) => img.id !== id))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    )
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const propertyData = {
        title: data.title,
        property_type: data.property_type,
        transaction_type: data.transaction_type,
        status: data.status,
        price: data.price ? Number(data.price) * 10000 : null,
        deposit: data.deposit ? Number(data.deposit) * 10000 : null,
        monthly_rent: data.monthly_rent ? Number(data.monthly_rent) * 10000 : null,
        maintenance_fee: data.maintenance_fee ? Number(data.maintenance_fee) * 10000 : null,
        area_m2: Number(data.area_m2),
        rooms: data.rooms ? Number(data.rooms) : null,
        bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
        floor: data.floor ? Number(data.floor) : null,
        total_floors: data.total_floors ? Number(data.total_floors) : null,
        address: data.address,
        city: data.city,
        district: data.district,
        dong: data.dong || null,
        description: data.description || null,
        built_year: data.built_year ? Number(data.built_year) : null,
        move_in_date: data.move_in_date || null,
        features: selectedFeatures,
        owner_phone: data.owner_phone || null,
        door_password: data.door_password || null,
        owner_desired_price: data.owner_desired_price ? Number(data.owner_desired_price) * 10000 : null,
      }

      let propertyId = initialData?.id

      if (mode === 'create') {
        const result = await createProperty(propertyData)
        if (result.error) throw new Error(result.error)
        propertyId = result.id || undefined
      } else if (propertyId) {
        const result = await updateProperty(propertyId, propertyData)
        if (result.error) throw new Error(result.error)
      }

      // Upload new images
      if (propertyId) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const filePath = generateImagePath(propertyId, file.name)

          try {
            const url = await uploadImage(file, filePath)
            await addPropertyImage(propertyId, {
              url: url,
              storage_path: filePath,
              order_index: existingImages.length + i,
              is_primary: existingImages.length === 0 && i === 0,
            })
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError)
          }
        }
      }

      router.push('/admin/properties')
      router.refresh()
    } catch (err) {
      console.error('Error saving property:', err)
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">매물명 *</Label>
            <Input id="title" {...register('title')} className="mt-1" />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="property_type">매물 유형 *</Label>
              <select
                id="property_type"
                {...register('property_type')}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">선택</option>
                {Object.entries(PROPERTY_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.property_type && (
                <p className="text-sm text-red-500 mt-1">{errors.property_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="transaction_type">거래 유형 *</Label>
              <select
                id="transaction_type"
                {...register('transaction_type')}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">선택</option>
                {Object.entries(TRANSACTION_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {errors.transaction_type && (
                <p className="text-sm text-red-500 mt-1">{errors.transaction_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">상태 *</Label>
              <select
                id="status"
                {...register('status')}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                {Object.entries(PROPERTY_STATUS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Info */}
      <Card>
        <CardHeader>
          <CardTitle>가격 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactionType !== 'monthly' && (
              <div>
                <Label htmlFor="price">
                  {transactionType === 'sale' ? '매매가' : '전세금'} (만원)
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price')}
                  className="mt-1"
                  placeholder="예: 50000 (5억원)"
                />
                {watchPrice && (
                  <p className="text-sm text-primary mt-1 font-medium">{formatPriceKorean(watchPrice)}</p>
                )}
              </div>
            )}

            {transactionType === 'monthly' && (
              <>
                <div>
                  <Label htmlFor="deposit">보증금 (만원)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    {...register('deposit')}
                    className="mt-1"
                    placeholder="예: 5000 (5천만원)"
                  />
                  {watchDeposit && (
                    <p className="text-sm text-primary mt-1 font-medium">{formatPriceKorean(watchDeposit)}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="monthly_rent">월세 (만원)</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    {...register('monthly_rent')}
                    className="mt-1"
                    placeholder="예: 100 (100만원)"
                  />
                  {watchMonthlyRent && (
                    <p className="text-sm text-primary mt-1 font-medium">{formatPriceKorean(watchMonthlyRent)}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <Label htmlFor="maintenance_fee">관리비 (만원)</Label>
              <Input
                id="maintenance_fee"
                type="number"
                {...register('maintenance_fee')}
                className="mt-1"
                placeholder="예: 10 (10만원)"
              />
              {watchMaintenanceFee && (
                <p className="text-sm text-primary mt-1 font-medium">{formatPriceKorean(watchMaintenanceFee)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>상세 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="area_m2">면적 (m²) *</Label>
              <Input
                id="area_m2"
                type="number"
                step="0.01"
                {...register('area_m2')}
                className="mt-1"
              />
              {errors.area_m2 && (
                <p className="text-sm text-red-500 mt-1">{errors.area_m2.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="rooms">방 개수</Label>
              <Input
                id="rooms"
                type="number"
                {...register('rooms')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">욕실 개수</Label>
              <Input
                id="bathrooms"
                type="number"
                {...register('bathrooms')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="built_year">준공년도</Label>
              <Input
                id="built_year"
                type="number"
                {...register('built_year')}
                className="mt-1"
                placeholder="예: 2020"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="floor">층수</Label>
              <Input
                id="floor"
                type="number"
                {...register('floor')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="total_floors">전체 층수</Label>
              <Input
                id="total_floors"
                type="number"
                {...register('total_floors')}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="move_in_date">입주가능일</Label>
              <Input
                id="move_in_date"
                type="date"
                {...register('move_in_date')}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>위치 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">시/도 *</Label>
              <select
                id="city"
                value={selectedCity}
                onChange={handleCityChange}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">선택</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="district">구/군 *</Label>
              {isDaegu ? (
                <select
                  id="district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">선택</option>
                  {DAEGU_DISTRICTS.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id="district"
                  {...register('district')}
                  className="mt-1"
                  placeholder="예: 강남구"
                />
              )}
              {errors.district && (
                <p className="text-sm text-red-500 mt-1">{errors.district.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="dong">동/읍/면</Label>
              {isDaegu && availableDongs.length > 0 ? (
                <select
                  id="dong"
                  {...register('dong')}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">선택</option>
                  {availableDongs.map((dong) => (
                    <option key={dong} value={dong}>{dong}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id="dong"
                  {...register('dong')}
                  className="mt-1"
                  placeholder="예: 역삼동"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">상세 주소 *</Label>
            <Input
              id="address"
              {...register('address')}
              className="mt-1"
              placeholder="전체 주소를 입력하세요"
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>특징</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_FEATURES.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={
                  'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
                  (selectedFeatures.includes(feature)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary')
                }
              >
                {feature}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>상세 설명</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateAIDescription}
            disabled={isGeneratingAI}
            className="gap-2"
          >
            {isGeneratingAI ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI로 작성
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            id="description"
            {...register('description')}
            rows={6}
            placeholder="매물에 대한 상세 설명을 입력하세요"
          />
        </CardContent>
      </Card>

      {/* Owner Info - Admin Only */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="text-orange-700">집주인 정보 (관리자 전용)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-orange-600 mb-4">
            이 정보는 관리자만 볼 수 있으며, 고객에게는 공개되지 않습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="owner_phone">집주인 전화번호</Label>
              <Input
                id="owner_phone"
                type="tel"
                {...register('owner_phone')}
                className="mt-1"
                placeholder="010-0000-0000"
              />
            </div>
            <div>
              <Label htmlFor="door_password">현관 비밀번호</Label>
              <Input
                id="door_password"
                {...register('door_password')}
                className="mt-1"
                placeholder="예: 1234#"
              />
            </div>
            <div>
              <Label htmlFor="owner_desired_price">집주인 희망가 (만원)</Label>
              <Input
                id="owner_desired_price"
                type="number"
                {...register('owner_desired_price')}
                className="mt-1"
                placeholder="예: 50000 (5억원)"
              />
              {watchOwnerDesiredPrice && (
                <p className="text-sm text-primary mt-1 font-medium">{formatPriceKorean(watchOwnerDesiredPrice)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>이미지</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {image.is_primary && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                      대표
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* New Images Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div>
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">클릭하여 이미지 업로드</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG (최대 10MB)</span>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : mode === 'create' ? (
            '등록하기'
          ) : (
            '수정하기'
          )}
        </Button>
      </div>
    </form>
  )
}
