"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Artist Management",
    href: "/admin/artists",
    icon: <Users className="h-5 w-5" />,
    subItems: [
      { title: "Artist List", href: "/admin/artists" },
      { title: "Profiles", href: "/admin/artists/profiles" },
  
      // { title: "Status Management", href: "/admin/artists/status" },
    ],
  },
  {
    title: "Lead Management",
    href: "/admin/leads",
    icon: <MessageSquare className="h-5 w-5" />,
    subItems: [
      { title: "Lead List", href: "/admin/leads" },
      { title: "Distribution Rules", href: "/admin/leads/distribution" },
      { title: "Bulk Lead", href: "/admin/leads/bulk" },
    ],
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: <UserCircle className="h-5 w-5" />,
    subItems: [
      { title: "User List", href: "/admin/users" },
      // { title: "Profiles", href: "/admin/users/profiles" },
      // { title: "Status Management", href: "/admin/users/status" },
    ],
  },
  {
    title: "Payment Management",
    href: "/admin/payments",
    icon: <CreditCard className="h-5 w-5" />,
    subItems: [
      { title: "Subscription Plans", href: "/admin/payments/plans" },
      // { title: "Payment Processing", href: "/admin/payments/processing" },
      { title: "Transaction History", href: "/admin/payments/transactions" },
    ],
  },
  {
    title: "Content Management",
    href: "/admin/content",
    icon: <FileText className="h-5 w-5" />,
    subItems: [
      { title: "Artist Comments", href: "/admin/content/pages" },
      { title: "Reported Leads", href: "/admin/content/media" },
      { title: "Blog Management", href: "/admin/content/blog" },
    ],
  },
  // {
  //   title: "Reporting & Analytics",
  //   href: "/admin/reports",
  //   icon: <BarChart3 className="h-5 w-5" />,
  //   subItems: [
  //     { title: "Website Traffic", href: "/admin/reports/traffic" },
  //     { title: "Engagement Metrics", href: "/admin/reports/engagement" },
  //     { title: "Lead Reports", href: "/admin/reports/leads" },
  //     { title: "Financial Reports", href: "/admin/reports/financial" },
  //   ],
  // },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#FF6B9D]">WedMac Admin</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={index} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm ${
                    isActive
                      ? "text-[#FF6B9D] bg-pink-50 border-l-4 border-[#FF6B9D]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
                {item.subItems && isActive && (
                  <ul className="ml-12 mt-2 space-y-2">
                    {item.subItems.map((subItem, subIndex) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className={`text-sm ${
                              isSubActive ? "text-[#FF6B9D] font-medium" : "text-gray-600 hover:text-[#FF6B9D]"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-6 border-t">
        <button className="flex items-center text-red-500 hover:text-red-700">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  )
}
