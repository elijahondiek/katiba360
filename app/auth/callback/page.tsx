"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  // Use a ref to track if authentication has been attempted
  const authAttempted = useRef(false)

  useEffect(() => {
    const processAuth = async () => {
      // Only process once
      if (authAttempted.current) {
        return
      }

      // Get auth data from URL query parameters
      const code = searchParams.get("code")
      const state = searchParams.get("state")

      if (!code) {
        setError("No authorization code found")
        setIsProcessing(false)
        return
      }

      try {
        // Mark that we've attempted authentication
        authAttempted.current = true

        // Construct the redirect URI that matches what was sent to Google
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
          `${window.location.origin}/auth/callback`


        // Complete the authentication process
        await login(code, redirectUri, state ?? undefined)

        // The login function will handle the redirect
      } catch (error) {
        console.error("Error processing authentication:", error)
        const errorMessage = error instanceof Error ? error.message : "Authentication failed. Please try again."
        setError(errorMessage)
        setIsProcessing(false)
      }
    }

    processAuth()
  }, [login, searchParams]) // Remove router from dependencies

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F3F4F6] dark:bg-[#1A1A1A]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-[#1A1A1A] border dark:border-[#374151]">
        <div className="text-center">
          <h1 className="text-2xl font-['Montserrat',sans-serif] font-bold text-[#1EB53A] mb-6">
            {isProcessing ? "Completing Authentication" : "Authentication Status"}
          </h1>

          <div className="mt-6 flex flex-col items-center justify-center">
            {/* Extracted ternary logic for clarity */}
            {(() => {
              let content;
              if (isProcessing) {
                content = (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative h-16 w-16">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner className="h-16 w-16 text-[#1EB53A]" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        <Loader className="h-8 w-8 text-[#1EB53A] animate-pulse" />
                      </div>
                    </div>
                    <p className="mt-4 text-[#4B5563] dark:text-[#D1D5DB] font-['Open_Sans',sans-serif]">
                      Please wait while we complete your authentication...
                    </p>
                  </div>
                );
              } else if (error) {
                content = (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-[#CE1126]/10 p-3 mb-2">
                      <AlertCircle size={36} className="text-[#CE1126]" aria-hidden="true" />
                      <span className="sr-only">Authentication failed</span>
                    </div>
                    <p className="text-[#CE1126] font-['Open_Sans',sans-serif] font-medium">{error}</p>
                    <Button
                      onClick={() => router.push("/login")}
                      className="mt-6 px-6 py-3 bg-[#CE1126] text-white rounded-md hover:bg-[#A50E1F] focus:outline-none focus:ring-2 focus:ring-[#CE1126]/50 focus:ring-offset-2 transition-all duration-200 font-['Montserrat',sans-serif] font-semibold min-h-[44px] min-w-[120px]"
                      aria-label="Try authentication again"
                    >
                      Try Again
                    </Button>
                  </div>
                );
              } else {
                content = (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-[#1EB53A]/10 p-3 mb-2">
                      <CheckCircle size={36} className="text-[#1EB53A]" aria-hidden="true" />
                      <span className="sr-only">Authentication successful</span>
                    </div>
                    <p className="text-[#1EB53A] font-['Open_Sans',sans-serif] font-semibold">Authentication successful!</p>
                    <p className="text-[#4B5563] dark:text-[#D1D5DB] font-['Open_Sans',sans-serif]">
                      Redirecting you to the home page...
                    </p>
                    <div className="mt-4 h-1 w-48 bg-[#E5E7EB] dark:bg-[#374151] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1EB53A] animate-pulse-slow rounded-full"
                        style={{ width: "100%", animationDuration: "1.5s" }}
                      ></div>
                    </div>
                  </div>
                );
              }
              return content;
            })()}

          </div>
        </div>
      </div>
    </div>
  )
}
