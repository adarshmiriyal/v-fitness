import sql from "../lib/db"
import { hashPassword } from "../lib/auth"

async function seedAdmin() {
  try {
    const adminEmail = "admin@gym.com"
    const adminPassword = "Gym@123"

    // Check if admin exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${adminEmail}
    `

    if (existing.length > 0) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword)
    await sql`
      INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        user_type,
        age,
        phone_number
      )
      VALUES (
        ${adminEmail},
        ${hashedPassword},
        'Admin',
        'User',
        'admin',
        30,
        '+1234567890'
      )
      RETURNING id
    `

    console.log("Admin user created successfully")
    console.log("Email:", adminEmail)
    console.log("Password:", adminPassword)
    console.log("Please change the password after first login")
  } catch (error) {
    console.error("Error seeding admin:", error)
  }
}

seedAdmin()
