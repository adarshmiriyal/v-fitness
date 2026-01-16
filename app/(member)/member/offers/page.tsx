"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Offer {
  id: number
  title: string
  description: string
  discount_percentage: number | null
  valid_from: string
  valid_until: string
  created_at: string
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/member/offers")
        if (response.ok) {
          const data = await response.json()
          setOffers(data)
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

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

  const isOfferValid = (validFrom: string, validUntil: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const from = new Date(validFrom)
    from.setHours(0, 0, 0, 0)
    const until = new Date(validUntil)
    until.setHours(23, 59, 59, 999)
    return today >= from && today <= until
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
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/offers-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Special Offers</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Check out our latest gym offers and discounts</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto space-y-4">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center">No offers available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          offers.map((offer) => {
            const isValid = isOfferValid(offer.valid_from, offer.valid_until)
            return (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{offer.title}</CardTitle>
                        {offer.discount_percentage && (
                          <Badge className="bg-green-600 text-white">
                            {offer.discount_percentage}% OFF
                          </Badge>
                        )}
                        {isValid ? (
                          <Badge variant="default" className="bg-blue-600">Valid Now</Badge>
                        ) : (
                          <Badge variant="secondary">Expired</Badge>
                        )}
                      </div>
                      <CardDescription>
                        Valid from {formatDate(offer.valid_from)} to {formatDate(offer.valid_until)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{offer.description}</p>
                </CardContent>
              </Card>
            )
          })
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
