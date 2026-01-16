"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to reset password")
        return
      }

      setSuccess(true)
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login?reset=success")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            Invalid or missing reset token. Please request a new password reset link.
          </div>
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Request New Reset Link
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Lock className="h-6 w-6" />
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your new password below
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm text-green-700">
              <p className="font-semibold">Password reset successful!</p>
              <p className="mt-2">Redirecting to login page...</p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-blue-600 hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </>
        )}

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
