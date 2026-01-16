import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Users, BarChart3, Bell, Phone } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">V FITNESS</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Join Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/hero-bg.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">Welcome to V FITNESS</h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
          Track your fitness journey with our modern gym management system. Real-time attendance tracking, QR code
          check-in, and personalized analytics.
        </p>
        <Link href="/signup">
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            Get Started Today
          </Button>
        </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Track your attendance patterns and gym streaks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Member Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Admin tools to manage all gym members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time gym announcements and notifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/cta-bg.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">Ready to transform your fitness?</h2>
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Owner Section */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-3">Owner</h3>
              <div className="flex justify-center mb-3">
                <Image
                  src="/owner-photo.jpg"
                  alt="Owner"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">VINAY KARANJI</p>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href="tel:7795104232" className="hover:text-blue-600">7795104232</a>
                </div>
              </div>
            </div>

            {/* Photo Section - Logo/Branding */}
            <div className="text-center flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-12 w-12 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">V FITNESS</span>
              </div>
            </div>

            {/* Developer Section */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-3">Developer</h3>
              <div className="flex justify-center mb-3">
                <Image
                  src="/developer-photo.jpg"
                  alt="Developer"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">ADARSHMIRIYAL</p>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href="tel:8722630933" className="hover:text-blue-600">8722630933</a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-600 border-t border-gray-200 pt-6">
            <p>V FITNESS &copy; 2026. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
