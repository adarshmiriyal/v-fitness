export async function PATCH(req: Request) {
    const session = await getSession()
    if (!session || session.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const { userId, isActive } = await req.json()
  
    await sql`
      UPDATE users
      SET is_active = ${isActive}
      WHERE id = ${userId}
    `
  
    return NextResponse.json({ success: true })
  }
  