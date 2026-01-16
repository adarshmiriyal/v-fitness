import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

// POST: Approve or reject a member (admin only)
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = context.params
    const memberId = Number(id)

    if (Number.isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    const { approve } = await request.json()

    if (typeof approve !== "boolean") {
      return NextResponse.json(
        { error: "Approve status is required (true/false)" },
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

    if (user[0].user_type !== "member") {
      return NextResponse.json(
        { error: "Cannot approve/reject non-member users" },
        { status: 400 }
      )
    }

    // Update approval status
    await sql`
      UPDATE users
      SET is_approved = ${approve}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${memberId}
    `

    return NextResponse.json({
      success: true,
      message: approve
        ? "Member approved successfully"
        : "Member rejected successfully",
    })
  } catch (error: any) {
    console.error("Error updating member approval:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update member approval" },
      { status: 500 }
    )
  }
}
