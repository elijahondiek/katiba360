"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Home, ArrowLeft, BookOpen, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"

export default function NotFound() {
  const { t } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  
  // Animation effect - fade in elements sequentially
  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full text-center">
        {/* Logo and 404 */}
        <div className={`mb-8 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
          <div className="font-bold text-6xl mb-2">
            <span className="text-[#0A7B24]">4</span>
            <span className="text-[#1EB53A]">0</span>
            <span className="text-[#0A7B24]">4</span>
            <span className="text-[#CE1126] text-4xl align-text-top ml-0.5">°</span>
          </div>
          <h1 className="text-2xl font-bold text-[#374151] mb-2">
            {t("error.pageNotFound") || "Page Not Found"}
          </h1>
        </div>

        {/* Illustration */}
        <div className={`mb-8 flex justify-center transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="relative w-64 h-64">
            <Image
              src="/images/404-illustration.svg"
              alt="Page not found illustration"
              fill
              className="object-contain"
              priority
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            {/* Fallback icon if image doesn't exist */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#1EB53A]/10 p-8 rounded-full">
                <FileText size={64} className="text-[#0A7B24]" />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className={`text-[#4B5563] mb-8 max-w-md mx-auto transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
          {t("error.notFoundMessage") || 
            "We couldn't find the page you're looking for. It might have been moved, deleted, or never existed."}
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className={`mb-8 max-w-md mx-auto transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={18} />
              <Input
                type="text"
                placeholder={t("search.placeholder") || "Search the constitution..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#E5E7EB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
            >
              {t("search.button") || "Search"}
            </Button>
          </div>
        </form>

        {/* Navigation options */}
        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
          <Link href="/" passHref>
            <Button variant="outline" className="flex gap-2 border-[#D1D5DB]">
              <Home size={18} />
              <span>{t("nav.home") || "Home"}</span>
            </Button>
          </Link>
          <Link href="/chapters" passHref>
            <Button variant="outline" className="flex gap-2 border-[#D1D5DB]">
              <BookOpen size={18} />
              <span>{t("nav.chapters") || "Chapters"}</span>
            </Button>
          </Link>
          <Link href="/rights" passHref>
            <Button variant="outline" className="flex gap-2 border-[#D1D5DB]">
              <Shield size={18} />
              <span>{t("nav.rights") || "Rights"}</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex gap-2 text-[#4B5563]"
          >
            <ArrowLeft size={18} />
            <span>{t("nav.back") || "Go Back"}</span>
          </Button>
        </div>

        {/* Popular links */}
        <div className={`mt-12 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <h2 className="text-lg font-medium text-[#374151] mb-4">
            {t("error.popularPages") || "Popular Pages"}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/chapters/1" className="text-[#0A7B24] hover:underline">
              Chapter 1
            </Link>
            <Link href="/rights/bill-of-rights" className="text-[#0A7B24] hover:underline">
              Bill of Rights
            </Link>
            <Link href="/scenarios" className="text-[#0A7B24] hover:underline">
              Common Scenarios
            </Link>
            <Link href="/about" className="text-[#0A7B24] hover:underline">
              About Katiba360
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
