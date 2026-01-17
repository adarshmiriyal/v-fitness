"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { ArrowLeft } from "lucide-react"

/* =========================
   INNER COMPONENT (SAFE)
========================= */
function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const blockedFromQuery = searchParams.get("blocked")
  const resetSuccess = searchParams.get("reset") === "success"
  const pendingApproval = searchParams.get("pending") === "approval"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"member" | "admin">("member")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [blocked, setBlocked] = useState(false)
  const [pending, setPending] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setBlocked(false)
    setPending(false)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.blocked) setBlocked(true)
        if (data.pending) setPending(true)
        setError(data.error || "Login failed")
        return
      }

      if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/member/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred during login")
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
            <CardTitle className="text-2xl">V FITNESS Login</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* ✅ PASSWORD RESET SUCCESS MESSAGE */}
        {resetSuccess && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            Password reset successful! You can now login with your new password.
          </div>
        )}

        {/* 🟡 PENDING APPROVAL MESSAGE */}
        {(pendingApproval || pending) && (
          <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-700">
            Your account is pending admin approval. Please wait for approval before logging in.
          </div>
        )}

        {/* 🔴 BLOCKED MESSAGE */}
        {(blockedFromQuery || blocked) && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            Your account has been blocked by the admin. Please contact support.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label>Login As</Label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="member"
                  checked={userType === "member"}
                  onChange={(e) =>
                    setUserType(e.target.value as "member" | "admin")
                  }
                  className="mr-2"
                />
                Member
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="admin"
                  checked={userType === "admin"}
                  onChange={(e) =>
                    setUserType(e.target.value as "member" | "admin")
                  }
                  className="mr-2"
                />
                Admin
              </label>
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 space-y-2 text-center text-sm">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </div>
          <div>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
      </CardContent>

      <div className="text-center pt-4 border-t border-gray-200 mt-4">
        <p className="text-xs text-gray-500">
          Developed by{" "}
          <span className="font-semibold text-gray-700">Adarshmiriyal</span>
        </p>
      </div>
    </Card>
  )
}

/* =========================
   PAGE WRAPPER (REQUIRED)
========================= */
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
