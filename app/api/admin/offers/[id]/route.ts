import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

// PUT: Update an offer (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const offerId = parseInt(id)

    if (isNaN(offerId)) {
      return NextResponse.json({ error: "Invalid offer ID" }, { status: 400 })
    }

    const { title, description, discount_percentage, valid_from, valid_until, is_active } = await request.json()

    if (!title || !description || !valid_from || !valid_until) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if offer exists
    const existing = await sql`
      SELECT id FROM offers WHERE id = ${offerId}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    await sql`
      UPDATE offers
      SET 
        title = ${title},
        description = ${description},
        discount_percentage = ${discount_percentage || null},
        valid_from = ${valid_from},
        valid_until = ${valid_until},
        is_active = ${is_active !== false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${offerId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Offer update error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update offer" },
      { status: 500 }
    )
  }
}

// DELETE: Delete an offer (admin only)
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
    const offerId = parseInt(id)

    if (isNaN(offerId)) {
      return NextResponse.json({ error: "Invalid offer ID" }, { status: 400 })
    }

    // Check if offer exists
    const existing = await sql`
      SELECT id FROM offers WHERE id = ${offerId}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    await sql`
      DELETE FROM offers WHERE id = ${offerId}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Offer delete error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete offer" },
      { status: 500 }
    )
  }
}
