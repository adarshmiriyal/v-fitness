import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const announcements = await sql`
      SELECT id, title, content, created_at, is_active 
      FROM announcements ORDER BY created_at DESC
    `

    return NextResponse.json(announcements)
  } catch (error) {
    console.error("Announcements fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the announcement and get its ID
    const announcementResult = await sql`
      INSERT INTO announcements (admin_id, title, content) 
      VALUES (${session.userId}, ${title}, ${content})
      RETURNING id
    `

    const announcementId = announcementResult[0]?.id

    if (!announcementId) {
      return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
    }

    // Get all active members to create notifications for them
    const members = await sql`
      SELECT id FROM users 
      WHERE user_type = 'member' AND is_active = true
    `

    // Create notifications for all active members
    if (members.length > 0) {
      // Use a transaction-like approach: insert notifications for each member
      for (const member of members) {
        await sql`
          INSERT INTO notifications (user_id, announcement_id, title, message)
          VALUES (${member.id}, ${announcementId}, ${title}, ${content})
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Announcement create error:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}
