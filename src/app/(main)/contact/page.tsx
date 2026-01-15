import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { InquiryForm } from '@/components/inquiry/InquiryForm'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">문의하기</h1>
        <p className="text-gray-600">
          궁금한 점이 있으시면 언제든 문의해 주세요.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">연락처 정보</h2>

          <div className="space-y-4">
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">전화</h3>
                  <p className="text-gray-600">02-1234-5678</p>
                  <p className="text-sm text-gray-500">빠른 상담을 원하시면 전화주세요</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">이메일</h3>
                  <p className="text-gray-600">contact@realestate.com</p>
                  <p className="text-sm text-gray-500">24시간 내 답변드립니다</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">주소</h3>
                  <p className="text-gray-600">서울특별시 강남구 테헤란로 123</p>
                  <p className="text-sm text-gray-500">부동산빌딩 5층</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">영업시간</h3>
                  <p className="text-gray-600">평일 09:00 - 18:00</p>
                  <p className="text-sm text-gray-500">토요일 10:00 - 14:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inquiry Form */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-6">문의 양식</h2>
              <InquiryForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
