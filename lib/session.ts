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
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  const cookieStore = cookies()

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // ✅ correct
    maxAge: 60 * 60 * 24 * 7,
  })
}

/* ======================
   GET SESSION (SERVER ONLY)
====================== */
export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)

    const { userId, userType } = payload as {
      userId: number
      userType: string
    }

    // 🔒 Validate MEMBER status only
    if (userType === "member") {
      const rows = await sql`
        SELECT is_active, is_approved
        FROM users
        WHERE id = ${userId}
        LIMIT 1
      `

      if (
        rows.length === 0 ||
        rows[0].is_active !== true ||
        rows[0].is_approved !== true
      ) {
        return null
      }
    }

    return { userId, userType }
  } catch {
    return null
  }
}

/* ======================
   DELETE SESSION
====================== */
export async function deleteSession() {
  const cookieStore = cookies()
  cookieStore.delete("session") // ✅ ONLY ONE ARG
}
