import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-this"
)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value
  const isProtected = req.nextUrl.pathname.startsWith("/admin")

  if (!isProtected) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"]
}
