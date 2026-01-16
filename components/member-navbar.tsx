"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"

export default function MemberNavbar({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/member/dashboard" className="text-2xl font-bold text-blue-600">
          V FITNESS
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/member/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/member/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          <Link href="/member/attendance" className="text-gray-700 hover:text-blue-600">
            Attendance
          </Link>
          <Link href="/member/announcements" className="text-gray-700 hover:text-blue-600">
            Announcements
          </Link>
          <Link href="/member/payment" className="text-gray-700 hover:text-blue-600">
            Payment
          </Link>
          <Link href="/member/offers" className="text-gray-700 hover:text-blue-600">
            Offers
          </Link>
          <Link href="/member/personal-training" className="text-gray-700 hover:text-blue-600">
            Personal Training
          </Link>
          <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 space-y-2">
            <Link href="/member/dashboard" className="block text-gray-700 hover:text-blue-600 py-2">
              Dashboard
            </Link>
            <Link href="/member/profile" className="block text-gray-700 hover:text-blue-600 py-2">
              Profile
            </Link>
            <Link href="/member/attendance" className="block text-gray-700 hover:text-blue-600 py-2">
              Attendance
            </Link>
            <Link href="/member/announcements" className="block text-gray-700 hover:text-blue-600 py-2">
              Announcements
            </Link>
            <Link href="/member/payment" className="block text-gray-700 hover:text-blue-600 py-2">
              Payment
            </Link>
            <Link href="/member/offers" className="block text-gray-700 hover:text-blue-600 py-2">
              Offers
            </Link>
            <Link href="/member/personal-training" className="block text-gray-700 hover:text-blue-600 py-2">
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
