"use client"

import { Bell, Search, User, Settings, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../../contexts/AuthContext"

export default function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Section */}
        <div className="flex items-center flex-1 max-w-md">
       
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            {/* <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B9D] text-white text-xs animate-pulse">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger> */}
            <DropdownMenuContent align="end" className="w-80 animate-slide-down">
              {/* <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="bg-[#FF6B9D]/10 text-[#FF6B9D]">
                  3 new
                </Badge>
              </DropdownMenuLabel> */}
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[
                  {
                    title: "New artist application",
                    description: "Avneet Kaur submitted a new application",
                    time: "2 hours ago",
                    type: "application",
                  },
                  {
                    title: "Payment received",
                    description: "₹12,000 payment from Priya Sharma",
                    time: "4 hours ago",
                    type: "payment",
                  },
                  {
                    title: "New booking request",
                    description: "Wedding makeup booking for June 15",
                    time: "6 hours ago",
                    type: "booking",
                  },
                ].map((notification, i) => (
                  <DropdownMenuItem key={i} className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "application"
                            ? "bg-blue-500"
                            : notification.type === "payment"
                              ? "bg-green-500"
                              : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                <Button variant="ghost" size="sm" className="w-full text-[#FF6B9D] hover:bg-[#FF6B9D]/10">
                  View all notifications
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative flex items-center space-x-3 hover:bg-gray-100 transition-colors p-2 rounded-xl"
              >
                <Avatar className="h-8 w-8 ring-2 ring-[#FF6B9D]/20">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-[#FF6B9D] to-[#FF5A8C] text-white font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-slide-down">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
