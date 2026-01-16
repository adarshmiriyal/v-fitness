"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface Announcement {
  id: number
  title: string
  content: string
  created_at: string
  is_active: boolean
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", content: "" })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/admin/announcements")
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ title: "", content: "" })
        setShowForm(false)
        await fetchAnnouncements()
      }
    } catch (error) {
      console.error("Failed to create announcement:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchAnnouncements()
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/admin-announcements-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-4 py-12">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Announcements</h1>
              <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Create and manage gym announcements</p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              {showForm ? "Cancel" : "New Announcement"}
            </Button>
          </div>
        </div>
      </section>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your announcement here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Announcement"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No announcements yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{announcement.title}</CardTitle>
                    <CardDescription>{new Date(announcement.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <button onClick={() => handleDelete(announcement.id)} className="text-red-600 hover:text-red-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
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
