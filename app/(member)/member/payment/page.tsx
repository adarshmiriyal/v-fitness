"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, CreditCard, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function PaymentPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const ownerDetails = {
    name: "Vinay Karanji",
    phone: "7795104232",
    upi1: "vinaykaranji@ibl",
    upi2: "7795104232-2@ybl",
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/member-dashboard-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">Payment Details</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Owner payment information for gym fees</p>
        </div>
      </section>

      {/* Owner Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Owner Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Owner Name */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Owner Name</p>
              <p className="text-lg font-semibold text-gray-900">{ownerDetails.name}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${ownerDetails.phone}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {ownerDetails.phone}
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(ownerDetails.phone, "phone")}
                  className="h-8 w-8 p-0"
                >
                  {copied === "phone" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* UPI ID 1 */}
          <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">UPI ID 1</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-gray-900 flex-1">{ownerDetails.upi1}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(ownerDetails.upi1, "upi1")}
                className="h-8 w-8 p-0"
              >
                {copied === "upi1" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* UPI ID 2 */}
          <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-gray-700">UPI ID 2</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-gray-900 flex-1">{ownerDetails.upi2}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(ownerDetails.upi2, "upi2")}
                className="h-8 w-8 p-0"
              >
                {copied === "upi2" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Payment Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Use any of the UPI IDs above to make your payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>After payment, contact the owner at {ownerDetails.phone} or visit the gym</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Keep your payment receipt/screenshot for reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>The admin will update your payment record after verification</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Developer Credit */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Developed by <span className="font-semibold text-gray-700">Adarshmiriyal</span>
        </p>
      </div>
    </div>
  )
}
