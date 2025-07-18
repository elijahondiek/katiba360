"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  BookOpen,
  Star,
  Settings,
  BookMarked,
  Download,
  LogOut,
  ChevronRight,
  Award,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/AuthContext"
import { LanguageSelector } from "@/components/language-selector"
import { ProfileHeader } from "@/components/profile/profile-header"
import { SavedContentLibrary } from "@/components/profile/saved-content-library"
import { ReadingStats } from "@/components/profile/reading-stats"
import { Achievements } from "@/components/profile/achievements"
import { RecentActivity } from "@/components/profile/recent-activity"
import { RecentAchievements } from "@/components/profile/recent-achievements"
import { LogoutButton } from "@/components/auth/logout-button"
import { ComingSoonChip } from "@/components/ui/coming-soon-chip"
import { OfflineContent } from "@/components/profile/offline-content"
import useTokenRefresh from "@/hooks/useTokenRefresh"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { authState, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  
  // Enable automatic token refresh
  useTokenRefresh({
    proactiveRefresh: true,
    refreshThreshold: 120, // Refresh when 2 minutes left
    checkInterval: 30000, // Check every 30 seconds
  })

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Main Content */}
          <div className="mt-6">
            {/* Mobile Horizontal Tabs */}
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-1">
                <div className="grid grid-cols-5 gap-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                      activeTab === "overview" 
                        ? "bg-[#1EB53A] text-white" 
                        : "text-[#4B5563] hover:bg-gray-100"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Stats</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                      activeTab === "saved" 
                        ? "bg-[#1EB53A] text-white" 
                        : "text-[#4B5563] hover:bg-gray-100"
                    }`}
                  >
                    <BookMarked className="h-4 w-4" />
                    <span>Saved</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("achievements")}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                      activeTab === "achievements" 
                        ? "bg-[#1EB53A] text-white" 
                        : "text-[#4B5563] hover:bg-gray-100"
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    <span>Awards</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("offline")}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                      activeTab === "offline" 
                        ? "bg-[#1EB53A] text-white" 
                        : "text-[#4B5563] hover:bg-gray-100"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    <span>Files</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                      activeTab === "settings" 
                        ? "bg-[#1EB53A] text-white" 
                        : "text-[#4B5563] hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-[240px_1fr] gap-8">
              {/* Desktop Sidebar Navigation */}
              <div className="bg-white rounded-lg border border-gray-200 h-fit overflow-hidden">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === "overview" 
                        ? "bg-[#1EB53A]/10 text-[#0A7B24] border-r-2 border-[#1EB53A]" 
                        : "text-[#4B5563] hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === "saved" 
                        ? "bg-[#1EB53A]/10 text-[#0A7B24] border-r-2 border-[#1EB53A]" 
                        : "text-[#4B5563] hover:bg-gray-50"
                    }`}
                  >
                    <BookMarked className="h-5 w-5" />
                    <span>Saved Content</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("achievements")}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === "achievements" 
                        ? "bg-[#1EB53A]/10 text-[#0A7B24] border-r-2 border-[#1EB53A]" 
                        : "text-[#4B5563] hover:bg-gray-50"
                    }`}
                  >
                    <Award className="h-5 w-5" />
                    <span>Achievements</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("offline")}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === "offline" 
                        ? "bg-[#1EB53A]/10 text-[#0A7B24] border-r-2 border-[#1EB53A]" 
                        : "text-[#4B5563] hover:bg-gray-50"
                    }`}
                  >
                    <Download className="h-5 w-5" />
                    <span>Offline Content</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === "settings" 
                        ? "bg-[#1EB53A]/10 text-[#0A7B24] border-r-2 border-[#1EB53A]" 
                        : "text-[#4B5563] hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>

                  <hr className="my-2 border-gray-200" />

                  <button 
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 text-[#CE1126] hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>

              {/* Desktop Content Area */}
              <div>
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <ReadingStats />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RecentActivity />
                      <RecentAchievements onViewAll={() => setActiveTab("achievements")} />
                    </div>
                  </div>
                )}

                {activeTab === "saved" && (
                  <SavedContentLibrary />
                )}
                {activeTab === "achievements" && (
                  <Achievements />
                )}
                {activeTab === "offline" && (
                  <OfflineContent />
                )}
                {activeTab === "settings" && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Settings</h2>
                    <p className="text-[#4B5563] mb-6">Customize your profile and app preferences.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-[#374151] mb-3">Language Preferences</h3>
                        <LanguageSelector />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#374151] mb-3">Reading Preferences</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-[#4B5563]">Enable audio narration</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-[#4B5563]">Auto-save reading progress</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-[#4B5563]">High contrast mode</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#374151] mb-3">Notifications</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-[#4B5563]">Reading reminders</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-[#4B5563]">Achievement notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-[#4B5563]">New content updates</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Content Area */}
            <div className="lg:hidden">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <ReadingStats />

                  <div className="space-y-6">
                    <RecentActivity />
                    <RecentAchievements onViewAll={() => setActiveTab("achievements")} />
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <SavedContentLibrary />
              )}
              {activeTab === "achievements" && (
                <Achievements />
              )}
              {activeTab === "offline" && (
                <OfflineContent />
              )}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-lg font-bold text-[#0A7B24] mb-3">Settings</h2>
                  <p className="text-[#4B5563] mb-4 text-sm">Customize your profile and app preferences.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#374151] mb-2">Language Preferences</h3>
                      <LanguageSelector />
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold text-[#374151] mb-2">Reading Preferences</h3>
                      <div className="space-y-2">
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-[#4B5563]">Enable audio narration</span>
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-[#4B5563]">Auto-save reading progress</span>
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-[#4B5563]">High contrast mode</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold text-[#374151] mb-2">Notifications</h3>
                      <div className="space-y-2">
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-[#4B5563]">Reading reminders</span>
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-[#4B5563]">Achievement notifications</span>
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-[#4B5563]">New content updates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
