"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Users, TrendingUp } from "lucide-react"

type AttendanceRecord = {
  id: number
  member_name: string
  age: number
  date: string
  check_in_time: string // kept for data completeness, not displayed in UI
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/attendance")
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          setError(errorData.error || "Failed to load attendance records")
          return
        }

        const data = await res.json()
        // Ensure dates are strings (PostgreSQL DATE type returns as string)
        const processedData = Array.isArray(data) 
          ? data.map(record => ({
              ...record,
              date: record.date ? String(record.date) : record.date,
            }))
          : []
        setRecords(processedData)
        setError("")
      } catch (err: any) {
        console.error("Attendance fetch error:", err)
        const errorMessage = err?.message || err?.toString() || "Unknown error"
        if (errorMessage.includes("fetch failed") || errorMessage.includes("Failed to fetch")) {
          setError("Error connecting to database. Please check your connection and try again.")
        } else {
          setError(`Failed to load attendance records: ${errorMessage}`)
        }
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const formatDate = (dateValue: string | Date | null | undefined) => {
    try {
      if (!dateValue) {
        return "N/A"
      }

      // Convert to string if needed
      const dateString = typeof dateValue === "string" 
        ? dateValue 
        : dateValue instanceof Date 
        ? dateValue.toISOString().split("T")[0]
        : String(dateValue)

      // Handle PostgreSQL DATE type (YYYY-MM-DD format)
      // Parse the date string properly for IST timezone
      let date: Date
      
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Pure date format YYYY-MM-DD, parse as IST (Asia/Kolkata)
        // Create date at midnight IST
        date = new Date(dateString + "T00:00:00+05:30")
      } else if (dateString.includes("T")) {
        // ISO format with time
        date = new Date(dateString)
      } else {
        // Try parsing as-is
        date = new Date(dateString)
      }
      
      // Validate the date
      if (isNaN(date.getTime())) {
        console.error("Invalid date value:", dateValue, "String:", dateString)
        return dateString // Return original if invalid
      }
      
      // Format as DD/MM/YYYY using IST timezone
      return date.toLocaleDateString("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Date formatting error:", error, "Input:", dateValue)
      return String(dateValue || "N/A")
    }
  }

  const filtered = records.filter(r => {
    const searchLower = search.toLowerCase()
    const formattedDate = formatDate(r.date)
    return (
      r.member_name.toLowerCase().includes(searchLower) ||
      r.date.includes(search) ||
      formattedDate.toLowerCase().includes(searchLower)
    )
  })

  // Calculate summary statistics
  const totalRecords = filtered.length
  // Get today's date in IST format (YYYY-MM-DD)
  const todayIST = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }) // en-CA gives YYYY-MM-DD format
  const todayCount = filtered.filter(r => {
    // Compare dates - r.date is already in YYYY-MM-DD format from database
    const recordDate = typeof r.date === "string" ? r.date.split("T")[0] : r.date
    return recordDate === todayIST
  }).length
  const uniqueMembers = new Set(filtered.map(r => r.member_name)).size

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/admin-attendance-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Attendance Records</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">View and manage all gym attendance</p>
        </div>
      </section>

      {/* Summary Cards */}
      {!loading && records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold">{totalRecords}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold">{todayCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Unique Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-indigo-600" />
                <span className="text-2xl font-bold">{uniqueMembers}</span>
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by member name or date..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Loading attendance records...</p>
            </div>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                {search ? "No attendance records found" : "No attendance records yet"}
              </p>
              {search && (
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-3 font-semibold text-gray-700">Member Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Age</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, index) => (
                    <tr
                      key={r.id}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index === 0 ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="p-3 font-medium">{r.member_name}</td>
                      <td className="p-3">{r.age}</td>
                      <td className="p-3">{formatDate(r.date)}</td>
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
