import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatBot } from '@/components/chat/ChatBot'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

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
