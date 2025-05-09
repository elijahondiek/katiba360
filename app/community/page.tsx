"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { ForumDirectory } from "@/components/community/forum-directory"
import { KnowledgeContribution } from "@/components/community/knowledge-contribution"
import { Search, Users, BookOpen, MessageSquare, Award, Bell } from "lucide-react"

export default function CommunityPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("forums")

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
              <Link href="/community" className="text-[#0A7B24] font-medium">
                Community
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-[#1EB53A] rounded-full"></span>
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="relative">
                <Users className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#1EB53A]/20 to-[#1EB53A]/5 rounded-xl p-8 mb-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-[#0A7B24] mb-4">Katiba360 Community</h1>
              <p className="text-[#4B5563] mb-6">
                Join discussions, share insights, and contribute to making Kenya's constitution accessible to everyone.
                Together, we can build a more informed and engaged citizenry.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join the Discussion
                </Button>
                <Button variant="outline" className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Contribute Knowledge
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search discussions and contributions..."
              className="pl-10 py-2 border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="forums" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="forums" className="text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion Forums
                </TabsTrigger>
                <TabsTrigger value="contribute" className="text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Knowledge Contribution
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Link href="/community/my-contributions">
                  <Button variant="outline" size="sm" className="text-[#4B5563]">
                    <Award className="h-4 w-4 mr-2" />
                    My Contributions
                  </Button>
                </Link>
              </div>
            </div>

            <TabsContent value="forums" className="mt-6">
              <ForumDirectory />
            </TabsContent>

            <TabsContent value="contribute" className="mt-6">
              <KnowledgeContribution />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A7B24] text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Katiba360. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
