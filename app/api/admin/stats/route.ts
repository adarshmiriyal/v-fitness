import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const totalMembers = await sql`
      SELECT COUNT(*) as count FROM users WHERE user_type = 'member'
    `

    const todayAttendance = await sql`
      SELECT COUNT(DISTINCT user_id) as count FROM attendance WHERE date = CURRENT_DATE
    `

    const totalAnnouncements = await sql`
      SELECT COUNT(*) as count FROM announcements WHERE is_active = true
    `

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const activeMembers = await sql`
      SELECT COUNT(DISTINCT user_id) as count FROM attendance 
      WHERE date >= ${sevenDaysAgo.toISOString().split("T")[0]}
    `

    return NextResponse.json({
      totalMembers: Number(totalMembers[0]?.count || 0),
      todayAttendance: Number(todayAttendance[0]?.count || 0),
      totalAnnouncements: Number(totalAnnouncements[0]?.count || 0),
      activeMembers: Number(activeMembers[0]?.count || 0),
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
