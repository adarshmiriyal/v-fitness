// Example middleware for protecting routes
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "./session"

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: any) => Promise<NextResponse>,
) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return handler(request, session)
}

export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: any) => Promise<NextResponse>,
) {
  const session = await getSession()

  if (!session || session.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
  }

  return handler(request, session)
}
