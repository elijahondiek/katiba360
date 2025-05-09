"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  Gavel,
  Users,
  Landmark,
  Scale,
  FileText,
  Globe,
  Search,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"

// Chapter data with additional fields for the new requirements
const chapters = [
  {
    id: "sovereignty",
    title: "Sovereignty of the People",
    description:
      "The Constitution of Kenya establishes the sovereignty of the people and the supremacy of the Constitution.",
    preview:
      "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.",
    icon: <Landmark className="h-6 w-6 text-[#1EB53A]" />,
    category: "Governance",
    articles: 5,
    progress: 75,
    popular: false,
    bookmarked: true,
  },
  {
    id: "rights",
    title: "Bill of Rights",
    description:
      "The Bill of Rights is an integral part of Kenya's democratic state and is the framework for social, economic and cultural policies.",
    preview:
      "The Bill of Rights is an integral part of Kenya's democratic state and is the framework for social, economic and cultural policies.",
    icon: <Shield className="h-6 w-6 text-[#1EB53A]" />,
    category: "Rights",
    articles: 25,
    progress: 30,
    popular: true,
    bookmarked: false,
  },
  {
    id: "governance",
    title: "Governance Structure",
    description:
      "The Constitution establishes the structure of governance in Kenya, including the Executive, Legislature, and Judiciary.",
    preview:
      "The executive authority of the Republic is vested in the President, the Deputy President and the rest of the Cabinet.",
    icon: <Gavel className="h-6 w-6 text-[#1EB53A]" />,
    category: "Governance",
    articles: 18,
    progress: 10,
    popular: true,
    bookmarked: false,
  },
  {
    id: "devolution",
    title: "Devolution",
    description:
      "The Constitution establishes a system of devolved government with 47 counties, each with its own government.",
    preview:
      "County governments established under this Constitution shall reflect democratic principles and the separation of powers.",
    icon: <Users className="h-6 w-6 text-[#1EB53A]" />,
    category: "Governance",
    articles: 12,
    progress: 0,
    popular: false,
    bookmarked: false,
  },
  {
    id: "land",
    title: "Land and Environment",
    description:
      "The Constitution provides for the protection of land rights and sustainable management of the environment.",
    preview:
      "Land in Kenya shall be held, used and managed in a manner that is equitable, efficient, productive and sustainable.",
    icon: <Globe className="h-6 w-6 text-[#1EB53A]" />,
    category: "Land",
    articles: 15,
    progress: 0,
    popular: false,
    bookmarked: false,
  },
  {
    id: "judiciary",
    title: "Judiciary and Justice System",
    description:
      "The Constitution establishes an independent judiciary with the authority to interpret the Constitution and deliver justice.",
    preview:
      "Judicial authority is derived from the people and vests in, and shall be exercised by, the courts and tribunals.",
    icon: <Scale className="h-6 w-6 text-[#1EB53A]" />,
    category: "Justice",
    articles: 20,
    progress: 0,
    popular: false,
    bookmarked: false,
  },
  {
    id: "finance",
    title: "Public Finance",
    description:
      "The Constitution establishes principles for public finance, including taxation and revenue allocation.",
    preview:
      "The public finance system shall promote an equitable society where the burden of taxation is shared fairly.",
    icon: <FileText className="h-6 w-6 text-[#1EB53A]" />,
    category: "Finance",
    articles: 10,
    progress: 0,
    popular: false,
    bookmarked: false,
  },
  {
    id: "security",
    title: "National Security",
    description: "The Constitution provides for national security organs and their civilian oversight.",
    preview:
      "National security shall be pursued in compliance with the law and with the utmost respect for the Constitution.",
    icon: <Shield className="h-6 w-6 text-[#1EB53A]" />,
    category: "Security",
    articles: 8,
    progress: 0,
    popular: false,
    bookmarked: false,
  },
]

// Categories for filter buttons
const categories = ["All", "Governance", "Rights", "Land", "Justice", "Finance", "Security"]

export default function ChaptersPage() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("All")
  const [bookmarkedChapters, setBookmarkedChapters] = useState<string[]>(
    chapters.filter((chapter) => chapter.bookmarked).map((chapter) => chapter.id),
  )

  // Filter chapters based on selected category
  const filteredChapters =
    activeCategory === "All" ? chapters : chapters.filter((chapter) => chapter.category === activeCategory)

  // Toggle bookmark status
  const toggleBookmark = (id: string) => {
    setBookmarkedChapters((prev) => (prev.includes(id) ? prev.filter((chapterId) => chapterId !== id) : [...prev, id]))
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
              <Link href="/chapters" className="text-[#0A7B24] font-medium">
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A7B24] mb-4">Explore the Constitution</h1>
          <p className="text-[#4B5563] mb-8">
            The Constitution of Kenya is organized into chapters that cover different aspects of governance, rights, and
            responsibilities. Explore each chapter to understand the framework that guides our nation.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Input type="text" placeholder="Search chapters..." className="pl-10 py-2 w-full" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  activeCategory === category
                    ? "bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                    : "border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]",
                  "transition-all duration-200",
                )}
                variant={activeCategory === category ? "default" : "outline"}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md flex flex-col h-full relative group"
              >
                {/* Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleBookmark(chapter.id)
                  }}
                  className="absolute top-4 right-4 text-[#6B7280] hover:text-[#1EB53A] transition-all duration-200"
                  aria-label={bookmarkedChapters.includes(chapter.id) ? "Remove bookmark" : "Save for later"}
                >
                  {bookmarkedChapters.includes(chapter.id) ? (
                    <BookmarkCheck className="h-5 w-5 transform transition-transform duration-300 scale-110" />
                  ) : (
                    <Bookmark className="h-5 w-5 transform transition-transform duration-300 group-hover:scale-110" />
                  )}
                </button>

                {/* Popular Tag */}
                {chapter.popular && (
                  <div className="absolute top-4 left-4 bg-[#CE1126] text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Popular</span>
                  </div>
                )}

                <Link href={`/chapters/${chapter.id}`} className="flex flex-col h-full">
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">{chapter.icon}</div>

                  <h2 className="text-xl font-bold mb-2 text-[#0A7B24]">{chapter.title}</h2>

                  <p className="text-[#4B5563] mb-4 flex-grow">{chapter.preview}</p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-sm text-[#6B7280] mb-2">
                      <span>{chapter.articles} Articles</span>
                      <span>{chapter.progress > 0 ? `${chapter.progress}% Complete` : "Not started"}</span>
                    </div>

                    <Progress
                      value={chapter.progress}
                      className="h-2 bg-[#E5E7EB]"
                      indicatorClassName={cn(chapter.progress > 0 ? "bg-[#1EB53A]" : "bg-[#D1D5DB]")}
                    />
                  </div>
                </Link>
              </div>
            ))}
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
