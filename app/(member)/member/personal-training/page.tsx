"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PersonalTraining {
  id: number
  title: string
  description: string
  trainer_name: string | null
  duration_weeks: number | null
  price: number | null
  created_at: string
}

export default function PersonalTrainingPage() {
  const [programs, setPrograms] = useState<PersonalTraining[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch("/api/member/personal-training")
        if (response.ok) {
          const data = await response.json()
          setPrograms(data)
        }
      } catch (error) {
        console.error("Failed to fetch personal training programs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading programs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/personal-training-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Personal Training</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Transform your fitness with personalized training programs</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto space-y-4">
        {programs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center">No personal training programs available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{program.title}</CardTitle>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {program.trainer_name && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Trainer: {program.trainer_name}
                        </Badge>
                      )}
                      {program.duration_weeks && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {program.duration_weeks} weeks
                        </Badge>
                      )}
                      {program.price !== null && program.price !== undefined && (() => {
                        const priceNumber = typeof program.price === "number" ? program.price : Number(program.price)
                        if (!Number.isNaN(priceNumber)) {
                          return (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              ₹{priceNumber.toFixed(2)}
                            </Badge>
                          )
                        }
                        return null
                      })()}
                    </div>
                    <CardDescription>
                      Available now
                    </CardDescription>
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
