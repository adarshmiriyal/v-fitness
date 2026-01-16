"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="text-2xl font-bold text-white">
          V FITNESS Admin
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/members" className="text-gray-300 hover:text-white">
            Members
          </Link>
          <Link href="/admin/attendance" className="text-gray-300 hover:text-white">
            Attendance
          </Link>
          <Link href="/admin/announcements" className="text-gray-300 hover:text-white">
            Announcements
          </Link>
          <Link href="/admin/offers" className="text-gray-300 hover:text-white">
            Offers
          </Link>
          <Link href="/admin/personal-training" className="text-gray-300 hover:text-white">
            Personal Training
          </Link>
          <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 space-y-2">
            <Link href="/admin/dashboard" className="block text-gray-300 hover:text-white py-2">
              Dashboard
            </Link>
            <Link href="/admin/members" className="block text-gray-300 hover:text-white py-2">
              Members
            </Link>
            <Link href="/admin/attendance" className="block text-gray-300 hover:text-white py-2">
              Attendance
            </Link>
            <Link href="/admin/announcements" className="block text-gray-300 hover:text-white py-2">
              Announcements
            </Link>
            <Link href="/admin/offers" className="block text-gray-300 hover:text-white py-2">
              Offers
            </Link>
            <Link href="/admin/personal-training" className="block text-gray-300 hover:text-white py-2">
              Personal Training
            </Link>
            <Button onClick={handleLogout} className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
