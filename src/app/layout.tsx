import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: '부동산 중개 | 신뢰할 수 있는 부동산 파트너',
  description: '아파트, 빌라, 오피스텔, 상가 등 다양한 매물을 검색하고 전문 중개 서비스를 받아보세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
