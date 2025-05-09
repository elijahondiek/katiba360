"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, BookOpen, Share2, Bookmark, BookmarkCheck, Volume2, Play, Pause } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"

// This would typically come from a database or API
const chapterContent = {
  sovereignty: {
    title: "Sovereignty of the People",
    description:
      "The Constitution of Kenya establishes the sovereignty of the people and the supremacy of the Constitution.",
    originalContent: `
      <h2>Chapter One — Sovereignty of the People and Supremacy of this Constitution</h2>
      
      <h3 id="article-1">1. Sovereignty of the People</h3>
      <p>(1) All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.</p>
      <p>(2) The people may exercise their sovereign power either directly or through their democratically elected representatives.</p>
      
      <h3 id="article-2">2. Supremacy of this Constitution</h3>
      <p>(1) This Constitution is the supreme law of the Republic and binds all persons and all State organs at both levels of government.</p>
      <p>(2) No person may claim or exercise State authority except as authorised under this Constitution.</p>
      <p>(3) The validity or legality of this Constitution is not subject to challenge by or before any court or other State organ.</p>
      <p>(4) Any law, including customary law, that is inconsistent with this Constitution is void to the extent of the inconsistency, and any act or omission in contravention of this Constitution is invalid.</p>
      <p>(5) The general rules of international law shall form part of the law of Kenya.</p>
      <p>(6) Any treaty or convention ratified by Kenya shall form part of the law of Kenya under this Constitution.</p>
      
      <h3 id="article-3">3. Defence of this Constitution</h3>
      <p>(1) Every person has an obligation to respect, uphold and defend this Constitution.</p>
      <p>(2) Any attempt to establish a government otherwise than in compliance with this Constitution is unlawful.</p>
    `,
    simplifiedContent: `
      <h2>Chapter One — Sovereignty of the People and Supremacy of this Constitution</h2>
      
      <h3 id="article-1">1. Sovereignty of the People</h3>
      <p>All power in Kenya belongs to the people. This power can only be used as described in the Constitution.</p>
      <p>People can use their power directly or by electing representatives to act on their behalf.</p>
      
      <h3 id="article-2">2. Supremacy of this Constitution</h3>
      <p>This Constitution is the highest law in Kenya. Everyone, including all government bodies, must follow it.</p>
      <p>No one can claim government authority unless the Constitution allows it.</p>
      <p>No court or government body can challenge whether this Constitution is valid or legal.</p>
      <p>Any law that goes against this Constitution is invalid to the extent that it conflicts. Any action that breaks the Constitution is invalid.</p>
      <p>International law is part of Kenyan law.</p>
      <p>International treaties that Kenya has agreed to are part of Kenyan law under this Constitution.</p>
      
      <h3 id="article-3">3. Defence of this Constitution</h3>
      <p>Everyone has a duty to respect, uphold and defend this Constitution.</p>
      <p>It is illegal to try to form a government in any way that doesn't follow this Constitution.</p>
    `,
    keyTerms: {
      "sovereign power": "The ultimate authority to govern, which resides with the people of Kenya.",
      "supreme law": "The highest law that overrides all other laws when there is a conflict.",
      "State organs": "Official government institutions like the executive, legislature, and judiciary.",
      "customary law": "Traditional practices and norms recognized as law in certain communities.",
      "international law": "Rules that govern relations between countries.",
      treaty: "A formal agreement between countries.",
      ratified: "Officially approved and accepted by a country's government.",
    },
    articles: [
      { number: 1, title: "Sovereignty of the People" },
      { number: 2, title: "Supremacy of this Constitution" },
      { number: 3, title: "Defence of this Constitution" },
      { number: 4, title: "The Republic of Kenya" },
      { number: 5, title: "Territory of Kenya" },
    ],
    relatedChapters: [
      { id: "rights", title: "Bill of Rights" },
      { id: "governance", title: "Governance Structure" },
    ],
  },
  // Other chapters would be defined similarly
}

export default function ChapterDetailPage({ params }: { params: { slug: string } }) {
  const { t } = useLanguage()
  const chapter = chapterContent[params.slug as keyof typeof chapterContent]
  const [isSimplified, setIsSimplified] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioSpeed, setAudioSpeed] = useState(1)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("article-1")

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const sections = contentRef.current.querySelectorAll("h3[id]")
      let currentSection = sections[0]?.id || ""

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100) {
          currentSection = section.id
        }
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle audio playback
  const toggleAudio = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control an actual audio player
  }

  // Process content to add tooltips for key terms
  const processContent = (content: string) => {
    if (!chapter.keyTerms) return content

    let processedContent = content
    Object.entries(chapter.keyTerms).forEach(([term, definition]) => {
      // This is a simplified approach - in a real app, you'd use a more robust HTML parsing method
      const regex = new RegExp(`\\b${term}\\b`, "gi")
      processedContent = processedContent.replace(
        regex,
        `<span class="key-term" data-term="${term}" data-definition="${definition}">${term}</span>`,
      )
    })

    return processedContent
  }

  // Handle bookmark toggle
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real implementation, this would save to user preferences
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0A7B24] mb-4">Chapter Not Found</h1>
          <p className="text-[#6B7280] mb-6">The chapter you're looking for doesn't exist.</p>
          <Link href="/chapters">
            <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">View All Chapters</Button>
          </Link>
        </div>
      </div>
    )
  }

  const content = isSimplified ? chapter.simplifiedContent : chapter.originalContent
  const processedContent = processContent(content)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
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
          <Link href="/chapters" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chapters
          </Link>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar - Section Navigator */}
          <div className="order-2 md:order-1">
            <div className="bg-[#F3F4F6] rounded-xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-[#1EB53A]" />
                <h3 className="font-bold text-lg">In This Chapter</h3>
              </div>

              <ul className="space-y-2 mb-6">
                {chapter.articles.map((article) => (
                  <li key={article.number}>
                    <Link
                      href={`#article-${article.number}`}
                      className={cn(
                        "block p-2 rounded text-[#4B5563] hover:text-[#0A7B24] transition-colors",
                        activeSection === `article-${article.number}`
                          ? "bg-[#E5E7EB] text-[#0A7B24] font-medium"
                          : "hover:bg-[#E5E7EB]",
                      )}
                    >
                      Article {article.number}: {article.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <h3 className="font-bold text-lg mb-4">Tools</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-[#4B5563]" onClick={toggleBookmark}>
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 mr-2 text-[#1EB53A]" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-2" />
                    )}
                    {isBookmarked ? "Saved" : "Save for Later"}
                  </Button>

                  <Button variant="outline" className="w-full justify-start text-[#4B5563]">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm text-[#4B5563]">Simplified Text</span>
                    <Switch
                      checked={isSimplified}
                      onCheckedChange={setIsSimplified}
                      className="data-[state=checked]:bg-[#1EB53A]"
                    />
                  </div>
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

            {/* Audio Player */}
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-8 shadow-sm">
              <div className="flex items-center gap-4">
                <Button onClick={toggleAudio} variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                </Button>

                <div className="flex-grow">
                  <Slider
                    value={[audioProgress]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAudioProgress(value[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                    <span>0:00</span>
                    <span>10:30</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-[#6B7280]" />
                  <select
                    value={audioSpeed}
                    onChange={(e) => setAudioSpeed(Number.parseFloat(e.target.value))}
                    className="bg-transparent text-sm text-[#4B5563] border-none focus:ring-0"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content with Key Term Tooltips */}
            <TooltipProvider>
              <div ref={contentRef} className="prose prose-green max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: processedContent }} className="key-terms-content" />
              </div>
            </TooltipProvider>

            {/* Related Chapters */}
            <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
              <h3 className="text-xl font-bold mb-4">Related Chapters</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {chapter.relatedChapters.map((relatedChapter) => (
                  <Link href={`/chapters/${relatedChapter.id}`} key={relatedChapter.id}>
                    <div className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                      <h4 className="font-bold text-[#0A7B24]">{relatedChapter.title}</h4>
                      <p className="text-sm text-[#6B7280]">Continue your learning journey</p>
                    </div>
                  </Link>
                ))}
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

      {/* Key Terms Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const keyTerms = document.querySelectorAll('.key-term');
            keyTerms.forEach(term => {
              term.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'key-term-tooltip';
                tooltip.textContent = e.target.dataset.definition;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.bottom + 10) + 'px';
              });
              
              term.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.key-term-tooltip');
                if (tooltip) {
                  tooltip.remove();
                }
              });
            });
          });
        `,
        }}
      />

      <style jsx global>{`
        .key-term {
          text-decoration: underline;
          text-decoration-style: dotted;
          text-decoration-color: #1EB53A;
          cursor: help;
          position: relative;
        }
        
        .key-term-tooltip {
          position: fixed;
          background-color: #374151;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          max-width: 300px;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .key-term-tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 16px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid #374151;
        }
      `}</style>
    </div>
  )
}
