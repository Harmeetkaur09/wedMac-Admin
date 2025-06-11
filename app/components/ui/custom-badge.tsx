import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline"
  className?: string
}

export function CustomBadge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-gray-100 text-gray-800",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "warning" && "bg-yellow-100 text-yellow-800",
        variant === "danger" && "bg-red-100 text-red-800",
        variant === "info" && "bg-blue-100 text-blue-800",
        variant === "outline" && "bg-transparent border border-gray-200 text-gray-800",
        className,
      )}
    >
      {children}
    </span>
  )
}
