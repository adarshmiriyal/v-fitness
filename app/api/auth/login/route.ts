import { type NextRequest, NextResponse } from "next/server"
import { verifyUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      )
    }

    // ✅ Verify email + password
    const user = await verifyUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // 🚫 INACTIVE MEMBER CHECK
    if (user.user_type === "member" && user.is_active === false) {
      return NextResponse.json(
        { error: "Your account has been blocked by admin", blocked: true },
        { status: 403 }
      )
    }

    // 🚫 UNAPPROVED MEMBER CHECK
    if (user.user_type === "member" && user.is_approved === false) {
      return NextResponse.json(
        { error: "Your account is pending admin approval. Please wait for approval.", pending: true },
        { status: 403 }
      )
    }

    // ✅ Create session ONLY if allowed
    await createSession(user.id, user.user_type)

    return NextResponse.json({
      success: true,
      role: user.user_type,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
