import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { OfflineProvider } from "@/contexts/offline-context"
import { LearningProvider } from "@/contexts/learning-context"
import { AuthProvider } from "@/contexts/AuthContext"
// import { AccessibilityButton } from "@/components/accessibility-button"
import { OfflineIndicator } from "@/components/offline-indicator"
import Footer from "@/components/Footer"
import Header from "@/components/layouts/Header"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Katiba360",
  description: "Kenya's Constitution at your fingertips",
  generator: 'WebShrewd',
  openGraph: {
    title: "Katiba360",
    description: "Kenya's Constitution at your fingertips",
    url: "https://katiba360.com/",
    siteName: "Katiba360",
    images: [
      {
        url: "/Katiba360-seo-image.png",
        width: 1200,
        height: 630,
        alt: "Rural Kenyan landscape with people reading the constitution"
      }
    ],
    locale: "en_KE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Katiba360",
    description: "Kenya's Constitution at your fingertips",
    images: ["/Katiba360-seo-image.png"],
    creator: "@WebShrewd"
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
            `,
          }}
        />
      </head>
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
                    {/* <AccessibilityButton /> */}
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
