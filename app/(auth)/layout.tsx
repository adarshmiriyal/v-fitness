import type React from "react"
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed" 
      style={{ backgroundImage: 'url(/login-bg.jpg)' }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
      {children}
      </div>
    </div>
  )
}
