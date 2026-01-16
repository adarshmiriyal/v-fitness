"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserProfile {
  id: number
  email: string
  first_name: string
  last_name: string
  age: number
  phone_number: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/member/profile")
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setFormData(data)
          setError("")
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || "Failed to load profile")
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        setError("Failed to load profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    // Validation
    if (!formData.first_name?.trim()) {
      setError("First name is required")
      return
    }
    if (!formData.last_name?.trim()) {
      setError("Last name is required")
      return
    }
    if (formData.age && (formData.age < 1 || formData.age > 150)) {
      setError("Age must be between 1 and 150")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData(data)
        setIsEditing(false)
        setSuccess("Profile updated successfully!")
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      setError("Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original profile
    if (profile) {
      setFormData(profile)
    }
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/profile-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">My Profile</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Manage your personal information</p>
        </div>
      </section>

    <div className="max-w-2xl mx-auto">
      <Card>
          <CardContent className="space-y-6 pt-6">
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.first_name || ""}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.last_name || ""}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={formData.email || ""} disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={formData.age || ""}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({
                    ...formData,
                    age: value === "" ? undefined : Number.parseInt(value) || undefined,
                  })
                }}
                disabled={!isEditing}
                min={1}
                max={150}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={formData.phone_number || ""}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
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
