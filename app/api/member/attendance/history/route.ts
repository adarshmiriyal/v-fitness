import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()

  if (!session || session.userType !== "member") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const records = await sql`
      SELECT id, date, check_in_time, check_out_time
      FROM attendance
      WHERE user_id = ${session.userId}
      ORDER BY date DESC, check_in_time DESC
    `

    return NextResponse.json(records)
  } catch (error) {
    console.error("Attendance history fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance history" },
      { status: 500 }
    )
  }
}
