"use client"

import { useState } from "react"
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
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    setResetToken("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset link")
        return
      }

      setSuccess(true)
      // In development, show the token. In production, this would be sent via email
      if (data.token) {
        setResetToken(data.token)
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Mail className="h-6 w-6" />
          Forgot Password
        </CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a password reset link
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm text-green-700">
              <p className="font-semibold mb-2">Reset link sent!</p>
              <p>
                {process.env.NODE_ENV === "development" && resetToken ? (
                  <>
                    In development mode, your reset token is:{" "}
                    <code className="bg-green-100 px-2 py-1 rounded font-mono text-xs break-all">
                      {resetToken}
                    </code>
                    <br />
                    <br />
                    Visit:{" "}
                    <Link
                      href={`/reset-password?token=${resetToken}`}
                      className="underline font-semibold"
                    >
                      Reset Password Page
                    </Link>
                  </>
                ) : (
                  "Please check your email for password reset instructions."
                )}
              </p>
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
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
