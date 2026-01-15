'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home, Building2, User, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '매물검색', href: '/properties', icon: Building2 },
  { name: '중개사 소개', href: '/about', icon: User },
  { name: '문의하기', href: '/contact', icon: Phone },
  { name: '상담예약', href: '/consultation', icon: Calendar },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">부동산중개</span>
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

          {/* Admin Link (Desktop) */}
          <div className="hidden md:block">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                관리자
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">메뉴 열기</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-50 rounded-md transition-colors border-t mt-2 pt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              관리자 로그인
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
