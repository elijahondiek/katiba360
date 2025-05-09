"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Star,
  Filter,
  ChevronRight,
  Edit,
  Trash2,
  BarChart3,
  MessageSquare,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

// Mock user contributions data
const userContributions = [
  {
    id: "contrib-1",
    title: "Kikuyu translation of Article 43 on Economic and Social Rights",
    type: "Translation",
    status: "approved",
    submittedDate: "2 days ago",
    approvedDate: "1 day ago",
    impactScore: 87,
    reviewComments: 3,
  },
  {
    id: "contrib-2",
    title: "Example: How Article 27 was applied in the Nairobi Employment Tribunal Case",
    type: "Real-World Examples",
    status: "in-review",
    submittedDate: "3 days ago",
    impactScore: 0,
    reviewComments: 2,
  },
  {
    id: "contrib-3",
    title: "Simplified explanation of the impeachment process",
    type: "Simplified Explanations",
    status: "needs-revision",
    submittedDate: "5 days ago",
    impactScore: 0,
    reviewComments: 4,
  },
  {
    id: "contrib-4",
    title: "Interactive quiz on Chapter 6: Leadership and Integrity",
    type: "Educational Resources",
    status: "approved",
    submittedDate: "1 week ago",
    approvedDate: "2 days ago",
    impactScore: 56,
    reviewComments: 2,
  },
]

// Mock user forum posts
const userForumPosts = [
  {
    id: "thread-1",
    title: "How does Article 43 affect healthcare access in rural areas?",
    category: "Bill of Rights",
    status: "active",
    createdDate: "May 15, 2023",
    replies: 24,
    views: 342,
    upvotes: 45,
  },
  {
    id: "thread-2",
    title: "County revenue allocation formula: Is it equitable?",
    category: "Devolution & Counties",
    status: "active",
    createdDate: "Apr 28, 2023",
    replies: 19,
    views: 287,
    upvotes: 38,
  },
]

// Helper function to get status badge
function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return (
        <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    case "in-review":
      return (
        <Badge variant="outline" className="bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20">
          <Clock className="h-3 w-3 mr-1" />
          In Review
        </Badge>
      )
    case "needs-revision":
      return (
        <Badge variant="outline" className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20">
          <AlertCircle className="h-3 w-3 mr-1" />
          Needs Revision
        </Badge>
      )
    case "active":
      return (
        <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">
          <HelpCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
  }
}

export default function MyContributionsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("contributions")

  // Calculate total impact score
  const totalImpact = userContributions.reduce((total, contrib) => total + contrib.impactScore, 0)

  // Calculate total upvotes
  const totalUpvotes = userForumPosts.reduce((total, post) => total + post.upvotes, 0)

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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Link href="/community" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1EB53A]/10 border-4 border-white ring-2 ring-[#1EB53A]/20">
                  <img src="/placeholder.svg?key=kimqo" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#1EB53A] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
              </div>

              <div className="flex-grow text-center md:text-left">
                <h1 className="text-2xl font-bold text-[#0A7B24] mb-1">Jane Wanjiku</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
                    Gold Contributor
                  </Badge>
                  <span className="text-sm text-[#6B7280]">Member since May 2023</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#F3F4F6] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#0A7B24]">{userContributions.length}</div>
                    <div className="text-xs text-[#6B7280]">Contributions</div>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#0A7B24]">{totalImpact}</div>
                    <div className="text-xs text-[#6B7280]">Impact Points</div>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#0A7B24]">{userForumPosts.length}</div>
                    <div className="text-xs text-[#6B7280]">Discussions</div>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[#0A7B24]">{totalUpvotes}</div>
                    <div className="text-xs text-[#6B7280]">Upvotes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="contributions" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="contributions" className="text-sm">
                  <Award className="h-4 w-4 mr-2" />
                  Knowledge Contributions
                </TabsTrigger>
                <TabsTrigger value="discussions" className="text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Forum Discussions
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
            </div>

            {/* Knowledge Contributions Tab */}
            <TabsContent value="contributions" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#0A7B24]">My Knowledge Contributions</h2>
                  <Link href="/community/new-contribution">
                    <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">New Contribution</Button>
                  </Link>
                </div>

                {/* Contribution Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#1EB53A]" />
                      Contribution Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-[#6B7280]">Overall Impact</span>
                          <span className="text-[#0A7B24] font-medium">{totalImpact} points</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                          <span>Bronze (0)</span>
                          <span>Silver (100)</span>
                          <span>Gold (200)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#0A7B24]">
                            {userContributions.filter((c) => c.status === "approved").length}
                          </div>
                          <div className="text-xs text-[#6B7280]">Approved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#6366F1]">
                            {userContributions.filter((c) => c.status === "in-review").length}
                          </div>
                          <div className="text-xs text-[#6B7280]">In Review</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#F59E0B]">
                            {userContributions.filter((c) => c.status === "needs-revision").length}
                          </div>
                          <div className="text-xs text-[#6B7280]">Needs Revision</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#6B7280]">
                            {
                              userContributions.filter(
                                (c) =>
                                  c.status !== "approved" && c.status !== "in-review" && c.status !== "needs-revision",
                              ).length
                            }
                          </div>
                          <div className="text-xs text-[#6B7280]">Pending</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contributions List */}
                <div className="space-y-4">
                  {userContributions.map((contribution) => (
                    <Link href={`/community/contribution/${contribution.id}`} key={contribution.id}>
                      <Card className="hover:border-[#1EB53A] hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="outline"
                                  className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20 text-xs"
                                >
                                  {contribution.type}
                                </Badge>
                                {getStatusBadge(contribution.status)}
                              </div>
                              <h3 className="text-lg font-medium text-[#0A7B24] mb-1">{contribution.title}</h3>
                              <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-3">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Submitted {contribution.submittedDate}
                                </div>
                                {contribution.approvedDate && (
                                  <div className="flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1 text-[#1EB53A]" />
                                    Approved {contribution.approvedDate}
                                  </div>
                                )}
                              </div>

                              {contribution.status === "approved" ? (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                                    <span>Impact Score</span>
                                    <span className="text-[#0A7B24] font-medium">{contribution.impactScore}</span>
                                  </div>
                                  <Progress value={contribution.impactScore} className="h-1.5" />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                                  <span>{contribution.reviewComments} review comments</span>
                                  {contribution.status === "needs-revision" && (
                                    <span className="text-[#F59E0B] font-medium">Action needed</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                              {contribution.status === "approved" && (
                                <div className="flex items-center text-[#0A7B24]">
                                  <Star className="h-4 w-4 fill-[#0A7B24] text-[#0A7B24] mr-1" />
                                  <span className="font-medium">+{contribution.impactScore} points</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                {contribution.status === "needs-revision" && (
                                  <Button variant="outline" size="sm" className="text-[#6B7280]">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" className="text-[#CE1126]">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Forum Discussions Tab */}
            <TabsContent value="discussions" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#0A7B24]">My Forum Discussions</h2>
                  <Link href="/community/new-thread">
                    <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">New Discussion</Button>
                  </Link>
                </div>

                {/* Discussions List */}
                <div className="space-y-4">
                  {userForumPosts.map((post) => (
                    <Link href={`/community/thread/${post.id}`} key={post.id}>
                      <Card className="hover:border-[#1EB53A] hover:shadow-sm transition-all">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="outline"
                                  className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20 text-xs"
                                >
                                  {post.category}
                                </Badge>
                                {getStatusBadge(post.status)}
                              </div>
                              <h3 className="text-lg font-medium text-[#0A7B24] mb-1">{post.title}</h3>
                              <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Created {post.createdDate}
                                </div>
                                <div className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {post.replies} replies
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {post.views} views
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
                              <div className="bg-[#1EB53A]/10 text-[#0A7B24] font-medium px-2 py-1 rounded-full text-sm">
                                +{post.upvotes}
                              </div>
                              <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
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
