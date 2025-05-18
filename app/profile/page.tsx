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
import { LogoutButton } from "@/components/auth/logout-button"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { authState, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Katiba360 Logo" width={40} height={40} className="h-10 w-auto" />
                <span className="text-xl font-bold text-[#0A7B24]">{t("app.title")}</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/chapters" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.chapters")}
              </Link>
              <Link href="/rights" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.rights")}
              </Link>
              <Link href="/learn" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.learn")}
              </Link>
              <Link href="/about" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.about")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-5 w-5 text-[#0A7B24]" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-[#1EB53A] rounded-full"></span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <div className="bg-white rounded-lg border border-gray-200 h-fit overflow-hidden">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === "overview"
                      ? "bg-[#1EB53A]/10 text-[#0A7B24] font-medium border-l-2 border-[#0A7B24]"
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
                      ? "bg-[#1EB53A]/10 text-[#0A7B24] font-medium border-l-2 border-[#0A7B24]"
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
                      ? "bg-[#1EB53A]/10 text-[#0A7B24] font-medium border-l-2 border-[#0A7B24]"
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
                      ? "bg-[#1EB53A]/10 text-[#0A7B24] font-medium border-l-2 border-[#0A7B24]"
                      : "text-[#4B5563] hover:bg-gray-50"
                  }`}
                >
                  <Download className="h-5 w-5" />
                  <span>Offline Content</span>
                </button>

                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 px-4 py-3 text-[#4B5563] hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>

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

            {/* Content Area */}
            <div>
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <ReadingStats />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-[#1EB53A]" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              title: "Read Chapter 4: Bill of Rights",
                              time: "2 hours ago",
                              icon: <BookOpen className="h-4 w-4 text-[#1EB53A]" />,
                            },
                            {
                              title: "Bookmarked Article 27",
                              time: "Yesterday",
                              icon: <BookMarked className="h-4 w-4 text-[#1EB53A]" />,
                            },
                            {
                              title: "Completed Rights Quiz",
                              time: "2 days ago",
                              icon: <CheckCircle2 className="h-4 w-4 text-[#1EB53A]" />,
                            },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                            >
                              <div className="bg-[#1EB53A]/10 p-2 rounded-full">{activity.icon}</div>
                              <div>
                                <p className="text-sm font-medium text-[#374151]">{activity.title}</p>
                                <p className="text-xs text-[#6B7280]">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <Star className="h-5 w-5 mr-2 text-[#1EB53A]" />
                          Recent Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              title: "Constitution Explorer",
                              description: "Read 5 chapters",
                              icon: <Award className="h-4 w-4 text-[#1EB53A]" />,
                            },
                            {
                              title: "Rights Advocate",
                              description: "Completed rights section",
                              icon: <Award className="h-4 w-4 text-[#1EB53A]" />,
                            },
                            {
                              title: "Dedicated Learner",
                              description: "7-day streak",
                              icon: <Award className="h-4 w-4 text-[#1EB53A]" />,
                            },
                          ].map((achievement, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                            >
                              <div className="bg-[#1EB53A]/10 p-2 rounded-full">{achievement.icon}</div>
                              <div>
                                <p className="text-sm font-medium text-[#374151]">{achievement.title}</p>
                                <p className="text-xs text-[#6B7280]">{achievement.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          variant="ghost"
                          className="w-full text-[#1EB53A] hover:text-[#0A7B24] hover:bg-[#1EB53A]/10"
                          onClick={() => setActiveTab("achievements")}
                        >
                          View All Achievements
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "saved" && <SavedContentLibrary />}
              {activeTab === "achievements" && <Achievements />}
              {activeTab === "offline" && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Offline Content</h2>
                  <p className="text-[#4B5563] mb-6">Manage your downloaded content for offline access.</p>

                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Storage Usage</h3>
                      <p className="text-sm text-[#6B7280]">12.4 MB of 100 MB used</p>
                    </div>
                    <Button variant="outline" className="text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10">
                      Manage Storage
                    </Button>
                  </div>

                  <Progress value={12.4} max={100} className="h-2 mb-8" />

                  <h3 className="font-medium text-[#374151] mb-4">Downloaded Content</h3>

                  <div className="space-y-4">
                    {[
                      { title: "Chapter 4: Bill of Rights", size: "3.2 MB", date: "May 5, 2023", progress: 100 },
                      { title: "Chapter 1: Sovereignty", size: "2.8 MB", date: "May 3, 2023", progress: 100 },
                      { title: "Rights Scenarios", size: "4.1 MB", date: "May 1, 2023", progress: 100 },
                      { title: "Chapter 11: Devolution", size: "2.3 MB", date: "Apr 28, 2023", progress: 100 },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-[#1EB53A]/10 p-2 rounded-full">
                            <Download className="h-4 w-4 text-[#1EB53A]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#374151]">{item.title}</p>
                            <div className="flex items-center text-xs text-[#6B7280] mt-1">
                              <span>{item.size}</span>
                              <span className="mx-2">•</span>
                              <span>Downloaded {item.date}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#CE1126] hover:bg-red-50 hover:text-[#CE1126]"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">Download More Content</Button>
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
