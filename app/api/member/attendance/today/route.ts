import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()

  if (!session || session.userType !== "member") {
    return NextResponse.json({ marked: false })
  }

  // Check for today's attendance using the same date basis as insertion (CURRENT_DATE)
  const rows = await sql`
    SELECT id FROM attendance
    WHERE user_id = ${session.userId}
      AND date = CURRENT_DATE
    LIMIT 1
  `

  return NextResponse.json({ marked: rows.length > 0 })
}
