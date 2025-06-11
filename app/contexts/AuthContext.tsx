"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Static user data for demo
const DEMO_USERS = [
  {
    id: "1",
    email: "admin@atlas.com",
    password: "admin123",
    name: "Admin User",
    role: "Super Admin",
  },
  {
    id: "2",
    email: "manager@atlas.com",
    password: "manager123",
    name: "Manager User",
    role: "Manager",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("atlas_admin_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      }
      setUser(userWithoutPassword)
      localStorage.setItem("atlas_admin_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      router.push("/dashboard")
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("atlas_admin_user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
