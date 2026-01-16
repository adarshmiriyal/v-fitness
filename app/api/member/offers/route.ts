import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

// GET: Fetch all active offers (members can view)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "member") {
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
        o.created_at
      FROM offers o
      WHERE o.is_active = true
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Offers fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}
