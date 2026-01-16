import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import sql from "@/lib/db"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-this"
)

/* ======================
   CREATE SESSION
====================== */
export async function createSession(userId: number, userType: string) {
  const token = await new SignJWT({ userId, userType })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)

  const cookieStore = await cookies()

  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

/* ======================
   GET SESSION (READ ONLY)
====================== */
export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    const { userId, userType } = payload as {
      userId: number
      userType: string
    }

    // 🔒 Check that member is still active and approved
    if (userType === "member") {
      const rows = await sql`
        SELECT is_active, is_approved
        FROM users
        WHERE id = ${userId}
        LIMIT 1
      `

      // If user record is missing, marked inactive, or not approved, treat as no session
      if (rows.length === 0 || rows[0].is_active === false || rows[0].is_approved === false) {
        return null
      }
    }

    return { userId, userType }
  } catch {
    // ❌ DO NOT DELETE COOKIES HERE
    return null
  }
}

/* ======================
   DELETE SESSION (ONLY WHEN CALLED)
====================== */
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
