import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

// GET: Fetch all records for the logged-in member
export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const records = await sql`
      SELECT 
        mr.id,
        mr.title,
        mr.description,
        mr.amount,
        mr.record_type,
        mr.created_at,
        CONCAT(u.first_name, ' ', u.last_name) AS admin_name
      FROM member_records mr
      JOIN users u ON u.id = mr.admin_id
      WHERE mr.user_id = ${session.userId}
      ORDER BY mr.created_at DESC
    `

    return NextResponse.json(records)
  } catch (error: any) {
    console.error("Error fetching member records:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch records" },
      { status: 500 }
    )
  }
}
