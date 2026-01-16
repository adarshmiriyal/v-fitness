import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST() {
  const session = await getSession()
  if (!session || session.userType !== "member") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Store timestamp using PostgreSQL CURRENT_TIMESTAMP (UTC on server)
    // and derive the Date column from CURRENT_DATE.
    // We will convert to IST only when displaying to the user.
    const result = await sql`
      INSERT INTO attendance (user_id, date, check_in_time)
      VALUES (
        ${session.userId},
        CURRENT_DATE,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, date) DO NOTHING
      RETURNING id
    `

    // 🛑 Already marked today
    if (result.length === 0) {
      return NextResponse.json({ alreadyMarked: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Attendance error:", error)
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    )
  }
}
