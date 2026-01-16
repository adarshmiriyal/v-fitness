import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

// DELETE: Delete a member (admin only)
export async function DELETE(
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

    // Prevent admin deleting themselves
    if (session.userId === memberId) {
      return NextResponse.json(
        { error: "You cannot delete yourself" },
        { status: 400 }
      )
    }

    // Check if user exists and is a member
    const user = await sql`
      SELECT id, user_type FROM users WHERE id = ${memberId}
    `
    
    if (user.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Prevent deleting admins
    if (user[0].user_type === "admin") {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 400 }
      )
    }

    // Delete the member (CASCADE will handle related records)
    await sql`
      DELETE FROM users WHERE id = ${memberId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting member:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete member" },
      { status: 500 }
    )
  }
}
