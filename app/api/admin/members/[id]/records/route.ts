import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

// GET: Fetch all records for a specific member (admin only)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const memberId = parseInt(id)
    if (isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
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
      WHERE mr.user_id = ${memberId}
      ORDER BY mr.created_at DESC
    `

    return NextResponse.json(records)
  } catch (error: any) {
    console.error("Error fetching member records:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch member records" },
      { status: 500 }
    )
  }
}

// POST: Create a new record for a member (admin only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const memberId = parseInt(id)
    if (isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    const { title, description, amount, record_type } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Verify member exists
    const member = await sql`
      SELECT id FROM users WHERE id = ${memberId} AND user_type = 'member'
    `
    
    if (member.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const result = await sql`
      INSERT INTO member_records (user_id, admin_id, title, description, amount, record_type)
      VALUES (${memberId}, ${session.userId}, ${title}, ${description}, ${amount || null}, ${record_type || 'note'})
      RETURNING id, title, description, amount, record_type, created_at
    `

    return NextResponse.json({ success: true, record: result[0] })
  } catch (error: any) {
    console.error("Error creating member record:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create member record" },
      { status: 500 }
    )
  }
}
