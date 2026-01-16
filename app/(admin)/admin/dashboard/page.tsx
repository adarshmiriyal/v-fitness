"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Bell, TrendingUp, UserCheck, FileText, Tag, Dumbbell } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayAttendance: 0,
    totalAnnouncements: 0,
    activeMembers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
          setError("")
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || "Failed to load dashboard stats")
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setError("Failed to load dashboard stats. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[300px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/admin-dashboard-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Admin Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Manage your gym operations</p>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
      </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 h-4 bg-gray-200 rounded animate-pulse"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">{stats.totalMembers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">{stats.todayAttendance}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold">{stats.totalAnnouncements}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold">{stats.activeMembers}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/members">
          <Card className="hover:shadow-lg cursor-pointer transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>User Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage gym members and their profiles</p>
              <Button className="w-full">View Members</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/attendance">
          <Card className="hover:shadow-lg cursor-pointer transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>View Attendance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Check attendance records by member</p>
              <Button className="w-full">View Attendance</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/announcements">
          <Card className="hover:shadow-lg cursor-pointer transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Announcements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and manage gym announcements</p>
              <Button className="w-full">Manage Announcements</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/offers">
          <Card className="hover:shadow-lg cursor-pointer transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Gym Offers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and manage special offers and discounts</p>
              <Button className="w-full">Manage Offers</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/personal-training">
          <Card className="hover:shadow-lg cursor-pointer transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Dumbbell className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Personal Training</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage personal training programs and trainers</p>
              <Button className="w-full">Manage Programs</Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Developer Credit */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Developed by <span className="font-semibold text-gray-700">Adarshmiriyal</span>
        </p>
      </div>
    </div>
  )
}
