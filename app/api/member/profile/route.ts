import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await sql`
      SELECT id, email, first_name, last_name, age, phone_number 
      FROM users WHERE id = ${session.userId}
    `

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { first_name, last_name, age, phone_number } = await request.json()

    // Validation
    if (!first_name || !first_name.trim()) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 })
    }
    if (!last_name || !last_name.trim()) {
      return NextResponse.json({ error: "Last name is required" }, { status: 400 })
    }
    if (age !== undefined && age !== null) {
      if (typeof age !== "number" || age < 1 || age > 150) {
        return NextResponse.json({ error: "Age must be between 1 and 150" }, { status: 400 })
      }
    }

    await sql`
      UPDATE users 
      SET first_name = ${first_name.trim()}, 
          last_name = ${last_name.trim()}, 
          age = ${age || null}, 
          phone_number = ${phone_number?.trim() || null}, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${session.userId}
    `

    const updatedUser = await sql`
      SELECT id, email, first_name, last_name, age, phone_number 
      FROM users WHERE id = ${session.userId}
    `

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
