import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const markRead = searchParams.get("markRead") === "true"

    const announcements = await sql`
      SELECT id, title, content, created_at 
      FROM announcements WHERE is_active = true 
      ORDER BY created_at DESC
    `

    // Only mark notifications as read when explicitly viewing the announcements page
    // Dashboard preview should not mark notifications as read
    if (markRead) {
      await sql`
        UPDATE notifications 
        SET is_read = true 
        WHERE user_id = ${session.userId} 
        AND is_read = false
      `
    }

    return NextResponse.json(announcements)
  } catch (error) {
    console.error("Announcements fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}
