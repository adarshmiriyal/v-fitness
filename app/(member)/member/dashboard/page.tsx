"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, TrendingUp, Bell, CalendarCheck, FileText, CreditCard, Tag, Dumbbell } from "lucide-react"

export default function MemberDashboard() {
  const [stats, setStats] = useState({
    todayAttended: false,
    weekAttendance: 0,
    monthAttendance: 0,
    unreadNotifications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [error, setError] = useState("")
  const [latestAnnouncement, setLatestAnnouncement] = useState<{
    title: string
    content: string
    created_at: string
  } | null>(null)
  const [records, setRecords] = useState<{
    id: number
    title: string
    description: string
    amount: number | string | null
    record_type: string
    created_at: string
    admin_name: string
  }[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/member/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data)
          setError("")
        } else {
          setError("Failed to load dashboard stats")
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err)
        setError("Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    const fetchLatestAnnouncement = async () => {
      try {
        const res = await fetch("/api/member/announcements")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setLatestAnnouncement(data[0]) // Get the first (latest) announcement
          }
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err)
      }
    }

    const fetchRecords = async () => {
      setRecordsLoading(true)
      try {
        const res = await fetch("/api/member/records")
        if (res.ok) {
          const data = await res.json()
          setRecords(data.slice(0, 5)) // Show latest 5 records
        }
      } catch (err) {
        console.error("Failed to fetch records:", err)
      } finally {
        setRecordsLoading(false)
      }
    }

    fetchStats()
    fetchLatestAnnouncement()
    fetchRecords()
  }, [])

  const markAttendance = async () => {
    if (stats.todayAttended) return

    setMarking(true)
    setError("")
    try {
      const res = await fetch("/api/member/attendance", { method: "POST" })
      const data = await res.json()

      if (data.success || data.alreadyMarked) {
        // Refetch stats to get accurate counts from server
        const statsRes = await fetch("/api/member/stats")
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        } else {
          // Fallback to optimistic update if refetch fails
        setStats(prev => ({
          ...prev,
          todayAttended: true,
          weekAttendance: prev.weekAttendance + 1,
          monthAttendance: prev.monthAttendance + 1,
        }))
        }
      } else {
        setError(data.error || "Failed to mark attendance")
      }
    } catch (err) {
      console.error("Attendance failed:", err)
      setError("Failed to mark attendance. Please try again.")
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[300px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/member-dashboard-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Welcome Back!</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Track your fitness journey with V FITNESS</p>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
      </div>
      )}

      {/* ===== Stats Cards ===== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
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
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`h-8 w-8 ${
                  stats.todayAttended ? "text-green-600" : "text-gray-300"
                }`}
              />
              <span className="text-lg font-semibold">
                {stats.todayAttended ? "Marked" : "Not Yet"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Week Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.weekAttendance}
            </div>
            <p className="text-xs text-gray-500">days attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Month Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {stats.monthAttendance}
            </div>
            <p className="text-xs text-gray-500">days attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="h-8 w-8 text-orange-600" />
              <span className="text-lg font-semibold">
                {stats.unreadNotifications}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* ===== Quick Actions ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              className="w-full gap-2"
              onClick={markAttendance}
              disabled={stats.todayAttended || marking || loading}
            >
              <CalendarCheck className="h-5 w-5" />
              {stats.todayAttended ? "Attendance Marked" : "Mark Attendance"}
            </Button>

            <Link href="/member/attendance">
              <Button className="w-full gap-2" variant="outline">
                <TrendingUp className="h-5 w-5" />
                View Attendance
              </Button>
            </Link>

            <Link href="/member/profile">
              <Button className="w-full" variant="outline">
                Update Profile
              </Button>
            </Link>

            <Link href="/member/announcements">
              <Button className="w-full gap-2" variant="outline">
                <Bell className="h-5 w-5" />
                Announcements
              </Button>
            </Link>

            <Link href="/member/payment">
              <Button className="w-full gap-2" variant="outline">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </Button>
            </Link>

            <Link href="/member/offers">
              <Button className="w-full gap-2" variant="outline">
                <Tag className="h-5 w-5" />
                View Offers
              </Button>
            </Link>

            <Link href="/member/personal-training">
              <Button className="w-full gap-2" variant="outline">
                <Dumbbell className="h-5 w-5" />
                Personal Training
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            {latestAnnouncement ? (
              <div>
                <h3 className="font-semibold text-sm mb-1">{latestAnnouncement.title}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(latestAnnouncement.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {latestAnnouncement.content}
                </p>
                <Link href="/member/announcements" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                  View all announcements →
                </Link>
              </div>
            ) : (
            <p className="text-sm text-gray-600">
              Check back later for gym updates and announcements!
            </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Member Records Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Records
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recordsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No records found. Records added by admin will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{record.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {record.record_type}
                      </Badge>
                    </div>
                    {record.amount !== null && (() => {
                      const amountNumber =
                        typeof record.amount === "number"
                          ? record.amount
                          : Number(record.amount)
                      if (!Number.isNaN(amountNumber)) {
                        return (
                          <span className="font-semibold text-green-600">
                            ₹{amountNumber.toFixed(2)}
                          </span>
                        )
                      }
                      return null
                    })()}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Added by: {record.admin_name}</span>
                    <span>
                      {new Date(record.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Developer Credit */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Developed by <span className="font-semibold text-gray-700">Adarshmiriyal</span>
        </p>
      </div>
    </div>
  )
}
