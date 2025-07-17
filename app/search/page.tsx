"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
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
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter } from "next/navigation"
import { useSearchPage, FilterCategory } from "@/hooks/useSearchPage"
import { chapterCategoryMap, chapterCategories } from "../chapters/chapterCategoryMap"
import { chapterIconMap } from "../chapters/chapterIconMap"

// Filter categories
const filterCategories: FilterCategory[] = [
  {
    name: "Content Type",
    options: [
      { id: "chapters", label: "Chapters" },
      { id: "rights", label: "Rights" },
      { id: "scenarios", label: "Scenarios" },
    ],
  },
  {
    name: "Categories",
    options: chapterCategories
      .filter(category => category !== "All") // Exclude "All" from filters
      .map(category => ({
        id: category.toLowerCase(),
        label: category
      })),
  },
  {
    name: "Chapters",
    options: Object.entries(chapterIconMap).map(([number, _]) => {
      const chapterNum = parseInt(number, 10);
      let chapterTitle = "";
      
      // Get chapter titles from the chapters data if available
      switch (chapterNum) {
        case 1: chapterTitle = "Sovereignty"; break;
        case 2: chapterTitle = "Republic"; break;
        case 3: chapterTitle = "Citizenship"; break;
        case 4: chapterTitle = "Bill of Rights"; break;
        case 5: chapterTitle = "Land and Environment"; break;
        case 6: chapterTitle = "Leadership and Integrity"; break;
        case 7: chapterTitle = "Representation of the People"; break;
        case 8: chapterTitle = "Legislature"; break;
        case 9: chapterTitle = "Executive"; break;
        case 10: chapterTitle = "Judiciary"; break;
        case 11: chapterTitle = "Devolved Government"; break;
        case 12: chapterTitle = "Public Finance"; break;
        case 13: chapterTitle = "Public Service"; break;
        case 14: chapterTitle = "National Security"; break;
        case 15: chapterTitle = "Commissions & Independent Offices"; break;
        case 16: chapterTitle = "Amendment of Constitution"; break;
        case 17: chapterTitle = "General Provisions"; break;
        case 18: chapterTitle = "Transitional Provisions"; break;
        default: chapterTitle = `Chapter ${chapterNum}`;
      }
      
      return {
        id: `chapter-${chapterNum}`,
        label: `Chapter ${chapterNum}: ${chapterTitle}`,
      };
    }),
  },
  {
    name: "Popular Articles",
    options: [
      { id: "article-19", label: "Article 19: Rights & Freedoms" },
      { id: "article-27", label: "Article 27: Equality & Freedom from Discrimination" },
      { id: "article-43", label: "Article 43: Economic & Social Rights" },
      { id: "article-47", label: "Article 47: Fair Administrative Action" },
      { id: "article-50", label: "Article 50: Fair Hearing" },
    ],
  },
];

// Similar questions suggestions
const similarQuestions = [
  "What are my rights during police arrest?",
  "How is the President elected in Kenya?",
  "What does the Constitution say about land ownership?",
  "How are counties governed under devolution?",
  "What are the requirements to be a judge in Kenya?",
  "How can I petition Parliament according to the Constitution?",
]


export default function SearchPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [refreshSearch, setRefreshSearch] = useState(false)

  // Use our custom search hook with real API integration
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results,
    isLoading,
    error,
    totalResults,
    activeFilters,
    toggleFilter,
    resetSearch,
  } = useSearchPage({
    debounceMs: 2000,
    resultsPerPage: 10,
    highlight: true,
  })

  // Set initial query from URL params
  useEffect(() => {
    if (query) {
      setSearchQuery(query)
    }
  }, [query, setSearchQuery])

  // Track expanded results
  const [expandedResults, setExpandedResults] = useState<string[]>([])
  
  // Track filter collapse state on mobile
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true)

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Toggle result expansion
  const toggleResultExpansion = (id: string) => {
    setExpandedResults(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Get icon based on result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case "chapter":
      case "article":
      case "clause":
      case "right":
        return <Shield className="h-5 w-5 text-[#1EB53A]" />
      case "scenario":
        return <Gavel className="h-5 w-5 text-[#1EB53A]" />
      default:
        return <BookOpen className="h-5 w-5 text-[#1EB53A]" />
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-[#0A7B24] mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Search the Constitution"}
          </h1>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
                <Input
                  type="text"
                  placeholder={t("search.placeholder")}
                  className="pl-10 border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                {t("search.button")}
              </Button>
            </form>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
            {/* Results Area - Show first on mobile */}
            <div className="order-1 lg:order-2 lg:col-span-3">
              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-[#1EB53A] animate-spin mb-4" />
                  <p className="text-[#6B7280]">Searching the constitution...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRefreshSearch(!refreshSearch)}
                          className="inline-flex items-center"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Count */}
              {!isLoading && !error && results.length > 0 && (
                <div className="mb-4 text-[#6B7280]">
                  Found {totalResults} results for "{searchQuery}"
                </div>
              )}

              {/* Results List */}
              {!isLoading && !error && (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#1EB53A] hover:shadow-sm"
                    >
                      {/* Result Header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleResultExpansion(result.id)}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">{getResultIcon(result.type)}</div>
                          <div>
                            <h3 className="font-medium text-[#0A7B24]">{result.title}</h3>
                            {result.chapter && (
                              <p className="text-sm text-[#6B7280]">
                                Chapter {result.chapter.number}: {result.chapter.title}
                              </p>
                            )}
                            {result.highlight && (
                              <div 
                                className="bg-[#1EB53A]/10 px-1 py-0.5 rounded inline-block"
                                dangerouslySetInnerHTML={{ 
                                  __html: result.highlight.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-[#0A7B24]">$1</span>') 
                                }} 
                              />
                            )}
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
              {!isLoading && results.length === 0 && searchQuery && (
                <div className="text-center py-12 border border-[#E5E7EB] rounded-xl bg-white">
                  <div className="bg-[#F3F4F6] rounded-full p-4 inline-flex mb-4">
                    <Search className="h-8 w-8 text-[#6B7280]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#374151] mb-2">No results found</h2>
                  <p className="text-[#6B7280] mb-6">
                    We couldn't find any matches for "{searchQuery}". Try adjusting your search terms.
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

              {/* Empty State - Before Search */}
              {!isLoading && !searchQuery && (
                <div className="text-center py-16 border border-[#E5E7EB] rounded-xl bg-white">
                  <div className="bg-[#F0FFF4] rounded-full p-6 inline-flex mb-6">
                    <Search className="h-12 w-12 text-[#1EB53A]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0A7B24] mb-3">Search the Constitution</h2>
                  <p className="text-[#6B7280] mb-8 max-w-md mx-auto">
                    Find specific articles, rights, chapters, or ask questions about the Kenyan Constitution.
                  </p>
                  
                  {/* Quick Search Suggestions */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-[#374151] mb-4">Popular Searches</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Bill of Rights", "Land ownership", "President powers", "Counties", "Citizenship"].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term)
                            router.push(`/search?q=${encodeURIComponent(term)}`)
                          }}
                          className="px-3 py-1.5 bg-[#F0FFF4] text-[#0A7B24] rounded-full border border-[#1EB53A]/30 hover:bg-[#E6FFEC] transition-colors text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10"
                      onClick={() => router.push("/chapters")}
                    >
                      Browse Chapters
                    </Button>
                    <Button
                      className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                      onClick={() => router.push("/ask")}
                    >
                      Ask a Question
                    </Button>
                  </div>
                </div>
              )}

              {/* Similar Questions Section */}
              {!isLoading && searchQuery && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-[#0A7B24] mb-4">Similar Questions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {similarQuestions.map((question, index) => (
                      <div
                        key={index}
                        className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1EB53A] hover:shadow-sm transition-all cursor-pointer bg-white"
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
              )}
            </div>

            {/* Filters Sidebar - Show after results on mobile */}
            <div className="order-2 lg:order-1 lg:col-span-1">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium text-[#0A7B24]">Filters</h2>
                    {activeFilters.length > 0 && (
                      <span className="bg-[#1EB53A] text-white text-xs px-2 py-1 rounded-full">
                        {activeFilters.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeFilters.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={resetSearch}
                        className="text-[#6B7280] hover:text-[#0A7B24] p-0 h-auto"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                      className="lg:hidden text-[#6B7280] hover:text-[#0A7B24] p-0 h-auto"
                    >
                      {isFilterCollapsed ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className={cn(
                  "space-y-6",
                  "lg:block", // Always show on desktop
                  isFilterCollapsed ? "hidden" : "block" // Toggle on mobile
                )}>
                  {filterCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border-t border-[#E5E7EB] pt-4">
                      <h3 className="text-sm font-medium text-[#374151] mb-2">{category.name}</h3>
                      <div className="space-y-2">
                        {category.options.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <Checkbox
                              id={option.id}
                              checked={activeFilters.includes(option.id)}
                              onCheckedChange={() => toggleFilter(option.id)}
                              className="border-[#D1D5DB] text-[#1EB53A] focus:ring-[#1EB53A]"
                            />
                            <label
                              htmlFor={option.id}
                              className={cn(
                                "ml-2 text-sm cursor-pointer",
                                activeFilters.includes(option.id)
                                  ? "text-[#0A7B24] font-medium"
                                  : "text-[#4B5563]"
                              )}
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
