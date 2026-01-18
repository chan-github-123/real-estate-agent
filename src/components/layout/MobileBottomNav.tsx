'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: '홈', href: '/', icon: Home },
  { name: '매물', href: '/properties', icon: Search },
  { name: '상담예약', href: '/consultation', icon: Calendar },
  { name: '문의', href: '/contact', icon: MessageCircle },
  { name: '소개', href: '/about', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  // 관리자 페이지에서는 숨김
  if (pathname.startsWith('/admin')) {
    return null
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-16 md:hidden" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors touch-manipulation',
                  active
                    ? 'text-primary'
                    : 'text-gray-500 active:text-primary'
                )}
              >
                <item.icon
                  className={cn(
                    'h-6 w-6 mb-1 transition-transform',
                    active && 'scale-110'
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={cn(
                  'text-xs',
                  active ? 'font-semibold' : 'font-medium'
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
