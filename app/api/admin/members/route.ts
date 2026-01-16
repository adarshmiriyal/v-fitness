import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const members = await sql`
      SELECT id, first_name, last_name, email, age, phone_number, is_active, is_approved, created_at 
      FROM users WHERE user_type = 'member' 
      ORDER BY is_approved ASC, created_at DESC
    `

    return NextResponse.json(members)
  } catch (error) {
    console.error("Members fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
