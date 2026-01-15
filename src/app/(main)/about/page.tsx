import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Award, Users, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { label: '거래 완료', value: '500+', suffix: '건' },
  { label: '경력', value: '15', suffix: '년' },
  { label: '만족도', value: '98', suffix: '%' },
  { label: '재계약률', value: '85', suffix: '%' },
]

const certifications = [
  '공인중개사 자격증',
  '주택관리사 자격증',
  '한국공인중개사협회 회원',
  '강남구 우수 중개사무소 선정',
]

const services = [
  {
    title: '매매 중개',
    description: '아파트, 빌라, 상가 등 모든 부동산 매매를 전문적으로 중개합니다.',
  },
  {
    title: '임대 중개',
    description: '전세, 월세 물건을 빠르고 안전하게 중개해 드립니다.',
  },
  {
    title: '시세 상담',
    description: '정확한 시세 분석과 투자 상담을 제공합니다.',
  },
  {
    title: '법률 자문',
    description: '계약 관련 법률 검토 및 자문 서비스를 제공합니다.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              신뢰와 전문성으로<br />
              <span className="text-primary">함께하는 부동산</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              15년간의 경험과 전문성을 바탕으로<br />
              고객님의 소중한 자산을 책임지겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {stat.value}<span className="text-2xl">{stat.suffix}</span>
                </p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-4">중개사 소개</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  안녕하세요. 부동산중개 대표 홍길동입니다.
                </p>
                <p>
                  2009년부터 강남 지역을 중심으로 부동산 중개 업무를 해왔습니다.
                  500건 이상의 거래를 성공적으로 완료하며 쌓아온 경험과 노하우로
                  고객님께 최상의 서비스를 제공하고 있습니다.
                </p>
                <p>
                  정확한 시세 분석, 꼼꼼한 계약 검토, 사후 관리까지
                  부동산 거래의 모든 과정을 책임지겠습니다.
                </p>
              </div>

              <div className="mt-6 space-y-2">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-2" />
                <p>프로필 이미지</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">제공 서비스</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card key={service.title}>
                <CardContent className="pt-6">
                  <Building2 className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">상담이 필요하신가요?</h2>
          <p className="text-primary-foreground/80 mb-8">
            부동산에 관한 모든 궁금증, 편하게 문의해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consultation">
              <Button size="lg" variant="secondary">
                상담 예약하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                문의하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
