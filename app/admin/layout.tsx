import type { ReactNode } from "react"
import AdminSidebar from "./components/AdminSidebar"
import AdminHeader from "./components/AdminHeader"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
