"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X, Edit, Trash2, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Offer {
  id: number
  title: string
  description: string
  discount_percentage: number | null
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
  updated_at: string
  admin_name: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    valid_from: "",
    valid_until: "",
    is_active: true,
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/admin/offers")
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error)
      setError("Failed to load offers")
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
      const url = editingOffer
        ? `/api/admin/offers/${editingOffer.id}`
        : "/api/admin/offers"
      const method = editingOffer ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        }),
      })

      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          discount_percentage: "",
          valid_from: "",
          valid_until: "",
          is_active: true,
        })
        setShowForm(false)
        setEditingOffer(null)
        setSuccess(editingOffer ? "Offer updated successfully" : "Offer created successfully")
        setTimeout(() => setSuccess(""), 3000)
        await fetchOffers()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save offer")
      }
    } catch (error) {
      console.error("Failed to save offer:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_percentage: offer.discount_percentage?.toString() || "",
      valid_from: offer.valid_from,
      valid_until: offer.valid_until,
      is_active: offer.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return

    try {
      const response = await fetch(`/api/admin/offers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Offer deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
        await fetchOffers()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete offer")
      }
    } catch (error) {
      console.error("Failed to delete offer:", error)
      setError("An error occurred. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading offers...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative min-h-[200px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/admin-offers-hero.jpg)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full px-4 py-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Gym Offers</h1>
              <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Create and manage special offers</p>
            </div>
            <Button
              onClick={() => {
                setShowForm(!showForm)
                setEditingOffer(null)
                setFormData({
                  title: "",
                  description: "",
                  discount_percentage: "",
                  valid_from: "",
                  valid_until: "",
                  is_active: true,
                })
              }}
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? "Cancel" : "New Offer"}
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
            <CardTitle>{editingOffer ? "Edit Offer" : "Create New Offer"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., New Year Special"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 20"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the offer details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valid_from">Valid From *</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valid_until">Valid Until *</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    required
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
                {submitting ? "Saving..." : editingOffer ? "Update Offer" : "Create Offer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              No offers yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{offer.title}</CardTitle>
                      <Badge variant={offer.is_active ? "default" : "secondary"}>
                        {offer.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {offer.discount_percentage && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {offer.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Valid: {formatDate(offer.valid_from)} - {formatDate(offer.valid_until)}
                    </CardDescription>
                    <CardDescription className="text-xs mt-1">
                      Created by {offer.admin_name} on {formatDate(offer.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(offer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{offer.description}</p>
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
