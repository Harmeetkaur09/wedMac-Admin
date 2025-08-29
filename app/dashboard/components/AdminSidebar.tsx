"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BarChart3,
  Users,
  UserCircle,
  MessageSquare,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Artist Management",
    href: "/dashboard/artists",
    icon: <Users className="h-5 w-5" />,
    subItems: [
      { title: "Artist List", href: "/dashboard/artists" },
      { title: "Profiles", href: "/dashboard/artists/profiles" },
      // { title: "Status Management", href: "/dashboard/artists/status" },
    ],
  },
  {
    title: "Lead Management",
    href: "/dashboard/leads",
    icon: <MessageSquare className="h-5 w-5" />,
    subItems: [
      { title: "Lead List", href: "/dashboard/leads" },
      { title: "Distribution Rules", href: "/dashboard/leads/distribution" },
      // { title: "Status Tracking", href: "/dashboard/leads/status" },
    ],
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: <UserCircle className="h-5 w-5" />,
    subItems: [
      { title: "User List", href: "/dashboard/users" },
      // { title: "Profiles", href: "/dashboard/users/profiles" },
      // { title: "Status Management", href: "/dashboard/users/status" },
    ],
  },
  {
    title: "Payment Management",
    href: "/dashboard/payments",
    icon: <CreditCard className="h-5 w-5" />,
    subItems: [
      { title: "Subscription Plans", href: "/dashboard/payments/plans" },
      // { title: "Payment Processing", href: "/dashboard/payments/processing" },
      { title: "Transaction History", href: "/dashboard/payments/transactions" },
    ],
  },
  {
    title: "Content Management",
    href: "/dashboard/content",
    icon: <FileText className="h-5 w-5" />,
    subItems: [
      // { title: "WYSIWYG Editor", href: "/dashboard/content/editor" },
      // { title: "Page Editing", href: "/dashboard/content/pages" },
      // { title: "Media Library", href: "/dashboard/content/media" },
      { title: "Blog Management", href: "/dashboard/content/blog" },
    ],
  },
  // {
  //   title: "Reporting & Analytics",
  //   href: "/dashboard/reports",
  //   icon: <BarChart3 className="h-5 w-5" />,
  //   subItems: [
  //     { title: "Website Traffic", href: "/dashboard/reports/traffic" },
  //     { title: "Engagement Metrics", href: "/dashboard/reports/engagement" },
  //     { title: "Lead Reports", href: "/dashboard/reports/leads" },
  //     { title: "Financial Reports", href: "/dashboard/reports/financial" },
  //   ],
  // },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isExpanded = (title: string) => expandedItems.includes(title)

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
         
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] bg-clip-text text-transparent">
              WedMac Admin
            </h2>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isItemExpanded = isExpanded(item.title)

          return (
            <div key={index} className="space-y-1">
              <div
                className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => {
                  if (hasSubItems) {
                    toggleExpanded(item.title)
                  }
                }}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 flex-1"
                  onClick={(e) => {
                    if (hasSubItems) {
                      e.preventDefault()
                    }
                    setIsMobileOpen(false)
                  }}
                >
                  <span
                    className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.title}</span>
                </Link>
                {hasSubItems && (
                  <div className={`transition-transform duration-300 ${isItemExpanded ? "rotate-180" : ""}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Sub Items */}
              {hasSubItems && (
                <div
                  className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                    isItemExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.subItems?.map((subItem, subIndex) => {
                    const isSubActive = pathname === subItem.href
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center space-x-3 p-2 pl-8 rounded-lg text-sm transition-all duration-200 ${
                          isSubActive
                            ? "bg-[#FF6B9D]/10 text-[#FF6B9D] font-medium border-l-2 border-[#FF6B9D]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <ChevronRight className="h-3 w-3" />
                        <span>{subItem.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-70 bg-white border-r border-gray-200 flex-col shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-70 h-full w-60 bg-white border-r border-gray-200 flex-col shadow-xl transform transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
