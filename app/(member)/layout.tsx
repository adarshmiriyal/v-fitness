import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import MemberNavbar from "@/components/member-navbar"

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // 🚫 No session or wrong role → redirect to login
  if (!session || session.userType !== "member") {
    redirect("/login?pending=approval")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavbar userId={session.userId} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
