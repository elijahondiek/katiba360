"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authState } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for error query parameter
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth_failed") {
      setErrorMessage("Authentication failed. Please try again.");
    } else if (error === "server_error") {
      setErrorMessage("A server error occurred. Please try again later.");
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      router.push("/");
    }
  }, [authState.isAuthenticated, router]);

  // Loading state for login button
  const [isConnecting, setIsConnecting] = useState(false);

  // Handle Google login
  const handleGoogleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isConnecting) return;
    setIsConnecting(true);
    // Construct the Google OAuth URL
    const googleAuthUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      : "http://localhost:8000/api/v1/auth/google";
    // Redirect to the Google OAuth URL
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F3F4F6] dark:bg-[#1A1A1A]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-[#1A1A1A] border dark:border-[#374151]">
        <div className="text-center">
          <h1 className="text-3xl font-['Montserrat',sans-serif] font-bold text-[#1EB53A] mb-2">
            Welcome to Katiba360
          </h1>
          <p className="mt-2 text-[#4B5563] dark:text-[#D1D5DB] font-['Open_Sans',sans-serif]">
            Sign in to access your account
          </p>
        </div>

        {errorMessage && (
          <div
            className="flex items-center gap-3 bg-[#CE1126]/10 border border-[#CE1126]/20 text-[#CE1126] px-4 py-3 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={20} className="flex-shrink-0" />
            <span className="block font-['Open_Sans',sans-serif]">
              {errorMessage}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-6 py-3 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-[#1EB53A] focus:ring-offset-2 
                     transition-all duration-200 bg-[#1EB53A] hover:bg-[#0A7B24] 
                     text-white font-['Montserrat',sans-serif] font-semibold text-base
                     disabled:opacity-70 disabled:cursor-not-allowed
                     min-h-[44px]"
            aria-label="Sign in with Google"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
              <div className="bg-white p-[2px] rounded-full flex-shrink-0 h-5 w-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              Sign in with Google
            </div>
            )}
          </button>
          <div className="text-center text-sm text-[#6B7280] dark:text-[#D1D5DB] font-['Open_Sans',sans-serif]">
            <p>
              By signing in, you agree to our{" "}
              <a
                href="/terms"
                className="text-[#1EB53A] hover:text-[#0A7B24] underline 
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1EB53A]
                         transition-colors duration-200"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-[#1EB53A] hover:text-[#0A7B24] underline 
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1EB53A]
                         transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
