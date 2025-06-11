import type { ReactNode } from "react"
import AdminSidebar from "./components/AdminSidebar"
import AdminHeader from "./components/AdminHeader"
import ProtectedRoute from "../components/ProtectedRoute"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
