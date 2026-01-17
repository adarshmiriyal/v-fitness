import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function PATCH(req: Request) {
  // ✅ Get session safely
  const session = await getSession()

  // 🔒 Admin only access
  if (!session || session.userType !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // ✅ Parse body
  const body = await req.json()
  const { userId, isApproved } = body as {
    userId: number
    isApproved: boolean
  }

  // 🛑 Validate input
  if (
    typeof userId !== "number" ||
    typeof isApproved !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }

  // ✅ Update approval status
  await sql`
    UPDATE users
    SET is_approved = ${isApproved}
    WHERE id = ${userId}
  `

  return NextResponse.json({ success: true })
}
