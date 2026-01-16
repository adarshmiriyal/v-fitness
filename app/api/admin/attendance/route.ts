import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()

  if (!session || session.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const rows = await sql`
      SELECT
        a.id,
        CONCAT(u.first_name, ' ', u.last_name) AS member_name,
        u.age,
        a.date,
        a.check_in_time
      FROM attendance a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.date DESC, a.check_in_time DESC
    `

    return NextResponse.json(rows)
  } catch (error: any) {
    console.error("Admin attendance fetch error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to load attendance records" },
      { status: 500 }
    )
  }
}
