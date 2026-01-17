import { NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { createJWT } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      age,
      phone_number,
    } = await request.json()

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 🚫 Duplicate email check
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    // ✅ Call createUser with EXACT arguments
    const user = await createUser(
      email,
      password,
      first_name,
      last_name,
      age,
      phone_number
    )

    // ✅ Create JWT
    const token = await createJWT(user.id, user.user_type)

    // ✅ Set cookie via NextResponse
    const response = NextResponse.json({
      success: true,
      role: user.user_type,
    })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    )
  }
}
