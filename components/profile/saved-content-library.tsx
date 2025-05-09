"use client"

import { useState } from "react"
import { Search, Filter, Grid3X3, List, BookOpen, Shield, Gavel, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SavedContentLibrary() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock saved content data
  const savedContent = [
    {
      id: 1,
      title: "Chapter 4: Bill of Rights",
      type: "chapter",
      description: "Fundamental rights and freedoms in the Constitution of Kenya.",
      date: "May 5, 2023",
      icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
      progress: 75,
    },
    {
      id: 2,
      title: "Right to Fair Administrative Action",
      type: "right",
      description:
        "Article 47: Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.",
      date: "May 3, 2023",
      icon: <Shield className="h-5 w-5 text-[#1EB53A]" />,
      progress: 100,
    },
    {
      id: 3,
      title: "Know Your Rights During Arrest",
      type: "scenario",
      description: "Learn about your constitutional rights when interacting with law enforcement.",
      date: "May 1, 2023",
      icon: <Gavel className="h-5 w-5 text-[#1EB53A]" />,
      progress: 50,
    },
    {
      id: 4,
      title: "Chapter 11: Devolution",
      type: "chapter",
      description: "County governments, their functions and powers in the Constitution.",
      date: "Apr 28, 2023",
      icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
      progress: 30,
    },
    {
      id: 5,
      title: "Right to Equality and Freedom from Discrimination",
      type: "right",
      description:
        "Article 27: Every person is equal before the law and has the right to equal protection and equal benefit of the law.",
      date: "Apr 25, 2023",
      icon: <Shield className="h-5 w-5 text-[#1EB53A]" />,
      progress: 100,
    },
    {
      id: 6,
      title: "Property Rights & Land Ownership",
      type: "scenario",
      description: "Understand constitutional protections for property and land rights in Kenya.",
      date: "Apr 22, 2023",
      icon: <Gavel className="h-5 w-5 text-[#1EB53A]" />,
      progress: 0,
    },
  ]

  // Filter content based on search query
  const filteredContent = savedContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Saved Content Library</h2>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search saved content..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>

          <div className="border border-gray-200 rounded-md flex">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-md rounded-r-none px-3 ${viewMode === "grid" ? "bg-[#F3F4F6]" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-r-md rounded-l-none px-3 ${viewMode === "list" ? "bg-[#F3F4F6]" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Categories */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="rights">Rights</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#1EB53A]/10 p-2 rounded-full">{item.icon}</div>
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {item.type} • Saved {item.date}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4 fill-[#1EB53A] text-[#1EB53A]" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-[#4B5563] line-clamp-2">{item.description}</p>
                {item.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="text-[#1EB53A] font-medium">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1EB53A] rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-[#1EB53A] hover:bg-[#1EB53A]/10">
                  Continue Reading
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="bg-[#1EB53A]/10 p-2 rounded-full">{item.icon}</div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[#0A7B24]">{item.title}</h3>
                    <p className="text-xs text-[#6B7280]">
                      {item.type} • Saved {item.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4 fill-[#1EB53A] text-[#1EB53A]" />
                  </Button>
                </div>
                <p className="text-sm text-[#4B5563] mt-1">{item.description}</p>
                {item.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="text-[#1EB53A] font-medium">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1EB53A] rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-[#F3F4F6] rounded-full p-4 inline-flex mb-4">
            <Bookmark className="h-8 w-8 text-[#6B7280]" />
          </div>
          <h3 className="text-lg font-medium text-[#374151] mb-2">No saved content found</h3>
          <p className="text-[#6B7280] mb-6">Try adjusting your search or save some content to see it here.</p>
          <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">Explore Content</Button>
        </div>
      )}
    </div>
  )
}
