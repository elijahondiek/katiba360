"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import {
  AlertCircle,
  Shield,
  Twitter,
  Github,
  ExternalLink,
} from "lucide-react";

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
      && `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`
    // Redirect to the Google OAuth URL
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Visual Element with improved readability */}
      <div className="md:w-1/2 bg-[#0A7B24] overflow-hidden">
        <div className="h-full flex flex-col justify-center px-8 py-12 md:py-0 text-white">
          <div className="max-w-md mx-auto md:mx-0 md:ml-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-sm">
              Katiba<span className="text-white">360</span>
            </h1>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white drop-shadow-sm">
                Constitutional Knowledge for All Kenyans
              </h2>
              <p className="text-white text-lg drop-shadow-sm">
                Making Kenya's constitution accessible, understandable, and
                actionable for every citizen.
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-sm">
                From the Constitution of Kenya
              </h3>
              <blockquote className="italic text-white mb-4 drop-shadow-sm">
                "Every person has the right to privacy, which includes the right
                not to have information relating to their family or private
                affairs unnecessarily required or revealed."
              </blockquote>
              <p className="text-right text-white/90 text-sm drop-shadow-sm">
                — Article 31, Constitution of Kenya
              </p>
            </div>

            <div className="mt-12 flex space-x-4">
              <a
                href="https://github.com/elijahondiek/katiba360"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors duration-300 flex items-center bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub</span>
              </a>
              <a
                href="https://x.com/WebShrewd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors duration-300 flex items-center bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <Twitter className="h-5 w-5 mr-2" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 bg-white flex flex-col">
        <div className="flex-grow flex flex-col justify-center px-8 py-12 md:py-0">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-12">
              <Link
                href="/"
                className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24] transition-colors duration-300 mb-8"
              >
                <span className="border-b border-transparent hover:border-[#0A7B24]">
                  Return to Home
                </span>
              </Link>

              <h2 className="text-3xl font-bold text-[#111827] mb-2">
                Welcome Back
              </h2>
              <p className="text-[#6B7280]">Sign in to continue to Katiba360</p>
            </div>

            {errorMessage && (
              <div
                className="flex items-center gap-3 bg-[#CE1126]/10 border border-[#CE1126]/20 text-[#CE1126] px-4 py-3 rounded-md mb-6"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={20} className="flex-shrink-0" />
                <span className="block">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-6 py-3 rounded-md border-2 border-[#E5E7EB] hover:border-[#0A7B24] bg-white text-[#111827] font-medium text-base transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1EB53A] focus:ring-offset-2"
                aria-label="Sign in with Google"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner className="border-[#6B7280]" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      aria-hidden="true"
                    >
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
                    Sign in with Google
                  </div>
                )}
              </button>

              <div className="bg-[#F9FAFB] rounded-lg p-5 border border-[#E5E7EB]">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-[#0A7B24] mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-[#111827] mb-1">
                      Your Privacy is Protected
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      We only collect your public profile information and email
                      from Google. We never access sensitive data or share your
                      information with third parties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-[#6B7280]">
                <p>
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-[#0A7B24] hover:text-[#1EB53A] underline 
                             transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#0A7B24] hover:text-[#1EB53A] underline 
                             transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Need help?</span>
                <a
                  href="https://x.com/WebShrewd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0A7B24] hover:text-[#1EB53A] flex items-center transition-colors duration-200"
                >
                  Contact Support
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 px-8 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <p className="text-sm text-[#6B7280]">
              © 2023 Katiba360. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/about"
                className="text-sm text-[#6B7280] hover:text-[#0A7B24] transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-[#6B7280] hover:text-[#0A7B24] transition-colors duration-200"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for background pattern */}
      <style jsx global>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
