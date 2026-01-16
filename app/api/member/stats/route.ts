import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const todayAttendance = await sql`
      SELECT COUNT(*) as count FROM attendance 
      WHERE user_id = ${session.userId} AND date = CURRENT_DATE
    `

    // Count week attendance
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekStartStr = weekStart.toISOString().split("T")[0]

    const weekAttendance = await sql`
      SELECT COUNT(DISTINCT date) as count FROM attendance 
      WHERE user_id = ${session.userId} AND date >= ${weekStartStr}
    `

    // Count month attendance
    const monthStart = new Date()
    monthStart.setDate(1)
    const monthStartStr = monthStart.toISOString().split("T")[0]

    const monthAttendance = await sql`
      SELECT COUNT(DISTINCT date) as count FROM attendance 
      WHERE user_id = ${session.userId} AND date >= ${monthStartStr}
    `

    // Count unread notifications
    const unreadNotifications = await sql`
      SELECT COUNT(*) as count FROM notifications 
      WHERE user_id = ${session.userId} AND is_read = false
    `

    return NextResponse.json({
      todayAttended: Number(todayAttendance[0]?.count || 0) > 0,
      weekAttendance: Number(weekAttendance[0]?.count || 0),
      monthAttendance: Number(monthAttendance[0]?.count || 0),
      unreadNotifications: Number(unreadNotifications[0]?.count || 0),
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
