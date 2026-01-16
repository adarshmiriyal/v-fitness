import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

// GET: Fetch all personal training programs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const programs = await sql`
      SELECT 
        pt.id, 
        pt.title, 
        pt.description, 
        pt.trainer_name,
        pt.duration_weeks,
        pt.price,
        pt.is_active,
        pt.created_at,
        pt.updated_at,
        u.first_name || ' ' || u.last_name as admin_name
      FROM personal_training pt
      JOIN users u ON pt.admin_id = u.id
      ORDER BY pt.created_at DESC
    `

    return NextResponse.json(programs)
  } catch (error) {
    console.error("Personal training fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch personal training programs" }, { status: 500 })
  }
}

// POST: Create a new personal training program (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, trainer_name, duration_weeks, price, is_active } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      INSERT INTO personal_training (admin_id, title, description, trainer_name, duration_weeks, price, is_active)
      VALUES (${session.userId}, ${title}, ${description}, ${trainer_name || null}, ${duration_weeks || null}, ${price || null}, ${is_active !== false})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Personal training create error:", error)
    return NextResponse.json({ error: "Failed to create personal training program" }, { status: 500 })
  }
}
