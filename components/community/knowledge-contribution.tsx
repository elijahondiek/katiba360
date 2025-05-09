"use client"
import Link from "next/link"
import {
  BookOpen,
  Globe,
  FileText,
  Lightbulb,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock contribution types
const contributionTypes = [
  {
    id: "translation",
    title: "Translation",
    description: "Translate constitutional content into local languages",
    icon: <Globe className="h-5 w-5 text-[#1EB53A]" />,
    submissions: 156,
    contributors: 42,
    impact: "High",
    difficulty: "Medium",
  },
  {
    id: "examples",
    title: "Real-World Examples",
    description: "Share practical examples of constitutional principles in action",
    icon: <Lightbulb className="h-5 w-5 text-[#1EB53A]" />,
    submissions: 98,
    contributors: 37,
    impact: "High",
    difficulty: "Low",
  },
  {
    id: "simplification",
    title: "Simplified Explanations",
    description: "Create easy-to-understand explanations of complex legal concepts",
    icon: <FileText className="h-5 w-5 text-[#1EB53A]" />,
    submissions: 124,
    contributors: 29,
    impact: "Medium",
    difficulty: "Medium",
  },
  {
    id: "resources",
    title: "Educational Resources",
    description: "Develop learning materials, quizzes, and activities",
    icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
    submissions: 76,
    contributors: 18,
    impact: "Medium",
    difficulty: "High",
  },
]

// Mock recent contributions
const recentContributions = [
  {
    id: "contrib-1",
    title: "Kikuyu translation of Article 43 on Economic and Social Rights",
    type: "Translation",
    contributor: "Jane Wanjiku",
    contributorRank: "Gold Contributor",
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
    contributor: "John Kamau",
    contributorRank: "Silver Contributor",
    status: "in-review",
    submittedDate: "3 days ago",
    impactScore: 0,
    reviewComments: 2,
  },
  {
    id: "contrib-3",
    title: "Simplified explanation of the impeachment process",
    type: "Simplified Explanations",
    contributor: "Sarah Odhiambo",
    contributorRank: "Bronze Contributor",
    status: "needs-revision",
    submittedDate: "5 days ago",
    impactScore: 0,
    reviewComments: 4,
  },
  {
    id: "contrib-4",
    title: "Interactive quiz on Chapter 6: Leadership and Integrity",
    type: "Educational Resources",
    contributor: "David Mwangi",
    contributorRank: "New Contributor",
    status: "approved",
    submittedDate: "1 week ago",
    approvedDate: "2 days ago",
    impactScore: 56,
    reviewComments: 2,
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
    default:
      return (
        <Badge variant="outline" className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">
          <HelpCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
  }
}

export function KnowledgeContribution() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0A7B24]">Knowledge Contribution</h2>
        <Link href="/community/new-contribution">
          <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
            <Lightbulb className="h-4 w-4 mr-2" />
            Contribute
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="contribute" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contribute" className="text-sm">
            Contribution Types
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-sm">
            Recent Contributions
          </TabsTrigger>
          <TabsTrigger value="top" className="text-sm">
            Top Contributors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contribute">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributionTypes.map((type) => (
              <Link href={`/community/contribute/${type.id}`} key={type.id}>
                <Card className="h-full hover:border-[#1EB53A] hover:shadow-sm transition-all">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#1EB53A]/10 p-2 rounded-full mt-1">{type.icon}</div>
                      <div>
                        <CardTitle className="text-lg text-[#0A7B24]">{type.title}</CardTitle>
                        <CardDescription className="mt-1">{type.description}</CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                  </CardHeader>
                  <CardFooter className="pt-2 border-t border-gray-100">
                    <div className="w-full">
                      <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="font-medium">{type.submissions}</span> submissions
                          </div>
                          <div>
                            <span className="font-medium">{type.contributors}</span> contributors
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            Impact: <span className="text-[#0A7B24] font-medium">{type.impact}</span>
                          </div>
                          <div>
                            Difficulty: <span className="text-[#6366F1] font-medium">{type.difficulty}</span>
                          </div>
                        </div>
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
            {recentContributions.map((contribution) => (
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
                          <div>
                            By <span className="font-medium">{contribution.contributor}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {contribution.contributorRank}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Submitted {contribution.submittedDate}
                          </div>
                        </div>

                        {contribution.status === "approved" ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                              <span>Impact Score</span>
                              <span className="text-[#0A7B24] font-medium">{contribution.impactScore}</span>
                            </div>
                            <Progress value={contribution.impactScore} className="h-1.5" />
                            <div className="text-xs text-[#6B7280]">
                              Approved {contribution.approvedDate} • {contribution.reviewComments} review comments
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                            <span>{contribution.reviewComments} review comments</span>
                            {contribution.status === "needs-revision" && (
                              <span className="text-[#F59E0B]">Action needed</span>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Jane Wanjiku",
                rank: "Gold Contributor",
                contributions: 47,
                impact: 1245,
                avatar: "/placeholder.svg?key=e2rw9",
              },
              {
                name: "John Kamau",
                rank: "Silver Contributor",
                contributions: 32,
                impact: 876,
                avatar: "/placeholder.svg?key=u1j1h",
              },
              {
                name: "Sarah Odhiambo",
                rank: "Silver Contributor",
                contributions: 28,
                impact: 754,
                avatar: "/placeholder.svg?key=vgjpj",
              },
              {
                name: "David Mwangi",
                rank: "Bronze Contributor",
                contributions: 15,
                impact: 432,
                avatar: "/placeholder.svg?key=j0l36",
              },
              {
                name: "Mary Njeri",
                rank: "Bronze Contributor",
                contributions: 12,
                impact: 387,
                avatar: "/placeholder.svg?key=ok2a9",
              },
              {
                name: "James Omondi",
                rank: "New Contributor",
                contributions: 5,
                impact: 124,
                avatar: "/placeholder.svg?key=6wtf4",
              },
            ].map((contributor, index) => (
              <Card key={index} className="hover:border-[#1EB53A] hover:shadow-sm transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={contributor.avatar || "/placeholder.svg"}
                        alt={contributor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#1EB53A] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      #{index + 1}
                    </div>
                  </div>
                  <h3 className="font-medium text-[#0A7B24]">{contributor.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1 mb-3">
                    <Award className="h-3 w-3 text-[#1EB53A]" />
                    <span className="text-xs text-[#6B7280]">{contributor.rank}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="bg-[#F3F4F6] rounded p-2 text-center">
                      <div className="text-lg font-bold text-[#0A7B24]">{contributor.contributions}</div>
                      <div className="text-xs text-[#6B7280]">Contributions</div>
                    </div>
                    <div className="bg-[#F3F4F6] rounded p-2 text-center">
                      <div className="text-lg font-bold text-[#0A7B24]">{contributor.impact}</div>
                      <div className="text-xs text-[#6B7280]">Impact Points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
