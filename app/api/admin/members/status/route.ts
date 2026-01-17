import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function PATCH(req: Request) {
  const session = await getSession()

  // 🔒 Admin only
  if (!session || session.userType !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { userId, isApproved } = await req.json()

  if (!userId || typeof isApproved !== "boolean") {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }

  await sql`
    UPDATE users
    SET is_approved = ${isApproved}
    WHERE id = ${userId}
  `

  return NextResponse.json({ success: true })
}
