import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import sql from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Find valid reset token
    const resetToken = await sql`
      SELECT prt.*, u.id as user_id
      FROM password_reset_tokens prt
      JOIN users u ON u.id = prt.user_id
      WHERE prt.token = ${token}
        AND prt.used = false
        AND prt.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `

    if (resetToken.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    const tokenRecord = resetToken[0]

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    await sql`
      UPDATE users
      SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${tokenRecord.user_id}
    `

    // Mark token as used
    await sql`
      UPDATE password_reset_tokens
      SET used = true
      WHERE id = ${tokenRecord.id}
    `

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
