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
import { ComingSoonChip } from "@/components/ui/coming-soon-chip"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { authState, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
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
                  disabled
                  className="flex items-center gap-3 px-4 py-3 text-left text-[#4B5563] opacity-70 cursor-not-allowed"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Overview</span>
                  <ComingSoonChip variant="profile" compact={true} />
                </button>

                <button
                  disabled
                  className="flex items-center gap-3 px-4 py-3 text-left text-[#4B5563] opacity-70 cursor-not-allowed"
                >
                  <BookMarked className="h-5 w-5" />
                  <span>Saved Content</span>
                  <ComingSoonChip variant="profile" compact={true} />
                </button>

                <button
                  disabled
                  className="flex items-center gap-3 px-4 py-3 text-left text-[#4B5563] opacity-70 cursor-not-allowed"
                >
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                  <ComingSoonChip variant="profile" compact={true} />
                </button>

                <button
                  disabled
                  className="flex items-center gap-3 px-4 py-3 text-left text-[#4B5563] opacity-70 cursor-not-allowed"
                >
                  <Download className="h-5 w-5" />
                  <span>Offline Content</span>
                  <ComingSoonChip variant="profile" compact={true} />
                </button>

                <button
                  disabled
                  className="flex items-center gap-3 px-4 py-3 text-left text-[#4B5563] opacity-70 cursor-not-allowed"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                  <ComingSoonChip variant="profile" compact={true} />
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

            {/* Content Area */}
            <div>
              {activeTab === "overview" && (
                <div className="space-y-8 relative">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                    <div className="bg-[#1EB53A]/10 text-[#0A7B24] px-4 py-2 rounded-lg text-xl font-medium mb-2">
                      Available Soon
                    </div>
                    <p className="text-[#4B5563] max-w-md text-center">
                      We're working on bringing you personalized reading statistics, activity tracking, and achievements.
                    </p>
                  </div>
                  
                  {/* Content (will be behind overlay) */}
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
                          disabled
                        >
                          View All Achievements
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <div className="relative">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                    <div className="bg-[#1EB53A]/10 text-[#0A7B24] px-4 py-2 rounded-lg text-xl font-medium mb-2">
                      Available Soon
                    </div>
                    <p className="text-[#4B5563] max-w-md text-center">
                      Your saved content library is coming soon. You'll be able to bookmark and organize your favorite constitutional content.
                    </p>
                  </div>
                  
                  {/* Content (will be behind overlay) */}
                  <SavedContentLibrary />
                </div>
              )}
              {activeTab === "achievements" && (
                <div className="relative">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                    <div className="bg-[#1EB53A]/10 text-[#0A7B24] px-4 py-2 rounded-lg text-xl font-medium mb-2">
                      Available Soon
                    </div>
                    <p className="text-[#4B5563] max-w-md text-center">
                      Track your learning journey with achievements and badges as you explore the constitution. This feature is coming soon.
                    </p>
                  </div>
                  
                  {/* Content (will be behind overlay) */}
                  <Achievements />
                </div>
              )}
              {activeTab === "offline" && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                    <div className="bg-[#1EB53A]/10 text-[#0A7B24] px-4 py-2 rounded-lg text-xl font-medium mb-2">
                      Available Soon
                    </div>
                    <p className="text-[#4B5563] max-w-md text-center">
                      Download constitutional content for offline access. Read and learn about your rights even without an internet connection.
                    </p>
                  </div>
                  
                  {/* Content (will be behind overlay) */}
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
