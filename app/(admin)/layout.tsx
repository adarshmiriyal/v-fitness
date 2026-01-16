import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import AdminNavbar from "@/components/admin-navbar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session || session.userType !== "admin") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
