import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

// GET: Fetch all active personal training programs (members can view)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "member") {
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
        pt.created_at
      FROM personal_training pt
      WHERE pt.is_active = true
      ORDER BY pt.created_at DESC
    `

    return NextResponse.json(programs)
  } catch (error) {
    console.error("Personal training fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch personal training programs" }, { status: 500 })
  }
}
