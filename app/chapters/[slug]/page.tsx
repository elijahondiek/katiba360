"use client"

import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

// This would typically come from a database or API
const chapterContent = {
  sovereignty: {
    title: "Sovereignty of the People",
    description:
      "The Constitution of Kenya establishes the sovereignty of the people and the supremacy of the Constitution.",
    content: `
      <h2>Chapter One — Sovereignty of the People and Supremacy of this Constitution</h2>
      
      <h3>1. Sovereignty of the People</h3>
      <p>All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.</p>
      
      <h3>2. Supremacy of this Constitution</h3>
      <p>This Constitution is the supreme law of the Republic and binds all persons and all State organs at both levels of government.</p>
      <p>No person may claim or exercise State authority except as authorised under this Constitution.</p>
      
      <h3>3. Defence of this Constitution</h3>
      <p>Every person has an obligation to respect, uphold and defend this Constitution.</p>
    `,
    articles: [
      { number: 1, title: "Sovereignty of the People" },
      { number: 2, title: "Supremacy of this Constitution" },
      { number: 3, title: "Defence of this Constitution" },
      { number: 4, title: "The Republic of Kenya" },
      { number: 5, title: "Territory of Kenya" },
    ],
  },
  // Other chapters remain the same
}

// Translation mapping for chapter content
const chapterTranslations = {
  en: {
    sovereignty: chapterContent.sovereignty,
    // Other chapters
  },
  sw: {
    sovereignty: {
      title: "Mamlaka ya Wananchi",
      description: "Katiba ya Kenya inaanzisha mamlaka ya wananchi na ukuu wa Katiba.",
      content: `
        <h2>Sura ya Kwanza — Mamlaka ya Wananchi na Ukuu wa Katiba Hii</h2>
        
        <h3>1. Mamlaka ya Wananchi</h3>
        <p>Mamlaka yote ya utawala yanatoka kwa wananchi wa Kenya na yatatumika tu kwa mujibu wa Katiba hii.</p>
        
        <h3>2. Ukuu wa Katiba Hii</h3>
        <p>Katiba hii ni sheria kuu ya Jamhuri na inawabana watu wote na vyombo vyote vya Serikali katika ngazi zote mbili za serikali.</p>
        <p>Hakuna mtu yeyote anayeweza kudai au kutekeleza mamlaka ya Serikali isipokuwa kama alivyoidhinishwa chini ya Katiba hii.</p>
        
        <h3>3. Ulinzi wa Katiba Hii</h3>
        <p>Kila mtu ana wajibu wa kuheshimu, kushikilia na kulinda Katiba hii.</p>
      `,
      articles: [
        { number: 1, title: "Mamlaka ya Wananchi" },
        { number: 2, title: "Ukuu wa Katiba Hii" },
        { number: 3, title: "Ulinzi wa Katiba Hii" },
        { number: 4, title: "Jamhuri ya Kenya" },
        { number: 5, title: "Eneo la Kenya" },
      ],
    },
    // Other chapters
  },
  // Other languages
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const { language, t } = useLanguage()

  // Get the appropriate content based on the current language
  const translatedContent = chapterTranslations[language as keyof typeof chapterTranslations]
  const chapter = translatedContent
    ? translatedContent[params.slug as keyof typeof translatedContent]
    : chapterContent[params.slug as keyof typeof chapterContent]

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0A7B24] mb-4">Chapter Not Found</h1>
          <p className="text-[#6B7280] mb-6">The chapter you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

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
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("nav.chapters")}
          </Link>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="order-2 md:order-1">
            <div className="bg-[#F3F4F6] rounded-xl p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-[#1EB53A]" />
                <h3 className="font-bold text-lg">In This Chapter</h3>
              </div>

              <ul className="space-y-2">
                {chapter.articles.map((article) => (
                  <li key={article.number}>
                    <Link
                      href={`#article-${article.number}`}
                      className="block p-2 rounded hover:bg-[#E5E7EB] text-[#4B5563] hover:text-[#0A7B24]"
                    >
                      Article {article.number}: {article.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <h3 className="font-bold text-lg mb-4">Tools</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Add Notes
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="order-1 md:order-2">
            <div className="bg-[#1EB53A]/10 rounded-xl p-6 mb-8">
              <h1 className="text-3xl font-bold text-[#0A7B24] mb-2">{chapter.title}</h1>
              <p className="text-[#4B5563]">{chapter.description}</p>
            </div>

            <div className="prose prose-green max-w-none">
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
              <h3 className="text-xl font-bold mb-4">Related Resources</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/learn/sovereignty">
                  <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                    <h4 className="font-bold text-[#0A7B24]">Understanding Sovereignty</h4>
                    <p className="text-sm text-[#6B7280]">Learn more about what sovereignty means in Kenya's context</p>
                  </div>
                </Link>
                <Link href="/cases/sovereignty">
                  <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                    <h4 className="font-bold text-[#0A7B24]">Key Court Cases</h4>
                    <p className="text-sm text-[#6B7280]">Court decisions that have interpreted these provisions</p>
                  </div>
                </Link>
              </div>
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
