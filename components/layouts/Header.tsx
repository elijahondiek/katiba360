"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/AuthContext"
import { LogoutLink } from "@/components/auth/logout-link"
import { usePathname } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react"
import Portal from "../Portal"

// Online status indicator component
const OnlineStatusIndicator = () => {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1EB53A] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A7B24]"></span>
    </span>
  )
}

export default function Header() {
  const { t } = useLanguage()
  const { authState } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // // Debug user object
  // useEffect(() => {
  //   if (authState.user) {
  //     console.log('Auth user object:', authState.user)
  //   }
  // }, [authState.user])
  
  // Helper function to get avatar URL
  const getAvatarUrl = () => {
    if (!authState.user) return ""
    return authState.user.avatar_url || authState.user.profile_image_url || ""
  }
  
  // Helper function to get display name
  const getDisplayName = () => {
    if (!authState.user) return "User"
    return authState.user.display_name || 
           `${authState.user.first_name || ''} ${authState.user.last_name || ''}`.trim() || 
           "User"
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when screen size increases to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Check scroll position on initial load
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide header on onboarding page
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    return null
  }

  // Check if we're on the home page
  const isHomePage = pathname === "/"

  // Determine active page for navigation highlighting
  const getNavItemClass = (path: string) => {
    const isActive = pathname.startsWith(path)
    return isActive ? "text-[#0A7B24] font-medium" : "text-[#374151] hover:text-[#0A7B24] font-medium"
  }

  return (
    <header
      className={`border-b sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-gray-200 bg-white/95 backdrop-blur-sm shadow-md" 
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="font-bold text-2xl">
            <span className="text-[#0A7B24]">Katiba</span>
            <span className="text-[#1EB53A]">360</span>
            <span className="text-[#CE1126] text-sm align-text-top ml-0.5">°</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center gap-6 ${!isHomePage ? "flex-1 justify-center" : ""}`}>
          <nav className="flex gap-6">
            <Link href="/chapters" className={getNavItemClass("/chapters")}>
              {t("nav.chapters")}
            </Link>
            <Link href="/rights" className={getNavItemClass("/rights")}>
              {t("nav.rights")}
            </Link>
            <Link href="/search" className={getNavItemClass("/search")}>
              {t("nav.search")}
            </Link>
            {/* <div className="relative inline-flex items-center">
              <span className="text-[#9CA3AF] cursor-not-allowed opacity-70" aria-disabled="true">
                {t("nav.learn")}
              </span>
              <ComingSoonChip className="ml-1" compact={true} />
            </div> */}
            <div className="relative group">
              <Link href="/about" className={`${getNavItemClass("/about")} flex items-center gap-1`}>
                {t("nav.about")}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Link>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    href="/about/mission"
                    className="block px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] hover:text-[#0A7B24]"
                    role="menuitem"
                  >
                    Our Mission
                  </Link>
                  <Link
                    href="/about/team"
                    className="block px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] hover:text-[#0A7B24]"
                    role="menuitem"
                  >
                    Team
                  </Link>
                  <Link
                    href="/about/partners"
                    className="block px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] hover:text-[#0A7B24]"
                    role="menuitem"
                  >
                    Partners
                  </Link>
                  <Link
                    href="/about/contact"
                    className="block px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] hover:text-[#0A7B24]"
                    role="menuitem"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Right side - auth buttons, language selector, mobile menu button */}
        <div className="flex items-center gap-3">
          {/* Language selector on non-home pages */}
          {!isHomePage && <LanguageSelector />}

          {/* Auth buttons - always on the right */}
          {!authState.isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" passHref legacyBehavior>
                <Button variant="ghost" className="text-[#374151] hover:text-[#0A7B24] hover:bg-[#F3F4F6]">
                  {t("auth.signin")}
                </Button>
              </Link>
              {/* <Link href="/onboarding" passHref legacyBehavior>
                <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">{t("auth.signup")}</Button>
              </Link> */}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full border border-gray-200 p-0 hover:bg-[#F3F4F6]"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={getAvatarUrl()} 
                        alt={getDisplayName()} 
                        onError={(e) => {
                          // If image fails to load, hide it so fallback shows
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-[#F0FFF4] text-[#0A7B24]">
                        {getDisplayName().charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online status indicator */}
                    <span className="absolute top-0 right-0">
                      <OnlineStatusIndicator />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{getDisplayName()}</span>
                    <span className="text-xs text-gray-500 mt-1 truncate">{authState.user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutLink className="cursor-pointer w-full flex items-center text-[#CE1126]">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </LogoutLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${!mobileMenuOpen ? 'bg-white' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
          </Button>
        </div>
      </div>

      {/* Full-screen Mobile Menu */}
      {mobileMenuOpen && (
        <Portal>
          <div
            id="mobile-menu"
            className="fixed inset-0 z-[9999] bg-white overflow-y-auto"
            role="navigation"
            aria-label="Mobile navigation"
          >
          <div className="container mx-auto px-6 py-8">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <div className="font-bold text-2xl">
                  <span className="text-[#0A7B24]">Katiba</span>
                  <span className="text-[#1EB53A]">360</span>
                  <span className="text-[#CE1126] text-sm align-text-top ml-0.5">°</span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* User Profile Section (Mobile) - Only when logged in */}
            {authState.isAuthenticated && (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage 
                      src={getAvatarUrl()} 
                      alt={getDisplayName()} 
                      onError={(e) => {
                        // If image fails to load, hide it so fallback shows
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="bg-[#F0FFF4] text-[#0A7B24] text-lg">
                      {getDisplayName().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-[#111827]">
                        {getDisplayName()}
                      </h3>
                      <span className="ml-2">
                        <OnlineStatusIndicator />
                      </span>
                    </div>
                    <p className="text-sm text-[#6B7280]">{authState.user?.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <Link
                    href="/profile"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#374151] bg-white hover:bg-[#F3F4F6] cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <LogoutLink className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#CE1126] bg-white hover:bg-red-50 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </LogoutLink>
                </div>
              </div>
            )}

            {/* Mobile Menu Navigation */}
            <nav className="flex flex-col space-y-8">
              <Link
                href="/chapters"
                className={`text-xl cursor-pointer ${
                  pathname.startsWith("/chapters") ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.chapters")}
              </Link>

              <Link
                href="/rights"
                className={`text-xl cursor-pointer ${
                  pathname.startsWith("/rights") ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.rights")}
              </Link>

              <Link
                href="/search"
                className={`text-xl cursor-pointer ${
                  pathname.startsWith("/search") ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.search")}
              </Link>

              {/* <div className="flex items-center">
                <span className="text-xl text-[#9CA3AF] cursor-not-allowed opacity-70">{t("nav.learn")}</span>
                <ComingSoonChip className="ml-2" compact={true} />
              </div> */}

              {/* About Section with Dropdown */}
              <div className="space-y-4">
                <Link
                  href="/about"
                  className={`text-xl cursor-pointer ${pathname === "/about" ? "text-[#0A7B24] font-medium" : "text-[#374151]"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.about")}
                </Link>

                <div className="pl-4 space-y-4 border-l-2 border-gray-200 mt-2">
                  <Link
                    href="/about/mission"
                    className={`block cursor-pointer ${
                      pathname === "/about/mission" ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Our Mission
                  </Link>

                  <Link
                    href="/about/team"
                    className={`block cursor-pointer ${
                      pathname === "/about/team" ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Team
                  </Link>

                  <Link
                    href="/about/partners"
                    className={`block cursor-pointer ${
                      pathname === "/about/partners" ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Partners
                  </Link>

                  <Link
                    href="/about/contact"
                    className={`block cursor-pointer ${
                      pathname === "/about/contact" ? "text-[#0A7B24] font-medium" : "text-[#374151]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Language Selector */}
              <div className="pt-4 border-t border-gray-200">
                <LanguageSelector />
              </div>

              {/* Auth Buttons - Only show if not authenticated */}
              {!authState.isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col space-y-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-[#374151] border-[#D1D5DB] py-6 text-lg">
                        {t("auth.signin")}
                      </Button>
                    </Link>
                    {/* <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white py-6 text-lg">
                        {t("auth.signup")}
                      </Button>
                    </Link> */}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
        </Portal>
      )}
    </header>
  )
}