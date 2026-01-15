'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  MessageSquare,
  Calendar,
  TrendingUp,
  Eye,
  Plus,
  Loader2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getStats, getInquiries, getConsultations } from '@/lib/firebase/firestore'
import { useAuth } from '@/components/providers/AuthProvider'
import { formatDate, formatPhone } from '@/lib/utils'
import type { Inquiry } from '@/types/inquiry'

interface Consultation {
  id: string
  name: string
  phone: string
  preferredDate: string
  preferredTime: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  useAuth() // 인증 상태 확인
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    pendingInquiries: 0,
    pendingConsultations: 0,
  })
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [statsData, inquiriesData, consultationsData] = await Promise.all([
        getStats(),
        getInquiries(),
        getConsultations()
      ])
      setStats(statsData)
      setRecentInquiries(inquiriesData.slice(0, 3))
      setRecentConsultations((consultationsData as Consultation[]).slice(0, 3))
      setLoading(false)
    }
    fetchData()
  }, [])

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? '좋은 아침이에요' : currentHour < 18 ? '좋은 오후에요' : '좋은 저녁이에요'

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm">{greeting}</p>
            <h1 className="text-2xl font-bold mt-1">관리자님, 환영합니다!</h1>
            <p className="text-blue-100 mt-2 text-sm">
              오늘도 좋은 하루 되세요. 현재 {stats.pendingInquiries + stats.pendingConsultations}건의 처리 대기 항목이 있습니다.
            </p>
          </div>
          <Link href="/admin/properties/new">
            <Button className="bg-white text-primary hover:bg-blue-50 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              새 매물 등록
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/properties">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-l-4 border-l-blue-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">전체 매물</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProperties}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-blue-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>전체 보기</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/properties?status=available">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">판매중</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.availableProperties}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                <span>활성 매물</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/inquiries?status=pending">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-l-4 border-l-orange-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">대기중 문의</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingInquiries}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              {stats.pendingInquiries > 0 && (
                <div className="flex items-center gap-1 mt-3 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>처리 필요</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/consultations?status=pending">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer border-l-4 border-l-purple-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">대기중 상담</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingConsultations}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              {stats.pendingConsultations > 0 && (
                <div className="flex items-center gap-1 mt-3 text-xs text-purple-600">
                  <Clock className="h-3 w-3" />
                  <span>예약 대기</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <MessageSquare className="h-4 w-4 text-orange-600" />
              </div>
              <CardTitle className="text-lg">최근 문의</CardTitle>
            </div>
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                전체 보기
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">아직 문의가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{inquiry.name}</p>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            inquiry.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : inquiry.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {inquiry.status === 'pending' ? '대기중' : inquiry.status === 'completed' ? '완료' : '처리중'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{inquiry.message}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-gray-400">{formatPhone(inquiry.phone)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">빠른 작업</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/properties/new" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors">
                <Plus className="h-5 w-5" />
                <span className="font-medium">새 매물 등록</span>
              </div>
            </Link>
            <Link href="/admin/inquiries?status=pending" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-gray-700">대기중 문의 확인</span>
                {stats.pendingInquiries > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.pendingInquiries}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/admin/consultations?status=pending" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700">대기중 상담 확인</span>
                {stats.pendingConsultations > 0 && (
                  <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.pendingConsultations}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/" target="_blank" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Eye className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">사이트 미리보기</span>
                <ArrowUpRight className="h-4 w-4 ml-auto text-gray-400" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Consultations */}
      {recentConsultations.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-lg">최근 상담 예약</CardTitle>
            </div>
            <Link href="/admin/consultations">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                전체 보기
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {recentConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium">
                      {consultation.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{consultation.name}</p>
                      <p className="text-xs text-gray-500">{formatPhone(consultation.phone)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-600">
                      {formatDate(consultation.preferredDate)} {consultation.preferredTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
