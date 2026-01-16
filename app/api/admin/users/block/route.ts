import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(req: Request) {
  const session = await getSession()

  if (!session || session.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId, block } = await req.json()

  try {
    await sql`
      UPDATE users
      SET is_blocked = ${block}
      WHERE id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Block user error:", error)
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    )
  }
}
