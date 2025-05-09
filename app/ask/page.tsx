"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"

// Types for the conversation
type MessageType = "user" | "ai"
type ConfidenceLevel = "high" | "medium" | "low"

interface Source {
  title: string
  chapter: string
  article: string
  url: string
  excerpt: string
}

interface Message {
  id: string
  type: MessageType
  content: string
  timestamp: Date
  confidence?: ConfidenceLevel
  sources?: Source[]
  followUpQuestions?: string[]
}

// Mock initial conversation
const initialConversation: Message[] = [
  {
    id: "welcome",
    type: "ai",
    content:
      "Hello! I'm your Katiba360 assistant. I can help you understand Kenya's Constitution. What would you like to know?",
    timestamp: new Date(),
    confidence: "high",
  },
]

// Mock suggested questions
const suggestedQuestions = [
  "What are my rights if I'm arrested?",
  "How does the Constitution protect land rights?",
  "What powers do county governments have?",
  "How is the President elected?",
  "What does the Constitution say about equality?",
]

export default function AskPage() {
  const { t } = useLanguage()
  const [conversation, setConversation] = useState<Message[]>(initialConversation)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [expandedSources, setExpandedSources] = useState<string[]>([])
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down" | null>>({})
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null)
  const [feedbackComment, setFeedbackComment] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [questionToUse, setQuestionToUse] = useState<string | null>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  useEffect(() => {
    if (questionToUse) {
      setInputValue(questionToUse)
      setQuestionToUse(null) // Reset the question
    }
  }, [questionToUse])

  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setConversation((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response after delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: getMockResponse(inputValue),
        timestamp: new Date(),
        confidence: getMockConfidence(),
        sources: getMockSources(),
        followUpQuestions: getMockFollowUpQuestions(),
      }

      setConversation((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Toggle source expansion
  const toggleSource = (sourceId: string) => {
    setExpandedSources((prev) => (prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]))
  }

  // Handle feedback
  const handleFeedback = (messageId: string, type: "up" | "down") => {
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: type }))
    if (type === "down") {
      setShowFeedbackForm(messageId)
    }
  }

  // Submit feedback
  const submitFeedback = (messageId: string) => {
    // In a real app, this would send the feedback to the server
    console.log(`Feedback for ${messageId}:`, feedbackComment)
    setShowFeedbackForm(null)
    setFeedbackComment("")
  }

  // Use a suggested question
  const useQuestion = useCallback(
    (question: string) => {
      setQuestionToUse(question)
    },
    [setQuestionToUse],
  )

  // Mock response generation (would be replaced with actual AI in production)
  const getMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("arrest")) {
      return "If you are arrested, the Constitution of Kenya provides several rights under Article 49. You have the right to be informed promptly of the reason for arrest, the right to remain silent, the right to communicate with an advocate, and the right not to be compelled to make any confession or admission. You must be brought before a court within 24 hours of arrest."
    } else if (query.toLowerCase().includes("president")) {
      return "According to the Constitution of Kenya, the President is elected by registered voters in a national election. To win, a candidate must receive more than half of all votes cast and at least 25% of votes in more than half of the counties. If no candidate meets these thresholds, a run-off election is held between the top two candidates."
    } else if (query.toLowerCase().includes("land")) {
      return "The Constitution of Kenya addresses land rights in Chapter Five. It classifies land as public, community, or private. It establishes principles of land policy including equitable access, security of land rights, and sustainable management. The Constitution also created the National Land Commission to manage public land on behalf of national and county governments."
    } else {
      return "Based on Kenya's Constitution, your question touches on important constitutional principles. The Constitution establishes Kenya as a sovereign republic with a democratic system of governance. It provides for the separation of powers between the executive, legislative, and judicial branches, and guarantees fundamental rights and freedoms to all citizens."
    }
  }

  const getMockConfidence = (): ConfidenceLevel => {
    const random = Math.random()
    if (random > 0.7) return "high"
    if (random > 0.3) return "medium"
    return "low"
  }

  const getMockSources = (): Source[] => {
    return [
      {
        title: "Rights of Arrested Persons",
        chapter: "Chapter 4",
        article: "Article 49",
        url: "/chapters/rights/article-49",
        excerpt:
          "An arrested person has the right to be informed promptly, in language that the person understands, of the reason for the arrest, the right to remain silent, and the consequences of not remaining silent.",
      },
      {
        title: "Fair Administrative Action",
        chapter: "Chapter 4",
        article: "Article 47",
        url: "/chapters/rights/article-47",
        excerpt:
          "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.",
      },
    ]
  }

  const getMockFollowUpQuestions = (): string[] => {
    return [
      "What happens if my constitutional rights are violated?",
      "Can I appeal a court decision?",
      "What is the role of the Supreme Court?",
    ]
  }

  // Get confidence color
  const getConfidenceColor = (level: ConfidenceLevel): string => {
    switch (level) {
      case "high":
        return "text-[#1EB53A]"
      case "medium":
        return "text-[#F59E0B]"
      case "low":
        return "text-[#CE1126]"
      default:
        return "text-[#1EB53A]"
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
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

          <div className="flex items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
          <h1 className="text-2xl font-bold text-[#0A7B24] mb-6">Ask About the Constitution</h1>

          {/* Conversation Container */}
          <div className="flex-grow bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 mb-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div className="space-y-6">
              {conversation.map((message) => (
                <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.type === "user"
                        ? "bg-[#1EB53A] text-white"
                        : "bg-white border border-[#E5E7EB] shadow-sm",
                    )}
                  >
                    {/* Message Content */}
                    <div className="prose prose-sm max-w-none">
                      <p className={message.type === "user" ? "text-white" : "text-[#374151]"}>{message.content}</p>
                    </div>

                    {/* Confidence Indicator (for AI messages) */}
                    {message.type === "ai" && message.confidence && (
                      <div className="mt-2 flex items-center text-xs">
                        <span className="text-[#6B7280] mr-1">Confidence:</span>
                        <span className={getConfidenceColor(message.confidence)}>
                          {message.confidence.charAt(0).toUpperCase() + message.confidence.slice(1)}
                        </span>
                      </div>
                    )}

                    {/* Sources (for AI messages) */}
                    {message.type === "ai" && message.sources && message.sources.length > 0 && (
                      <div className="mt-3 border-t border-[#E5E7EB] pt-3">
                        <div
                          className="flex items-center text-xs font-medium text-[#6B7280] cursor-pointer hover:text-[#1EB53A]"
                          onClick={() => toggleSource(message.id)}
                        >
                          {expandedSources.includes(message.id) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Hide Sources ({message.sources.length})
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              View Sources ({message.sources.length})
                            </>
                          )}
                        </div>

                        {expandedSources.includes(message.id) && (
                          <div className="mt-2 space-y-2">
                            {message.sources.map((source, index) => (
                              <div key={index} className="bg-[#F3F4F6] rounded p-2 text-xs">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <span className="font-medium text-[#374151]">{source.title}</span>
                                    <span className="text-[#6B7280] ml-2">
                                      {source.chapter} • {source.article}
                                    </span>
                                  </div>
                                  <Link href={source.url} className="text-[#1EB53A] hover:underline flex items-center">
                                    View
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Link>
                                </div>
                                <p className="text-[#4B5563] italic">"{source.excerpt}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Follow-up Questions (for AI messages) */}
                    {message.type === "ai" && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-[#6B7280]">Follow-up Questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.followUpQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10"
                              onClick={() => useQuestion(question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback (for AI messages) */}
                    {message.type === "ai" && message.id !== "welcome" && (
                      <div className="mt-3 border-t border-[#E5E7EB] pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6B7280]">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0",
                                feedbackGiven[message.id] === "up" ? "text-[#1EB53A]" : "text-[#6B7280]",
                              )}
                              onClick={() => handleFeedback(message.id, "up")}
                              disabled={!!feedbackGiven[message.id]}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="sr-only">Yes</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0",
                                feedbackGiven[message.id] === "down" ? "text-[#CE1126]" : "text-[#6B7280]",
                              )}
                              onClick={() => handleFeedback(message.id, "down")}
                              disabled={!!feedbackGiven[message.id]}
                            >
                              <ThumbsDown className="h-4 w-4" />
                              <span className="sr-only">No</span>
                            </Button>
                          </div>
                        </div>

                        {/* Feedback Form */}
                        {showFeedbackForm === message.id && (
                          <div className="mt-2 animate-in slide-in-from-top duration-300">
                            <Textarea
                              placeholder="How can we improve this answer?"
                              value={feedbackComment}
                              onChange={(e) => setFeedbackComment(e.target.value)}
                              className="text-sm resize-none mb-2"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFeedbackForm(null)}
                                className="text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => submitFeedback(message.id)}
                                className="text-xs bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                              >
                                Submit Feedback
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 max-w-[80%] shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#F3F4F6] rounded-full p-1">
                        <RefreshCw className="h-4 w-4 text-[#6B7280] animate-spin" />
                      </div>
                      <span className="text-[#6B7280] text-sm">Katiba360 is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about the Constitution of Kenya..."
              className="resize-none pr-12 py-3 min-h-[100px] border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A] rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              className="absolute right-3 bottom-3 bg-[#1EB53A] hover:bg-[#0A7B24] text-white rounded-full h-9 w-9 p-0"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>

          {/* Suggested Questions */}
          {conversation.length <= 2 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-[#6B7280] mb-3">Suggested Questions:</h2>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10"
                    onClick={() => useQuestion(question)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A7B24] text-white py-8">
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
