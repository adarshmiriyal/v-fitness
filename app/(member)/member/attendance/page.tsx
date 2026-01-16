"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp } from "lucide-react"

type AttendanceRecord = {
  id: number
  date: string
  check_in_time: string // kept for data completeness, not displayed in UI
  check_out_time?: string | null
}

export default function MemberAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/member/attendance/history")
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          setError(errorData.error || "Failed to load attendance records")
          return
        }

        const data = await res.json()

        if (Array.isArray(data)) {
          setRecords(data)
          setError("")
        } else {
          setRecords([])
          setError("Invalid data received")
        }
      } catch (err) {
        console.error(err)
        setError("Failed to load attendance records. Please try again.")
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Calculate summary statistics
  const totalDays = records.length
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const thisMonthCount = records.filter(r => {
    const recordDate = new Date(r.date)
    return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear
  }).length

  const formatDate = (dateString: string) => {
    try {
      // Handle DATE type from database (YYYY-MM-DD format)
      // If it's already a date string, parse it properly
      let date: Date
      if (dateString.includes("T")) {
        // Already has time component
        date = new Date(dateString)
      } else {
        // Pure date string, add time component for proper parsing
        date = new Date(dateString + "T00:00:00")
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString // Return original if invalid
      }
      
      return date.toLocaleDateString("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/attendance-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">My Attendance</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Track your gym attendance history</p>
        </div>
      </section>

      {/* Summary Cards (date-based only, no time) */}
      {!loading && records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold">{totalDays}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold">{thisMonthCount}</span>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Loading attendance records...</p>
            </div>
          </CardContent>
        </Card>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No attendance records found</p>
              <p className="text-gray-400 text-sm mt-2">Start marking your attendance to see records here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
          <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  </tr>
          </thead>
          <tbody>
                  {records.map((r, index) => (
                    <tr 
                      key={r.id} 
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index === 0 ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="p-3 font-medium">{formatDate(r.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Developer Credit */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Developed by <span className="font-semibold text-gray-700">Adarshmiriyal</span>
        </p>
      </div>
    </div>
  )
}
