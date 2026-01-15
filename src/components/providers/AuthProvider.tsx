'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthChange } from '@/lib/firebase/auth'
import { Loader2 } from 'lucide-react'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
      setLoading(false)

      // 관리자 페이지 접근 제어
      if (!user && pathname.startsWith('/admin')) {
        router.push('/login')
      }

      // 이미 로그인된 사용자가 로그인 페이지 접근 시
      if (user && pathname === '/login') {
        router.push('/admin')
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  if (loading && pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
