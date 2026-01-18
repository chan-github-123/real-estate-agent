import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-gray-900 text-gray-300", className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-white">부동산중개</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              신뢰할 수 있는 부동산 전문 중개 서비스를 제공합니다.
              고객님의 소중한 자산을 책임지겠습니다.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">대표:</span> 홍길동</p>
              <p><span className="text-gray-500">사업자등록번호:</span> 123-45-67890</p>
              <p><span className="text-gray-500">중개등록번호:</span> 제2024-서울강남-00001호</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">연락처</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@realestate.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>서울특별시 강남구 테헤란로 123<br />부동산빌딩 5층</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span>평일 09:00 - 18:00 / 토 10:00 - 14:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">바로가기</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/properties" className="hover:text-primary transition-colors">
                매물검색
              </Link>
              <Link href="/properties?type=apartment" className="hover:text-primary transition-colors">
                아파트
              </Link>
              <Link href="/properties?type=villa" className="hover:text-primary transition-colors">
                빌라/연립
              </Link>
              <Link href="/properties?type=officetel" className="hover:text-primary transition-colors">
                오피스텔
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                중개사 소개
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                문의하기
              </Link>
              <Link href="/consultation" className="hover:text-primary transition-colors">
                상담예약
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 부동산중개. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
