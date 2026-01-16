"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phoneNumber: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          age: Number.parseInt(formData.age),
          phoneNumber: formData.phoneNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Signup failed")
        return
      }

      // Show success message for pending approval
      if (data.pending) {
        setSuccess(data.message || "Account created successfully. Please wait for admin approval.")
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?pending=approval")
        }, 3000)
      } else {
        router.push("/member/dashboard")
      }
    } catch (err) {
      setError("An error occurred during signup")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <CardTitle className="text-2xl">Join V FITNESS</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="age" className="text-sm">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber" className="text-sm">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+1234567890"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
              {success}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !!success}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>

        {/* Developer Credit */}
        <div className="text-center pt-4 border-t border-gray-200 mt-4">
          <p className="text-xs text-gray-500">
            Developed by <span className="font-semibold text-gray-700">Adarshmiriyal</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
