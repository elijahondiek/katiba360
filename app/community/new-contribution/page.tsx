"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Globe, FileText, Lightbulb, BookOpen, HelpCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

// Contribution types
const contributionTypes = [
  {
    id: "translation",
    title: "Translation",
    description: "Translate constitutional content into local languages",
    icon: <Globe className="h-5 w-5 text-[#1EB53A]" />,
    impact: "High",
    difficulty: "Medium",
    guidelines: [
      "Ensure translations maintain the original meaning",
      "Use standard terminology for the target language",
      "Consider cultural context in your translations",
      "Provide word-for-word translations where possible",
    ],
  },
  {
    id: "examples",
    title: "Real-World Examples",
    description: "Share practical examples of constitutional principles in action",
    icon: <Lightbulb className="h-5 w-5 text-[#1EB53A]" />,
    impact: "High",
    difficulty: "Low",
    guidelines: [
      "Provide specific, real-world scenarios",
      "Explain how the example relates to constitutional principles",
      "Include outcomes or resolutions where applicable",
      "Cite sources for factual claims",
    ],
  },
  {
    id: "simplification",
    title: "Simplified Explanations",
    description: "Create easy-to-understand explanations of complex legal concepts",
    icon: <FileText className="h-5 w-5 text-[#1EB53A]" />,
    impact: "Medium",
    difficulty: "Medium",
    guidelines: [
      "Use plain language accessible to non-lawyers",
      "Break down complex concepts into simpler parts",
      "Include relevant examples to illustrate concepts",
      "Maintain accuracy while simplifying",
    ],
  },
  {
    id: "resources",
    title: "Educational Resources",
    description: "Develop learning materials, quizzes, and activities",
    icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
    impact: "Medium",
    difficulty: "High",
    guidelines: [
      "Design resources for specific age groups or audiences",
      "Include clear learning objectives",
      "Make materials interactive where possible",
      "Ensure factual accuracy and educational value",
    ],
  },
]

export default function NewContributionPage() {
  const { t } = useLanguage()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [contributionTitle, setContributionTitle] = useState("")
  const [contributionContent, setContributionContent] = useState("")
  const [originalText, setOriginalText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("")
  const [category, setCategory] = useState("")
  const [step, setStep] = useState(1)

  // Get selected contribution type
  const selectedContributionType = contributionTypes.find((type) => type.id === selectedType)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the contribution to the server
    console.log("Submitting contribution:", {
      type: selectedType,
      title: contributionTitle,
      content: contributionContent,
      originalText,
      translatedText,
      targetLanguage,
      category,
    })
    // Move to confirmation step
    setStep(3)
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
              Back to Community
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A7B24]">Contribute Knowledge</h1>
            <p className="text-[#4B5563]">
              Share your expertise to help make the constitution more accessible to all Kenyans.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-[#1EB53A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span className={step >= 1 ? "font-medium text-[#0A7B24]" : "text-[#6B7280]"}>Select Type</span>
              </div>
              <div className="h-px w-12 bg-[#E5E7EB]"></div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-[#1EB53A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className={step >= 2 ? "font-medium text-[#0A7B24]" : "text-[#6B7280]"}>Create Content</span>
              </div>
              <div className="h-px w-12 bg-[#E5E7EB]"></div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-[#1EB53A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {step > 3 ? <Check className="h-5 w-5" /> : "3"}
                </div>
                <span className={step >= 3 ? "font-medium text-[#0A7B24]" : "text-[#6B7280]"}>Submit</span>
              </div>
            </div>
          </div>

          {/* Step 1: Select Contribution Type */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-[#0A7B24]">Select Contribution Type</h2>
              <p className="text-[#4B5563]">
                Choose the type of contribution you'd like to make. Each type helps make the constitution more
                accessible in different ways.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributionTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all ${
                      selectedType === type.id
                        ? "border-[#1EB53A] bg-[#1EB53A]/5 shadow-sm"
                        : "hover:border-[#1EB53A]/50 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#1EB53A]/10 p-2 rounded-full mt-1">{type.icon}</div>
                        <div>
                          <CardTitle className="text-lg text-[#0A7B24]">{type.title}</CardTitle>
                          <CardDescription className="mt-1">{type.description}</CardDescription>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedType === type.id ? "border-[#1EB53A] bg-[#1EB53A]" : "border-gray-300"
                        }`}
                      >
                        {selectedType === type.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-2 border-t border-gray-100">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                          <div>
                            Impact: <span className="text-[#0A7B24] font-medium">{type.impact}</span>
                          </div>
                          <div>
                            Difficulty: <span className="text-[#6366F1] font-medium">{type.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                  onClick={() => setStep(2)}
                  disabled={!selectedType}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Create Content */}
          {step === 2 && selectedContributionType && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#1EB53A]/10 p-2 rounded-full">{selectedContributionType.icon}</div>
                <h2 className="text-xl font-medium text-[#0A7B24]">Create {selectedContributionType.title}</h2>
              </div>

              <div className="bg-[#F3F4F6] rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4 w-4 text-[#6B7280]" />
                  <h3 className="font-medium text-[#374151]">Guidelines</h3>
                </div>
                <ul className="space-y-1 text-sm text-[#4B5563]">
                  {selectedContributionType.guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#1EB53A] font-bold">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common fields for all contribution types */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#374151] mb-1">
                      Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title for your contribution"
                      value={contributionTitle}
                      onChange={(e) => setContributionTitle(e.target.value)}
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
                        <SelectItem value="bill-of-rights">Bill of Rights</SelectItem>
                        <SelectItem value="governance">Governance & Leadership</SelectItem>
                        <SelectItem value="devolution">Devolution & Counties</SelectItem>
                        <SelectItem value="judiciary">Judiciary & Justice</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Type-specific fields */}
                {selectedContributionType.id === "translation" && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="target-language" className="block text-sm font-medium text-[#374151] mb-1">
                        Target Language
                      </label>
                      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                        <SelectTrigger className="border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]">
                          <SelectValue placeholder="Select target language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sw">Kiswahili</SelectItem>
                          <SelectItem value="kik">Kikuyu</SelectItem>
                          <SelectItem value="luo">Luo</SelectItem>
                          <SelectItem value="kal">Kalenjin</SelectItem>
                          <SelectItem value="kam">Kamba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="original-text" className="block text-sm font-medium text-[#374151] mb-1">
                        Original Text (English)
                      </label>
                      <Textarea
                        id="original-text"
                        placeholder="Enter the original English text to translate"
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        className="min-h-[100px] border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="translated-text" className="block text-sm font-medium text-[#374151] mb-1">
                        Translated Text
                      </label>
                      <Textarea
                        id="translated-text"
                        placeholder="Enter your translation"
                        value={translatedText}
                        onChange={(e) => setTranslatedText(e.target.value)}
                        className="min-h-[100px] border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                        required
                      />
                    </div>
                  </div>
                )}

                {selectedContributionType.id !== "translation" && (
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-[#374151] mb-1">
                      Content
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Enter your contribution content"
                      value={contributionContent}
                      onChange={(e) => setContributionContent(e.target.value)}
                      className="min-h-[200px] border-gray-200 focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                    Submit Contribution
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-[#1EB53A]/10 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-[#1EB53A]" />
              </div>

              <h2 className="text-xl font-bold text-[#0A7B24]">Contribution Submitted!</h2>

              <p className="text-[#4B5563] max-w-md mx-auto">
                Thank you for your contribution to Katiba360. Your submission will be reviewed by our team and published
                if it meets our guidelines.
              </p>

              <div className="bg-[#F3F4F6] rounded-lg p-4 border border-gray-200 max-w-md mx-auto">
                <h3 className="font-medium text-[#374151] mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-[#4B5563] text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1EB53A] font-bold">1.</span>
                    <span>Our review team will assess your contribution within 2-3 days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1EB53A] font-bold">2.</span>
                    <span>You'll receive a notification when the review is complete.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1EB53A] font-bold">3.</span>
                    <span>If approved, your contribution will be published and you'll earn impact points.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Link href="/community">
                  <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">Return to Community</Button>
                </Link>
              </div>
            </div>
          )}
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
