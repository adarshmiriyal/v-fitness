import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-this"
)

/* ======================
   CREATE JWT (NO COOKIES)
====================== */
export async function createJWT(userId: number, userType: string) {
  return await new SignJWT({ userId, userType })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

/* ======================
   READ SESSION (SAFE)
====================== */
export async function getSession() {
  // ✅ MUST await in Next.js 16
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)

    return payload as {
      userId: number
      userType: string
    }
  } catch {
    return null
  }
}
