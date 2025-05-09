"use client"

import { Search, Filter, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

// This would typically come from a database or API
const rights = [
  {
    id: "equality",
    title: "Right to Equality and Freedom from Discrimination",
    article: "Article 27",
    description:
      "Every person is equal before the law and has the right to equal protection and equal benefit of the law.",
    category: "Civil and Political Rights",
  },
  // Other rights remain the same
]

// Translation mapping for rights
const rightsTranslations = {
  en: rights,
  sw: [
    {
      id: "equality",
      title: "Haki ya Usawa na Uhuru kutoka Ubaguzi",
      article: "Kifungu 27",
      description: "Kila mtu ni sawa mbele ya sheria na ana haki ya ulinzi sawa na faida sawa ya sheria.",
      category: "Haki za Kiraia na Kisiasa",
    },
    // Other rights would be translated similarly
  ],
  // Other languages
}

export default function RightsPage() {
  const { language, t } = useLanguage()

  // Get the appropriate content based on the current language
  const translatedRights = rightsTranslations[language as keyof typeof rightsTranslations] || rights

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Katiba360 Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold text-[#0A7B24]">{t("app.title")}</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/chapters" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.chapters")}
              </Link>
              <Link href="/rights" className="text-[#0A7B24] font-medium">
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A7B24] mb-4">{t("chapter.rights")}</h1>
          <p className="text-[#4B5563] mb-8">
            The Bill of Rights is an integral part of Kenya's democratic state and is the framework for social, economic
            and cultural policies. Explore all the rights guaranteed by the Constitution of Kenya.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Input type="text" placeholder={t("search.placeholder")} className="pl-10 py-2 w-full" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">All Rights</Button>
            <Button variant="outline" className="border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]">
              Civil and Political
            </Button>
            <Button variant="outline" className="border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]">
              Economic and Social
            </Button>
            <Button variant="outline" className="border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]">
              Cultural
            </Button>
          </div>

          {/* Rights List */}
          <div className="space-y-6">
            {translatedRights.map((right) => (
              <Link href={`/rights/${right.id}`} key={right.id}>
                <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1EB53A]/10 p-3 rounded-full">
                      <Shield className="h-5 w-5 text-[#1EB53A]" />
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-[#0A7B24]">{right.title}</h2>
                        <span className="text-sm font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded sm:ml-2">
                          {right.article}
                        </span>
                      </div>
                      <p className="text-[#4B5563] mb-2">{right.description}</p>
                      <span className="text-xs font-medium text-[#6B7280]">{right.category}</span>
                    </div>
                  </div>
                </div>
              </Link>
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
