"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Shield,
  Gavel,
  RefreshCw,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter } from "next/navigation"

// Mock search results data
const mockResults = [
  {
    id: "result-1",
    type: "chapter",
    title: "Sovereignty of the People",
    chapter: "Chapter 1",
    article: "Article 1",
    content:
      "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.",
    highlight: "sovereign power belongs to the people",
    url: "/chapters/sovereignty",
  },
  {
    id: "result-2",
    type: "right",
    title: "Right to Fair Administrative Action",
    chapter: "Chapter 4",
    article: "Article 47",
    content:
      "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.",
    highlight: "right to administrative action",
    url: "/rights/fair-admin",
  },
  {
    id: "result-3",
    type: "chapter",
    title: "The Republic of Kenya",
    chapter: "Chapter 1",
    article: "Article 4",
    content:
      "The Republic of Kenya is a sovereign State with a unitary government based on democratic principles and the separation of powers.",
    highlight: "sovereign State with a unitary government",
    url: "/chapters/sovereignty",
  },
  {
    id: "result-4",
    type: "right",
    title: "Right to Equality and Freedom from Discrimination",
    chapter: "Chapter 4",
    article: "Article 27",
    content: "Every person is equal before the law and has the right to equal protection and equal benefit of the law.",
    highlight: "equal before the law",
    url: "/rights/equality",
  },
  {
    id: "result-5",
    type: "scenario",
    title: "Know Your Rights During Arrest",
    content:
      "Learn about your constitutional rights when interacting with law enforcement, including the right to remain silent and the right to legal representation.",
    highlight: "rights during arrest",
    url: "/scenarios/arrest",
  },
]

// Similar questions suggestions
const similarQuestions = [
  "What are my rights during police arrest?",
  "How is the President elected in Kenya?",
  "What does the Constitution say about land ownership?",
  "How are counties governed under devolution?",
  "What are the requirements to be a judge in Kenya?",
  "How can I petition Parliament according to the Constitution?",
]

// Filter categories
const filterCategories = [
  {
    name: "Content Type",
    options: [
      { id: "chapters", label: "Chapters" },
      { id: "rights", label: "Rights" },
      { id: "scenarios", label: "Scenarios" },
    ],
  },
  {
    name: "Topics",
    options: [
      { id: "governance", label: "Governance" },
      { id: "rights", label: "Rights & Freedoms" },
      { id: "devolution", label: "Devolution" },
      { id: "judiciary", label: "Judiciary" },
      { id: "land", label: "Land & Environment" },
    ],
  },
]

export default function SearchPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState(mockResults)
  const [expandedResults, setExpandedResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Simulate search when query changes
  useEffect(() => {
    if (query) {
      setIsLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        setResults(
          mockResults.filter(
            (result) =>
              result.title.toLowerCase().includes(query.toLowerCase()) ||
              result.content.toLowerCase().includes(query.toLowerCase()),
          ),
        )
        setIsLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [query])

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsLoading(true)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Toggle result expansion
  const toggleResultExpansion = (id: string) => {
    setExpandedResults((prev) => (prev.includes(id) ? prev.filter((resultId) => resultId !== id) : [...prev, id]))
  }

  // Toggle filter selection
  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]))
  }

  // Get icon based on result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case "chapter":
        return <BookOpen className="h-5 w-5 text-[#1EB53A]" />
      case "right":
        return <Shield className="h-5 w-5 text-[#1EB53A]" />
      case "scenario":
        return <Gavel className="h-5 w-5 text-[#1EB53A]" />
      default:
        return <BookOpen className="h-5 w-5 text-[#1EB53A]" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the constitution or ask a question..."
                className="pl-12 py-6 rounded-full border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A] text-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#6B7280]" />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1EB53A] hover:bg-[#0A7B24] text-white rounded-full px-6"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Search Results Section */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar */}
            <div className="order-2 md:order-1">
              <div className="bg-[#F3F4F6] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6B7280] hover:text-[#1EB53A] p-0 h-auto"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <span className="sr-only md:not-sr-only md:inline-block">
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                    {showFilters ? (
                      <ChevronDown className="h-5 w-5 md:ml-1" />
                    ) : (
                      <ChevronRight className="h-5 w-5 md:ml-1" />
                    )}
                  </Button>
                </div>

                <div className={cn("space-y-6", showFilters ? "block" : "hidden md:block")}>
                  {filterCategories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <h3 className="font-medium text-[#374151]">{category.name}</h3>
                      <div className="space-y-2">
                        {category.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={option.id}
                              checked={activeFilters.includes(option.id)}
                              onCheckedChange={() => toggleFilter(option.id)}
                            />
                            <label
                              htmlFor={option.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {activeFilters.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[#CE1126] border-[#CE1126] hover:bg-[#CE1126]/10"
                      onClick={() => setActiveFilters([])}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Refine Search Component */}
              <div className="mt-6 bg-[#F3F4F6] rounded-xl p-6">
                <h2 className="font-bold text-lg mb-4">Refine Your Search</h2>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSearchQuery(`${searchQuery} rights`)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 text-[#1EB53A]" />
                    Add "rights" to your search
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSearchQuery(`${searchQuery} constitution`)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 text-[#1EB53A]" />
                    Add "constitution" to your search
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSearchQuery(`${searchQuery} kenya`)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 text-[#1EB53A]" />
                    Add "kenya" to your search
                  </Button>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div className="order-1 md:order-2">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#0A7B24]">
                  {isLoading ? "Searching..." : `Results for "${query}"`}
                </h1>
                <span className="text-[#6B7280]">{results.length} results</span>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-[#1EB53A] animate-spin mb-4" />
                  <p className="text-[#4B5563]">Searching the constitution...</p>
                </div>
              )}

              {/* Results List */}
              {!isLoading && results.length > 0 && (
                <div className="space-y-6">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className={cn(
                        "border border-[#E5E7EB] rounded-xl overflow-hidden transition-all duration-300",
                        expandedResults.includes(result.id)
                          ? "shadow-md border-[#1EB53A]/50"
                          : "hover:border-[#1EB53A]/30 hover:shadow-sm",
                      )}
                    >
                      {/* Result Header */}
                      <div
                        className="p-4 cursor-pointer flex items-start gap-3"
                        onClick={() => toggleResultExpansion(result.id)}
                      >
                        <div className="bg-[#1EB53A]/10 p-2 rounded-full mt-1">{getResultIcon(result.type)}</div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-[#0A7B24]">{result.title}</h2>
                            {result.chapter && (
                              <span className="text-xs font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded">
                                {result.chapter} {result.article && `• ${result.article}`}
                              </span>
                            )}
                          </div>
                          <p className="text-[#4B5563]">
                            {result.content.substring(0, 120)}
                            {result.content.length > 120 && "..."}
                          </p>
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-[#1EB53A]">Matching: </span>
                            <span className="bg-[#1EB53A]/10 px-1 py-0.5 rounded">{result.highlight}</span>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-[#6B7280] transition-transform duration-300",
                            expandedResults.includes(result.id) ? "transform rotate-180" : "",
                          )}
                        />
                      </div>

                      {/* Expanded Content */}
                      {expandedResults.includes(result.id) && (
                        <div className="p-4 pt-0 border-t border-[#E5E7EB] animate-in slide-in-from-top duration-300">
                          <div className="prose prose-sm max-w-none mb-4">
                            <p className="text-[#374151]">{result.content}</p>
                          </div>
                          <div className="flex justify-end">
                            <Link href={result.url}>
                              <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                                View Full Content
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* No Results State */}
              {!isLoading && results.length === 0 && query && (
                <div className="text-center py-12 border border-[#E5E7EB] rounded-xl">
                  <div className="bg-[#F3F4F6] rounded-full p-4 inline-flex mb-4">
                    <Search className="h-8 w-8 text-[#6B7280]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#374151] mb-2">No results found</h2>
                  <p className="text-[#6B7280] mb-6">
                    We couldn't find any matches for "{query}". Try adjusting your search terms.
                  </p>
                  <Button
                    variant="outline"
                    className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10"
                    onClick={() => router.push("/ask")}
                  >
                    Ask a Direct Question Instead
                  </Button>
                </div>
              )}

              {/* Similar Questions Section */}
              {!isLoading && query && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Similar Questions</h2>
                  <div className="overflow-x-auto pb-4">
                    <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
                      {similarQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1EB53A] hover:shadow-sm transition-all cursor-pointer"
                          style={{ minWidth: "280px" }}
                          onClick={() => {
                            setSearchQuery(question)
                            router.push(`/search?q=${encodeURIComponent(question)}`)
                          }}
                        >
                          <p className="text-[#374151] font-medium">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
