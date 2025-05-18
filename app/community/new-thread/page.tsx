"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, HelpCircle, Send, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

export default function NewThreadPage() {
  const { t } = useLanguage()
  const [threadTitle, setThreadTitle] = useState("")
  const [threadContent, setThreadContent] = useState("")
  const [category, setCategory] = useState("")
  const [agreeToGuidelines, setAgreeToGuidelines] = useState(false)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the thread to the server
    console.log("Submitting thread:", {
      title: threadTitle,
      content: threadContent,
      category,
    })
    // Redirect to the forum page
    window.location.href = "/community"
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
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Link href="/community" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forums
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A7B24]">Start a New Discussion</h1>
            <p className="text-[#4B5563]">Share your questions, insights, or topics related to Kenya's constitution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            {/* Main Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#374151] mb-1">
                    Discussion Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a clear, specific title for your discussion"
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                    className="border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#374151] mb-1">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rights">Bill of Rights</SelectItem>
                      <SelectItem value="governance">Governance & Leadership</SelectItem>
                      <SelectItem value="devolution">Devolution & Counties</SelectItem>
                      <SelectItem value="judiciary">Judiciary & Justice</SelectItem>
                      <SelectItem value="general">General Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-[#374151] mb-1">
                    Discussion Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, questions, or insights in detail..."
                    value={threadContent}
                    onChange={(e) => setThreadContent(e.target.value)}
                    className="min-h-[200px] border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                    required
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    You can use basic formatting: **bold**, *italic*, and [links](url).
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="guidelines"
                    checked={agreeToGuidelines}
                    onCheckedChange={(checked) => setAgreeToGuidelines(checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="guidelines"
                    className="text-sm text-[#4B5563] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to follow the community guidelines and keep discussions respectful and constructive.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white w-full"
                  disabled={!threadTitle || !threadContent || !category || !agreeToGuidelines}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Discussion
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tips */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#1EB53A]" />
                    Tips for Good Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-[#4B5563]">
                  <p>• Be clear and specific in your title</p>
                  <p>• Provide context and background information</p>
                  <p>• Ask focused questions</p>
                  <p>• Cite sources when making factual claims</p>
                  <p>• Be open to different perspectives</p>
                </CardContent>
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
                  <p>• Be respectful and constructive</p>
                  <p>• Focus on constitutional principles, not politics</p>
                  <p>• No hate speech or personal attacks</p>
                  <p>• Respect privacy and confidentiality</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/community/guidelines" className="text-sm text-[#1EB53A] hover:underline">
                    Read Full Guidelines
                  </Link>
                </CardFooter>
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
