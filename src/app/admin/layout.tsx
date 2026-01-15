import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-0">
          <div className="pt-14 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
