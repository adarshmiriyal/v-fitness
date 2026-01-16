import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, age, phoneNumber } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Create user (is_approved will be false by default for members)
    const user = await createUser(email, password, firstName, lastName, age, phoneNumber, "member")

    // Don't create session - member needs admin approval first
    // await createSession(user.id, "member")

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      message: "Account created successfully. Please wait for admin approval before logging in.",
      pending: true
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
