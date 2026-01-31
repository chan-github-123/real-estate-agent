import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

// Lazy load ChatBot for better initial page load performance
const ChatBot = dynamic(
  () => import('@/components/chat/ChatBot').then((mod) => ({ default: mod.ChatBot })),
  { ssr: false }
)

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-safe">{children}</main>
      <Footer className="hidden md:block" />
      <ChatBot />
      <MobileBottomNav />
    </div>
  )
}
