import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

// PUT: Update a member record (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recordId } = await params
    const recordIdNum = parseInt(recordId)
    
    if (isNaN(recordIdNum)) {
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 })
    }

    const { title, description, amount, record_type } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Verify record exists and belongs to a member
    const existingRecord = await sql`
      SELECT mr.id, mr.user_id 
      FROM member_records mr
      JOIN users u ON u.id = mr.user_id
      WHERE mr.id = ${recordIdNum} AND u.user_type = 'member'
    `
    
    if (existingRecord.length === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    const result = await sql`
      UPDATE member_records
      SET 
        title = ${title},
        description = ${description},
        amount = ${amount || null},
        record_type = ${record_type || 'note'}
      WHERE id = ${recordIdNum}
      RETURNING id, title, description, amount, record_type, created_at
    `

    return NextResponse.json({ success: true, record: result[0] })
  } catch (error: any) {
    console.error("Error updating member record:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update member record" },
      { status: 500 }
    )
  }
}

// DELETE: Delete a member record (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const session = await getSession()
    
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recordId } = await params
    const recordIdNum = parseInt(recordId)
    
    if (isNaN(recordIdNum)) {
      return NextResponse.json({ error: "Invalid record ID" }, { status: 400 })
    }

    // Verify record exists and belongs to a member
    const existingRecord = await sql`
      SELECT mr.id 
      FROM member_records mr
      JOIN users u ON u.id = mr.user_id
      WHERE mr.id = ${recordIdNum} AND u.user_type = 'member'
    `
    
    if (existingRecord.length === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    await sql`
      DELETE FROM member_records
      WHERE id = ${recordIdNum}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting member record:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete member record" },
      { status: 500 }
    )
  }
}
