import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WedMac Admin - Makeup Artist Marketplaceeee",
  description: "Admin panel for managing makeup artist marketplace",
  generator: "v0.dev",
  icons: {
    icon: "/logotab.png", // root public folder me favicon.ico rakho
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // optional
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
