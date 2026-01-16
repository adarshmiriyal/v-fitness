import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // ❗ Prevent admin blocking themselves
    if (session.userId === userId) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 },
      )
    }

    // Check if user exists
    const user = await sql`
      SELECT id, user_type FROM users WHERE id = ${userId}
    `

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent blocking admins
    if (user[0].user_type === "admin") {
      return NextResponse.json(
        { error: "Cannot block admin users" },
        { status: 400 }
      )
    }

    await sql`
      UPDATE users
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Toggle member status error:", error)
    return NextResponse.json(
      { error: "Failed to update member status" },
      { status: 500 }
    )
  }
}
