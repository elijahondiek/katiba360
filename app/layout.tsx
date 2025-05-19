import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { OfflineProvider } from "@/contexts/offline-context"
import { LearningProvider } from "@/contexts/learning-context"
import { AuthProvider } from "@/contexts/AuthContext"
import { AccessibilityButton } from "@/components/accessibility-button"
import { OfflineIndicator } from "@/components/offline-indicator"
import Footer from "@/components/Footer"
import Header from "@/components/layouts/Header"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Katiba360",
  description: "Kenya's Constitution at your fingertips",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <AccessibilityProvider>
          <LanguageProvider>
            <OfflineProvider>
              <LearningProvider>
                <AuthProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow flex flex-col">
                      {children}
                    </main>
                    <AccessibilityButton />
                    <OfflineIndicator />
                    <Footer />
                    <Toaster />
                    <Analytics />
                  </div>
                </AuthProvider>
              </LearningProvider>
            </OfflineProvider>
          </LanguageProvider>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
