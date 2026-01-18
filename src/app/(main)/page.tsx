export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Building2, Search, Phone, CheckCircle, ArrowRight, Star, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PropertyCard } from '@/components/property/PropertyCard'
import { getProperties } from '@/lib/firebase/firestore'

const features = [
  {
    icon: Search,
    title: '다양한 매물',
    description: '아파트, 빌라, 오피스텔, 상가 등 다양한 매물을 한눈에 검색하세요.',
  },
  {
    icon: CheckCircle,
    title: '검증된 정보',
    description: '직접 확인한 매물만 등록하여 정확한 정보를 제공합니다.',
  },
  {
    icon: Phone,
    title: '전문 상담',
    description: '부동산 전문가가 고객님의 조건에 맞는 매물을 추천해 드립니다.',
  },
]

const propertyTypes = [
  { name: '아파트', href: '/properties?property_type=apartment', count: '150+' },
  { name: '빌라/연립', href: '/properties?property_type=villa', count: '80+' },
  { name: '오피스텔', href: '/properties?property_type=officetel', count: '60+' },
  { name: '상가', href: '/properties?property_type=commercial', count: '40+' },
]

const stats = [
  { label: '누적 거래 건수', value: '1,200+', icon: TrendingUp },
  { label: '등록 매물', value: '350+', icon: Building2 },
  { label: '고객 만족도', value: '98%', icon: Star },
  { label: '협력 중개사', value: '50+', icon: Users },
]

export default async function HomePage() {
  const properties = await getProperties({ status: 'available' })
  const latestProperties = properties.slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-blue-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              신뢰할 수 있는<br />
              <span className="text-primary">부동산 파트너</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-2">
              고객님의 소중한 자산, 전문 중개사가 책임지겠습니다.
              원하시는 조건의 매물을 지금 바로 찾아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
              <Link href="/properties" className="w-full sm:w-auto">
                <Button size="lg" className="w-full touch-manipulation min-h-[48px]">
                  <Search className="mr-2 h-5 w-5" />
                  매물 검색하기
                </Button>
              </Link>
              <Link href="/consultation" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full touch-manipulation min-h-[48px]">
                  <Phone className="mr-2 h-5 w-5" />
                  상담 예약하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 mb-2 md:mb-3">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-10">매물 유형별 검색</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {propertyTypes.map((type) => (
              <Link key={type.name} href={type.href} className="touch-manipulation">
                <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98] md:active:scale-100">
                  <CardContent className="p-4 md:p-6 text-center">
                    <Building2 className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 md:mb-3 text-primary" />
                    <h3 className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">{type.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{type.count} 매물</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Properties */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">최신 매물</h2>
              <p className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">새로운 매물을 확인하세요</p>
            </div>
            <Link href="/properties" className="hidden sm:block">
              <Button variant="outline" className="touch-manipulation">
                전체 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {latestProperties.length > 0 ? (
            <>
              {/* 모바일: 가로 스크롤 */}
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x-mandatory hide-scrollbar pb-4">
                  {latestProperties.map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-[280px] snap-start">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              </div>
              {/* 데스크톱: 그리드 */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              {/* 모바일 전체보기 버튼 */}
              <div className="mt-6 text-center sm:hidden">
                <Link href="/properties">
                  <Button variant="outline" className="w-full touch-manipulation min-h-[44px]">
                    전체 매물 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">현재 등록된 매물이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10">왜 저희를 선택해야 할까요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex md:flex-col items-start md:items-center md:text-center gap-4 md:gap-0">
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 md:mb-4">
                  <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
            원하시는 매물을 찾지 못하셨나요?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            조건에 맞는 매물이 없더라도 걱정하지 마세요.
            전문 상담을 통해 고객님께 딱 맞는 매물을 찾아드리겠습니다.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="touch-manipulation min-h-[48px]">
              문의하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
