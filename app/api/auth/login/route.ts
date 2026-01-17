import { NextRequest, NextResponse } from "next/server"
import { verifyUser } from "@/lib/auth"
import { createJWT } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      )
    }

    // ✅ Verify user
    const user = await verifyUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // 🚫 Blocked member
    if (user.user_type === "member" && user.is_active === false) {
      return NextResponse.json(
        { error: "Account blocked", blocked: true },
        { status: 403 }
      )
    }

    // 🚫 Not approved member
    if (user.user_type === "member" && user.is_approved === false) {
      return NextResponse.json(
        { error: "Pending admin approval", pending: true },
        { status: 403 }
      )
    }

    // ✅ Create JWT (NO cookies here)
    const token = await createJWT(user.id, user.user_type)

    // ✅ Create response and set cookie HERE
    const response = NextResponse.json({
      success: true,
      role: user.user_type,
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
