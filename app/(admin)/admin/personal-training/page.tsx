"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Plus } from "lucide-react"

interface PersonalTraining {
  id: number
  title: string
  description: string
  trainer_name: string | null
  duration_weeks: number | null
  price: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  admin_name: string
}

export default function PersonalTrainingPage() {
  const [programs, setPrograms] = useState<PersonalTraining[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState<PersonalTraining | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trainer_name: "",
    duration_weeks: "",
    price: "",
    is_active: true,
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/admin/personal-training")
      if (response.ok) {
        const data = await response.json()
        setPrograms(data)
      }
    } catch (error) {
      console.error("Failed to fetch personal training programs:", error)
      setError("Failed to load programs")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const url = editingProgram
        ? `/api/admin/personal-training/${editingProgram.id}`
        : "/api/admin/personal-training"
      const method = editingProgram ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          trainer_name: formData.trainer_name || null,
          duration_weeks: formData.duration_weeks ? parseInt(formData.duration_weeks) : null,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      })

      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          trainer_name: "",
          duration_weeks: "",
          price: "",
          is_active: true,
        })
        setShowForm(false)
        setEditingProgram(null)
        setSuccess(editingProgram ? "Program updated successfully" : "Program created successfully")
        setTimeout(() => setSuccess(""), 3000)
        await fetchPrograms()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save program")
      }
    } catch (error) {
      console.error("Failed to save program:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (program: PersonalTraining) => {
    setEditingProgram(program)
    setFormData({
      title: program.title,
      description: program.description,
      trainer_name: program.trainer_name || "",
      duration_weeks: program.duration_weeks?.toString() || "",
      price: program.price?.toString() || "",
      is_active: program.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return

    try {
      const response = await fetch(`/api/admin/personal-training/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Program deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
        await fetchPrograms()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete program")
      }
    } catch (error) {
      console.error("Failed to delete program:", error)
      setError("An error occurred. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading programs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative min-h-[200px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/admin-personal-training-hero.jpg)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full px-4 py-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Personal Training</h1>
              <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Manage personal training programs</p>
            </div>
            <Button
              onClick={() => {
                setShowForm(!showForm)
                setEditingProgram(null)
                setFormData({
                  title: "",
                  description: "",
                  trainer_name: "",
                  duration_weeks: "",
                  price: "",
                  is_active: true,
                })
              }}
              className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Cancel" : "New Program"}
            </Button>
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProgram ? "Edit Program" : "Create New Program"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 12-Week Transformation Program"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the program details, benefits, etc..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer_name">Trainer Name</Label>
                  <Input
                    id="trainer_name"
                    placeholder="e.g., John Doe"
                    value={formData.trainer_name}
                    onChange={(e) => setFormData({ ...formData, trainer_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_weeks">Duration (Weeks)</Label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    min="1"
                    placeholder="e.g., 12"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 5000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingProgram ? "Update Program" : "Create Program"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {programs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No programs yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{program.title}</CardTitle>
                      <Badge variant={program.is_active ? "default" : "secondary"}>
                        {program.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      {program.trainer_name && (
                        <span>Trainer: <strong>{program.trainer_name}</strong></span>
                      )}
                      {program.duration_weeks && (
                        <span>Duration: <strong>{program.duration_weeks} weeks</strong></span>
                      )}
                      {program.price !== null && program.price !== undefined && (() => {
                        const priceNumber = typeof program.price === "number" ? program.price : Number(program.price)
                        if (!Number.isNaN(priceNumber)) {
                          return <span>Price: <strong>₹{priceNumber.toFixed(2)}</strong></span>
                        }
                        return null
                      })()}
                    </div>
                    <CardDescription className="text-xs">
                      Created by {program.admin_name} on {new Date(program.created_at).toLocaleDateString("en-GB")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(program)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(program.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{program.description}</p>
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
