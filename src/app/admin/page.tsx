'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, MessageSquare, Calendar, TrendingUp, Eye, Plus, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getStats, getInquiries } from '@/lib/firebase/firestore'
import { useAuth } from '@/components/providers/AuthProvider'
import type { Inquiry } from '@/types/inquiry'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    pendingInquiries: 0,
    pendingConsultations: 0,
  })
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [statsData, inquiriesData] = await Promise.all([
        getStats(),
        getInquiries()
      ])
      setStats(statsData)
      setRecentInquiries(inquiriesData.slice(0, 5))
      setLoading(false)
    }
    fetchData()
  }, [])

  const statCards = [
    {
      title: '전체 매물',
      value: stats.totalProperties,
      icon: Building2,
      href: '/admin/properties',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '판매중 매물',
      value: stats.availableProperties,
      icon: TrendingUp,
      href: '/admin/properties?status=available',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '대기중 문의',
      value: stats.pendingInquiries,
      icon: MessageSquare,
      href: '/admin/inquiries?status=pending',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: '대기중 상담',
      value: stats.pendingConsultations,
      icon: Calendar,
      href: '/admin/consultations?status=pending',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-gray-600">부동산 관리 현황을 확인하세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={'p-3 rounded-full ' + stat.bgColor}>
                    <stat.icon className={'h-6 w-6 ' + stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 문의</CardTitle>
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm">전체 보기</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">문의가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {inquiry.message}
                      </p>
                    </div>
                    <span
                      className={
                        inquiry.status === 'pending'
                          ? 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'
                          : inquiry.status === 'completed'
                          ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
                          : 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
                      }
                    >
                      {inquiry.status === 'pending' ? '대기중' : inquiry.status === 'completed' ? '완료' : '처리중'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/properties/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                새 매물 등록
              </Button>
            </Link>
            <Link href="/admin/inquiries?status=pending">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                대기중 문의 확인
              </Button>
            </Link>
            <Link href="/admin/consultations?status=pending">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                대기중 상담 확인
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                사이트 미리보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
