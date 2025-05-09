"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  MessageSquare,
  Users,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share2,
  Bookmark,
  BookmarkCheck,
  Shield,
  Award,
  AlertTriangle,
  Send,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

// Mock thread data
const threadData = {
  id: "thread-1",
  title: "How does Article 43 affect healthcare access in rural areas?",
  category: "Bill of Rights",
  author: "Jane Wanjiku",
  authorVerified: true,
  authorBadge: "Legal Expert",
  authorAvatar: "/placeholder.svg?key=ubbgz",
  authorContributions: 47,
  createdAt: "May 15, 2023",
  content: `
    <p>I've been researching how the right to healthcare is implemented in rural counties and found some interesting disparities between what the Constitution guarantees and the reality on the ground.</p>
    
    <p>Article 43(1)(a) states that "Every person has the right to the highest attainable standard of health, which includes the right to health care services, including reproductive health care."</p>
    
    <p>However, in my visits to several rural health centers in Turkana and West Pokot counties, I observed:</p>
    
    <ul>
      <li>Severe shortage of healthcare professionals</li>
      <li>Limited access to essential medicines</li>
      <li>Poor infrastructure making it difficult for patients to reach facilities</li>
      <li>Inadequate maternal healthcare services</li>
    </ul>
    
    <p>I'm curious to hear from others about their experiences and interpretations of how Article 43 should be implemented. Are there any legal precedents that have addressed this gap between constitutional rights and implementation?</p>
    
    <p>Also, what mechanisms exist for citizens to advocate for better healthcare services based on their constitutional rights?</p>
  `,
  replies: 24,
  views: 342,
  upvotes: 45,
  downvotes: 3,
  bookmarked: false,
  relatedProvisions: [
    {
      title: "Right to Health",
      article: "Article 43(1)(a)",
      content:
        "Every person has the right to the highest attainable standard of health, which includes the right to health care services, including reproductive health care.",
    },
    {
      title: "State's Obligation",
      article: "Article 21(1)",
      content:
        "It is a fundamental duty of the State and every State organ to observe, respect, protect, promote and fulfill the rights and fundamental freedoms in the Bill of Rights.",
    },
    {
      title: "Progressive Realization",
      article: "Article 21(2)",
      content:
        "The State shall take legislative, policy and other measures, including the setting of standards, to achieve the progressive realisation of the rights guaranteed under Article 43.",
    },
  ],
}

// Mock replies data
const repliesData = [
  {
    id: "reply-1",
    author: "John Kamau",
    authorVerified: true,
    authorBadge: "Constitutional Scholar",
    authorAvatar: "/placeholder.svg?key=62ij0",
    content: `
      <p>This is an excellent question that touches on the concept of "progressive realization" of socio-economic rights.</p>
      
      <p>The Supreme Court addressed a similar issue in the case of <em>Kenya Society for the Mentally Handicapped v. Attorney General & Others</em> (2019), where they emphasized that while the state has an obligation to fulfill these rights, they are subject to available resources.</p>
      
      <p>However, the court also noted that the state must demonstrate concrete efforts toward fulfilling these rights, and cannot use resource constraints as a perpetual excuse for inaction.</p>
      
      <p>For rural healthcare specifically, the devolution of health services to counties was meant to address these disparities, but as you've observed, implementation remains challenging.</p>
    `,
    createdAt: "May 15, 2023",
    upvotes: 28,
    downvotes: 1,
    isAnswer: true,
  },
  {
    id: "reply-2",
    author: "Sarah Odhiambo",
    authorVerified: false,
    authorAvatar: "/placeholder.svg?key=s4t3w",
    content: `
      <p>I work as a nurse in Homa Bay County, and I can confirm the challenges you've mentioned. Despite the constitutional guarantee, we face severe shortages of essential medicines and staff.</p>
      
      <p>One mechanism that has been somewhat effective is engaging with the County Health Committee through public participation forums. The Constitution under Article 196 requires county assemblies to facilitate public participation, and this has been a channel for advocating for better resource allocation to healthcare.</p>
      
      <p>Additionally, organizations like Katiba Institute provide legal support for communities seeking to enforce their constitutional rights to healthcare.</p>
    `,
    createdAt: "May 16, 2023",
    upvotes: 15,
    downvotes: 0,
    isAnswer: false,
  },
  {
    id: "reply-3",
    author: "David Mwangi",
    authorVerified: false,
    authorAvatar: "/placeholder.svg?key=h13qp",
    content: `
      <p>I think we need to consider the role of the Kenya National Human Rights Commission (KNHRC) in monitoring the implementation of these rights. They have the mandate to investigate complaints about rights violations, including the right to healthcare.</p>
      
      <p>Has anyone here filed a complaint with KNHRC about healthcare access issues? I'd be interested to hear about the experience and outcomes.</p>
    `,
    createdAt: "May 17, 2023",
    upvotes: 8,
    downvotes: 2,
    isAnswer: false,
  },
]

export default function ThreadDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const [isBookmarked, setIsBookmarked] = useState(threadData.bookmarked)
  const [replyContent, setReplyContent] = useState("")
  const [expandedProvisions, setExpandedProvisions] = useState<string[]>([])

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  // Toggle provision expansion
  const toggleProvision = (id: string) => {
    setExpandedProvisions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Handle reply submission
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the reply to the server
    console.log("Submitting reply:", replyContent)
    setReplyContent("")
  }

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
              Back to Forums
            </Link>
          </div>

          {/* Thread Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
                {threadData.category}
              </Badge>
              {threadData.authorVerified && (
                <Badge variant="outline" className="bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20">
                  {threadData.authorBadge}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-[#0A7B24] mb-4">{threadData.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={threadData.authorAvatar || "/placeholder.svg"}
                    alt={threadData.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-[#374151]">{threadData.author}</span>
                    {threadData.authorVerified && <Shield className="h-4 w-4 text-[#6366F1] ml-1" />}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    <span>{threadData.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#6B7280] ml-auto">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {threadData.replies} replies
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {threadData.views} views
                </div>
              </div>
            </div>

            <div
              className="prose prose-green max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: threadData.content }}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-[#6B7280]">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Upvote ({threadData.upvotes})
                </Button>
                <Button variant="outline" size="sm" className="text-[#6B7280]">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Downvote ({threadData.downvotes})
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-[#6B7280]">
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
                <Button variant="outline" size="sm" className="text-[#6B7280]">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={isBookmarked ? "text-[#1EB53A]" : "text-[#6B7280]"}
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-1" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-1" />
                      Bookmark
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
            {/* Replies Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0A7B24]">Replies ({threadData.replies})</h2>
                <Button variant="outline" size="sm" className="text-[#6B7280]">
                  Newest First
                </Button>
              </div>

              {/* Replies */}
              <div className="space-y-6">
                {repliesData.map((reply) => (
                  <div
                    key={reply.id}
                    className={`bg-white rounded-lg border ${reply.isAnswer ? "border-[#1EB53A]" : "border-gray-200"} p-6`}
                  >
                    {reply.isAnswer && (
                      <div className="bg-[#1EB53A]/10 text-[#0A7B24] text-sm font-medium px-3 py-1 rounded-full inline-flex items-center mb-4">
                        <Award className="h-4 w-4 mr-1" />
                        Verified Answer
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={reply.authorAvatar || "/placeholder.svg"}
                            alt={reply.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-[#374151]">{reply.author}</span>
                            {reply.authorVerified && <Shield className="h-4 w-4 text-[#6366F1] ml-1" />}
                            {reply.authorBadge && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20 text-xs"
                              >
                                {reply.authorBadge}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            <span>{reply.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="prose prose-green max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: reply.content }}
                    />

                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="text-[#6B7280]">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Upvote ({reply.upvotes})
                      </Button>
                      <Button variant="outline" size="sm" className="text-[#6B7280]">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Downvote ({reply.downvotes})
                      </Button>
                      <Button variant="outline" size="sm" className="text-[#6B7280]">
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-[#0A7B24] mb-4">Add Your Reply</h3>
                <form onSubmit={handleReplySubmit}>
                  <Textarea
                    placeholder="Share your thoughts or insights..."
                    className="min-h-[150px] mb-4 border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#6B7280]">Please keep discussions respectful and on-topic.</div>
                    <Button
                      type="submit"
                      className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                      disabled={!replyContent.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post Reply
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Constitutional Provisions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-[#0A7B24]">
                    Related Constitutional Provisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {threadData.relatedProvisions.map((provision, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="bg-[#F9FAFB] p-3 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleProvision(`provision-${index}`)}
                      >
                        <div>
                          <div className="font-medium text-sm text-[#374151]">{provision.title}</div>
                          <div className="text-xs text-[#6B7280]">{provision.article}</div>
                        </div>
                        {expandedProvisions.includes(`provision-${index}`) ? (
                          <ChevronUp className="h-4 w-4 text-[#6B7280]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                        )}
                      </div>
                      {expandedProvisions.includes(`provision-${index}`) && (
                        <div className="p-3 text-sm text-[#4B5563] border-t border-gray-100">
                          {provision.content}
                          <div className="mt-2">
                            <Link
                              href={`/chapters/rights#article-${provision.article.split(" ")[1]}`}
                              className="text-xs text-[#1EB53A] hover:underline flex items-center"
                            >
                              View in Constitution
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/chapters/rights" className="text-sm text-[#1EB53A] hover:underline">
                    View Bill of Rights
                  </Link>
                </CardFooter>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-[#4B5563]">
                  <p>• Be respectful and constructive in discussions</p>
                  <p>• Cite sources when making factual claims</p>
                  <p>• Focus on constitutional principles, not politics</p>
                  <p>• Report inappropriate content</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/community/guidelines" className="text-sm text-[#1EB53A] hover:underline">
                    Read Full Guidelines
                  </Link>
                </CardFooter>
              </Card>

              {/* Similar Discussions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Similar Discussions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Implementation of socio-economic rights in Kenya",
                    "Healthcare as a constitutional right: Case studies",
                    "County health budgets and constitutional obligations",
                  ].map((title, index) => (
                    <Link href="#" key={index} className="block">
                      <div className="text-sm text-[#374151] hover:text-[#0A7B24]">{title}</div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
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
