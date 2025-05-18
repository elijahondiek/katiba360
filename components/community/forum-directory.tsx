"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MessageSquare,
  Users,
  Clock,
  ChevronRight,
  Shield,
  Gavel,
  BookOpen,
  Globe,
  FileText,
  Filter,
  TrendingUp,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock forum categories data
const forumCategories = [
  {
    id: "rights",
    title: "Bill of Rights",
    description: "Discussions about fundamental rights and freedoms in the Constitution",
    icon: <Shield className="h-5 w-5 text-[#1EB53A]" />,
    threads: 124,
    participants: 342,
    lastActivity: "10 minutes ago",
    trending: true,
  },
  {
    id: "governance",
    title: "Governance & Leadership",
    description: "Discussions about government structure, elections, and leadership",
    icon: <Gavel className="h-5 w-5 text-[#1EB53A]" />,
    threads: 98,
    participants: 256,
    lastActivity: "2 hours ago",
    trending: false,
  },
  {
    id: "devolution",
    title: "Devolution & Counties",
    description: "Discussions about county governments and devolved powers",
    icon: <Globe className="h-5 w-5 text-[#1EB53A]" />,
    threads: 87,
    participants: 203,
    lastActivity: "1 day ago",
    trending: true,
  },
  {
    id: "judiciary",
    title: "Judiciary & Justice",
    description: "Discussions about courts, legal processes, and access to justice",
    icon: <FileText className="h-5 w-5 text-[#1EB53A]" />,
    threads: 65,
    participants: 178,
    lastActivity: "3 days ago",
    trending: false,
  },
  {
    id: "general",
    title: "General Discussion",
    description: "General discussions about the Constitution and civic education",
    icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
    threads: 156,
    participants: 412,
    lastActivity: "30 minutes ago",
    trending: false,
  },
]

// Mock recent threads data
const recentThreads = [
  {
    id: "thread-1",
    title: "How does Article 43 affect healthcare access in rural areas?",
    category: "Bill of Rights",
    author: "Jane Wanjiku",
    authorVerified: true,
    authorBadge: "Legal Expert",
    replies: 24,
    views: 342,
    lastActivity: "10 minutes ago",
    preview:
      "I've been researching how the right to healthcare is implemented in rural counties and found some interesting disparities...",
    upvotes: 45,
    participants: 18,
  },
  {
    id: "thread-2",
    title: "Interpretation of Article 27 on equality and freedom from discrimination",
    category: "Bill of Rights",
    author: "John Kamau",
    authorVerified: true,
    authorBadge: "Constitutional Scholar",
    replies: 36,
    views: 521,
    lastActivity: "2 hours ago",
    preview:
      "The recent court case on employment discrimination raises important questions about how Article 27 is applied...",
    upvotes: 62,
    participants: 24,
  },
  {
    id: "thread-3",
    title: "County revenue allocation formula: Is it equitable?",
    category: "Devolution & Counties",
    author: "Sarah Odhiambo",
    authorVerified: false,
    replies: 19,
    views: 287,
    lastActivity: "1 day ago",
    preview:
      "The current formula for allocating revenue to counties seems to favor certain regions. Let's discuss if this aligns with constitutional principles...",
    upvotes: 38,
    participants: 15,
  },
  {
    id: "thread-4",
    title: "Public participation in constitutional amendments",
    category: "General Discussion",
    author: "David Mwangi",
    authorVerified: false,
    replies: 42,
    views: 634,
    lastActivity: "3 days ago",
    preview:
      "What constitutes meaningful public participation when amending the constitution? The recent attempts have raised questions about...",
    upvotes: 73,
    participants: 31,
  },
]

export function ForumDirectory() {
  const [viewMode, setViewMode] = useState<"categories" | "recent">("categories")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0A7B24]">Discussion Forums</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Link href="/community/new-thread">
            <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories" onClick={() => setViewMode("categories")} className="text-sm">
            Categories
          </TabsTrigger>
          <TabsTrigger value="recent" onClick={() => setViewMode("recent")} className="text-sm">
            Recent Discussions
          </TabsTrigger>
          <TabsTrigger value="popular" className="text-sm">
            Popular
          </TabsTrigger>
          <TabsTrigger value="unanswered" className="text-sm">
            Unanswered
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forumCategories.map((category) => (
              <Link href={`/community/forums/${category.id}`} key={category.id}>
                <Card className="h-full hover:border-[#1EB53A] hover:shadow-sm transition-all">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#1EB53A]/10 p-2 rounded-full mt-1">{category.icon}</div>
                      <div>
                        <CardTitle className="text-lg text-[#0A7B24] flex items-center gap-2">
                          {category.title}
                          {category.trending && (
                            <Badge
                              variant="outline"
                              className="bg-[#CE1126]/10 text-[#CE1126] border-[#CE1126]/20 text-xs"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{category.description}</CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                  </CardHeader>
                  <CardFooter className="pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {category.threads} threads
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {category.participants} participants
                      </div>
                      <div className="flex items-center ml-auto">
                        <Clock className="h-3 w-3 mr-1" />
                        {category.lastActivity}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <Link href={`/community/thread/${thread.id}`} key={thread.id}>
                <Card className="hover:border-[#1EB53A] hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20 text-xs"
                          >
                            {thread.category}
                          </Badge>
                          {thread.authorVerified && (
                            <Badge
                              variant="outline"
                              className="bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20 text-xs"
                            >
                              {thread.authorBadge}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-[#0A7B24] mb-1">{thread.title}</h3>
                        <p className="text-sm text-[#4B5563] line-clamp-2 mb-3">{thread.preview}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <div>
                            Started by <span className="font-medium">{thread.author}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {thread.replies} replies
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {thread.views} views
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {thread.participants} participants
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 text-xs text-[#6B7280]">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {thread.lastActivity}
                        </div>
                        <div className="bg-[#1EB53A]/10 text-[#0A7B24] font-medium px-2 py-1 rounded-full">
                          +{thread.upvotes}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="flex items-center justify-center h-40 border border-dashed rounded-lg">
            <p className="text-[#6B7280]">Popular discussions will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="unanswered">
          <div className="flex items-center justify-center h-40 border border-dashed rounded-lg">
            <p className="text-[#6B7280]">Unanswered discussions will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
