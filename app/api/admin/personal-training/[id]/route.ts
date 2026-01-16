import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

// PUT: Update a personal training program (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = context.params
    const programId = Number(id)

    if (Number.isNaN(programId)) {
      return NextResponse.json({ error: "Invalid program ID" }, { status: 400 })
    }

    const {
      title,
      description,
      trainer_name,
      duration_weeks,
      price,
      is_active,
    } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if program exists
    const existing = await sql`
      SELECT id FROM personal_training WHERE id = ${programId}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    await sql`
      UPDATE personal_training
      SET
        title = ${title},
        description = ${description},
        trainer_name = ${trainer_name ?? null},
        duration_weeks = ${duration_weeks ?? null},
        price = ${price ?? null},
        is_active = ${is_active !== false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${programId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Personal training update error:", error)
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to update personal training program",
      },
      { status: 500 }
    )
  }
}

// DELETE: Delete a personal training program (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = context.params
    const programId = Number(id)

    if (Number.isNaN(programId)) {
      return NextResponse.json({ error: "Invalid program ID" }, { status: 400 })
    }

    // Check if program exists
    const existing = await sql`
      SELECT id FROM personal_training WHERE id = ${programId}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    await sql`
      DELETE FROM personal_training WHERE id = ${programId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Personal training delete error:", error)
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to delete personal training program",
      },
      { status: 500 }
    )
  }
}
