'use client'

import Link from 'next/link'
import { Building2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: '홈', href: '/' },
  { name: '매물검색', href: '/properties' },
  { name: '중개사 소개', href: '/about' },
  { name: '문의하기', href: '/contact' },
  { name: '상담예약', href: '/consultation' },
]

export function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 touch-manipulation">
            <Building2 className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold text-gray-900">부동산중개</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Admin Link */}
          <div className="flex items-center">
            {/* Mobile: 아이콘만 */}
            <Link href="/admin" className="md:hidden p-2 touch-manipulation min-touch-target flex items-center justify-center">
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="sr-only">관리자</span>
            </Link>
            {/* Desktop: 버튼 */}
            <Link href="/admin" className="hidden md:block">
              <Button variant="outline" size="sm">
                관리자
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
