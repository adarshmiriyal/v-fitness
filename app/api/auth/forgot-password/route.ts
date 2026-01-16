import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/auth"
import sql from "@/lib/db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await getUserByEmail(email)

    // For security, don't reveal if email exists or not
    // Always return success message
    if (!user) {
      // Still return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      })
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Invalidate any existing tokens for this user
    try {
      await sql`
        UPDATE password_reset_tokens
        SET used = true
        WHERE user_id = ${user.id} AND used = false
      `
    } catch (updateError: any) {
      // If table doesn't exist, this will fail - but we'll catch it below
      if (updateError?.code !== "42P01") {
        throw updateError
      }
    }

    // Create new reset token (convert date to ISO string for PostgreSQL)
    await sql`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
    `

    // TODO: In production, send email with reset link
    // For now, return token in development mode
    // Example email sending code:
    // await sendEmail({
    //   to: email,
    //   subject: "Reset Your Password",
    //   html: `Click here to reset your password: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
    // })

    return NextResponse.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
      // Only return token in development
      ...(process.env.NODE_ENV === "development" && { token }),
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    console.error("Error details:", {
      code: error?.code,
      message: error?.message,
      detail: error?.detail,
    })
    
    // Provide more specific error messages
    if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
      // Table doesn't exist
      return NextResponse.json(
        { 
          error: "Password reset feature is not set up. Please run the SQL migration script (scripts/01_create_tables.sql) to create the password_reset_tokens table." 
        },
        { status: 500 }
      )
    }
    
    // Check for other common PostgreSQL errors
    if (error?.code === "23505") {
      // Unique constraint violation (token already exists - very unlikely)
      return NextResponse.json(
        { error: "A reset token already exists. Please try again in a few minutes." },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error?.message || "Failed to process request. Please check the console for details and try again later." 
      },
      { status: 500 }
    )
  }
}
