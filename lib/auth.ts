import bcrypt from "bcryptjs"

import sql from "./db"

const SALT_ROUNDS = 10

/* =========================
   Password helpers
========================= */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/* =========================
   User helpers
========================= */

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, email, password, user_type, is_active, is_approved
      FROM users
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

/* =========================
   Create user
========================= */

export async function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  age: number,
  phoneNumber: string,
  userType: "member" | "admin" = "member"
) {
  try {
    const hashedPassword = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        age,
        phone_number,
        user_type,
        is_approved
      )
      VALUES (
        ${email},
        ${hashedPassword},
        ${firstName},
        ${lastName},
        ${age},
        ${phoneNumber},
        ${userType},
        ${userType === "admin" ? true : false}
      )
      RETURNING id, email, user_type, is_approved
    `

    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

/* =========================
   Verify user (LOGIN)
========================= */

export async function verifyUser(email: string, password: string) {
  try {
    const user = await getUserByEmail(email)

    if (!user) {
      console.log("❌ User not found")
      return null
    }

    const isPasswordValid = await comparePassword(password, user.password)

    console.log("🔐 Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return null
    }

    // ✅ Return only safe fields
    return {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      is_active: user.is_active,
      is_approved: user.is_approved,
    }
  } catch (error) {
    console.error("Error verifying user:", error)
    return null
  }
}
