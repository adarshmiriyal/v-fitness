import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

// GET: Fetch all offers (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const offers = await sql`
      SELECT 
        o.id, 
        o.title, 
        o.description, 
        o.discount_percentage,
        o.valid_from,
        o.valid_until,
        o.is_active,
        o.created_at,
        o.updated_at,
        u.first_name || ' ' || u.last_name as admin_name
      FROM offers o
      JOIN users u ON o.admin_id = u.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Offers fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}

// POST: Create a new offer (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, discount_percentage, valid_from, valid_until, is_active } = await request.json()

    if (!title || !description || !valid_from || !valid_until) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      INSERT INTO offers (admin_id, title, description, discount_percentage, valid_from, valid_until, is_active)
      VALUES (${session.userId}, ${title}, ${description}, ${discount_percentage || null}, ${valid_from}, ${valid_until}, ${is_active !== false})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Offer create error:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
