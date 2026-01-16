"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, RefreshCw } from "lucide-react"

interface Announcement {
  id: number
  title: string
  content: string
  created_at: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const fetchAnnouncements = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError("")
    
    try {
      // Pass markRead=true to mark notifications as read when viewing this page
      const response = await fetch("/api/member/announcements?markRead=true")
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to load announcements")
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
      setError("Failed to load announcements. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/announcements-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Gym Announcements</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Stay updated with the latest gym news</p>
      </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            All Announcements ({announcements.length})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnnouncements(true)}
            disabled={refreshing || loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Bell className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">No announcements yet</p>
                <p className="text-sm text-gray-500">
                  Check back later for gym updates and important announcements!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-1">{announcement.title}</CardTitle>
                    <CardDescription>
                      {new Date(announcement.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {announcement.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
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
