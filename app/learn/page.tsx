"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Award, Play, Search, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLearning } from "@/contexts/learning-context"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LearningDashboard } from "@/components/learning/learning-dashboard"
import { LearningPathCard } from "@/components/learning/learning-path-card"
import { ScenarioCard } from "@/components/learning/scenario-card"

export default function LearnPage() {
  const { t } = useLanguage()
  const { learningPaths, scenarios } = useLearning()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter learning paths based on search query
  const filteredPaths = learningPaths.filter(
    (path) =>
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter scenarios based on search query
  const filteredScenarios = scenarios.filter(
    (scenario) =>
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              <Link href="/learn" className="text-[#0A7B24] font-medium">
                {t("nav.learn")}
              </Link>
              <Link href="/community" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                Community
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#1EB53A]/20 to-[#1EB53A]/5 rounded-xl p-8 mb-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-[#0A7B24] mb-4">Learn the Constitution</h1>
              <p className="text-[#4B5563] mb-6">
                Explore interactive learning paths and scenarios to understand Kenya's constitution. Track your
                progress, earn certificates, and build your constitutional knowledge.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10">
                  <Play className="h-4 w-4 mr-2" />
                  Try a Scenario
                </Button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search learning paths and scenarios..."
              className="pl-10 py-2 border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="dashboard" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[400px] grid-cols-3">
                <TabsTrigger value="dashboard" className="text-sm">
                  <Award className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="paths" className="text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Paths
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="text-sm">
                  <Play className="h-4 w-4 mr-2" />
                  Scenarios
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-[#4B5563]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="dashboard" className="mt-6">
              <LearningDashboard />
            </TabsContent>

            <TabsContent value="paths" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPaths.length > 0 ? (
                  filteredPaths.map((path) => <LearningPathCard key={path.id} path={path} />)
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-[#6B7280]">No learning paths found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredScenarios.length > 0 ? (
                  filteredScenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} />)
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-[#6B7280]">No scenarios found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
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
