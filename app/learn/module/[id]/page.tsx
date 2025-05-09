"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Clock, CheckCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLearning } from "@/contexts/learning-context"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { KnowledgeQuiz } from "@/components/learning/knowledge-quiz"

// Mock module content
const moduleContent = {
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content: `
        <p>The Constitution of Kenya is the supreme law of the Republic of Kenya. It establishes the structure of the Kenyan government, and also defines the relationship between the government and the citizens of Kenya.</p>
        
        <p>The current Constitution was approved by 67% of Kenyan voters in a referendum on August 4, 2010. It was promulgated on August 27, 2010, replacing the previous constitution which had been in place since Kenya's independence in 1963.</p>
        
        <h3>Why Constitutions Matter</h3>
        
        <p>A constitution serves several critical functions in a democratic society:</p>
        
        <ul>
          <li>It establishes the basic structure of government and defines the powers and limitations of each branch</li>
          <li>It protects fundamental rights and freedoms of citizens</li>
          <li>It provides stability and continuity in governance</li>
          <li>It reflects the values, aspirations, and identity of the nation</li>
        </ul>
        
        <p>Understanding the constitution is essential for every citizen to effectively participate in democratic processes and to know their rights and responsibilities.</p>
      `,
    },
    {
      id: "key-principles",
      title: "Key Constitutional Principles",
      content: `
        <p>The Constitution of Kenya is founded on several key principles that guide its interpretation and application:</p>
        
        <h3>Sovereignty of the People</h3>
        
        <p>Article 1 of the Constitution declares that all sovereign power belongs to the people of Kenya. This power can be exercised directly or through democratically elected representatives.</p>
        
        <h3>Supremacy of the Constitution</h3>
        
        <p>The Constitution is the supreme law of Kenya. Any law that is inconsistent with the Constitution is void to the extent of the inconsistency.</p>
        
        <h3>National Values and Principles</h3>
        
        <p>Article 10 outlines national values and principles of governance, including:</p>
        
        <ul>
          <li>Patriotism, national unity, sharing and devolution of power</li>
          <li>Rule of law, democracy, and participation of the people</li>
          <li>Human dignity, equity, social justice, inclusiveness, equality, human rights, non-discrimination, and protection of the marginalized</li>
          <li>Good governance, integrity, transparency, and accountability</li>
          <li>Sustainable development</li>
        </ul>
        
        <p>These principles bind all State organs, State officers, public officers, and all persons whenever they apply or interpret the Constitution.</p>
      `,
    },
    {
      id: "structure",
      title: "Structure of the Constitution",
      content: `
        <p>The Constitution of Kenya is organized into 18 chapters, covering different aspects of governance and rights:</p>
        
        <h3>Chapter 1-2: Sovereignty and Republic</h3>
        
        <p>These chapters establish Kenya as a sovereign republic and define its territory.</p>
        
        <h3>Chapter 3-4: Citizenship and Bill of Rights</h3>
        
        <p>These chapters define who is a Kenyan citizen and outline the fundamental rights and freedoms of individuals.</p>
        
        <h3>Chapter 5-6: Land and Environment, Leadership and Integrity</h3>
        
        <p>These chapters address land rights, environmental protection, and ethical requirements for leadership.</p>
        
        <h3>Chapters 7-10: Representation, Legislature, Executive, and Judiciary</h3>
        
        <p>These chapters establish the electoral system and the three branches of government.</p>
        
        <h3>Chapters 11-12: Devolved Government and Public Finance</h3>
        
        <p>These chapters create the county government system and establish principles for public finance management.</p>
        
        <h3>Chapters 13-18: Public Service, National Security, Commissions, Amendment, General Provisions, and Transitional Provisions</h3>
        
        <p>These chapters cover various aspects of governance, including the public service, security organs, constitutional commissions, and procedures for amending the Constitution.</p>
      `,
    },
  ],
  quiz: [
    {
      id: "q1",
      text: "What is the supreme law of Kenya?",
      options: [
        { id: "q1-a", text: "Acts of Parliament", isCorrect: false },
        { id: "q1-b", text: "The Constitution", isCorrect: true },
        { id: "q1-c", text: "Presidential Decrees", isCorrect: false },
        { id: "q1-d", text: "International Treaties", isCorrect: false },
      ],
      explanation:
        "The Constitution is the supreme law of Kenya. Any law that is inconsistent with the Constitution is void to the extent of the inconsistency.",
    },
    {
      id: "q2",
      text: "According to Article 1 of the Constitution, where does sovereign power belong?",
      options: [
        { id: "q2-a", text: "The President", isCorrect: false },
        { id: "q2-b", text: "Parliament", isCorrect: false },
        { id: "q2-c", text: "The People of Kenya", isCorrect: true },
        { id: "q2-d", text: "The Judiciary", isCorrect: false },
      ],
      explanation:
        "Article 1 of the Constitution declares that all sovereign power belongs to the people of Kenya. This power can be exercised directly or through democratically elected representatives.",
    },
    {
      id: "q3",
      text: "How many chapters does the Constitution of Kenya have?",
      options: [
        { id: "q3-a", text: "10", isCorrect: false },
        { id: "q3-b", text: "15", isCorrect: false },
        { id: "q3-c", text: "18", isCorrect: true },
        { id: "q3-d", text: "20", isCorrect: false },
      ],
      explanation:
        "The Constitution of Kenya is organized into 18 chapters, covering different aspects of governance and rights.",
    },
    {
      id: "q4",
      text: "When was the current Constitution of Kenya promulgated?",
      options: [
        { id: "q4-a", text: "December 12, 1963", isCorrect: false },
        { id: "q4-b", text: "August 27, 2010", isCorrect: true },
        { id: "q4-c", text: "January 1, 2000", isCorrect: false },
        { id: "q4-d", text: "June 1, 2013", isCorrect: false },
      ],
      explanation:
        "The current Constitution was approved by 67% of Kenyan voters in a referendum on August 4, 2010, and was promulgated on August 27, 2010.",
    },
    {
      id: "q5",
      text: "Which of the following is NOT a national value or principle of governance mentioned in Article 10?",
      options: [
        { id: "q5-a", text: "Rule of law", isCorrect: false },
        { id: "q5-b", text: "Human dignity", isCorrect: false },
        { id: "q5-c", text: "Sustainable development", isCorrect: false },
        { id: "q5-d", text: "Centralization of power", isCorrect: true },
      ],
      explanation:
        "Article 10 mentions sharing and devolution of power as a national value, not centralization of power. The other options are all mentioned in Article 10.",
    },
  ],
}

export default function ModuleDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const { learningPaths, currentPath, currentModule, selectLearningPath, selectModule, updateModuleProgress } =
    useLearning()
  const [activeTab, setActiveTab] = useState("content")
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)

  // Find the module and its parent path
  useEffect(() => {
    // Find which path contains this module
    const path = learningPaths.find((p) => p.modules.some((m) => m.id === params.id))

    if (path) {
      selectLearningPath(path.id)
      selectModule(params.id)
    }
  }, [params.id, learningPaths, selectLearningPath, selectModule])

  // Update progress as user navigates through sections
  useEffect(() => {
    if (currentModule && !currentModule.completed) {
      const progress = Math.round(((currentSectionIndex + 1) / moduleContent.sections.length) * 100)
      updateModuleProgress(currentModule.id, progress)
    }
  }, [currentSectionIndex, currentModule, updateModuleProgress])

  if (!currentPath || !currentModule) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading module...</p>
      </div>
    )
  }

  const handleNextSection = () => {
    if (currentSectionIndex < moduleContent.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else {
      // All sections completed, show quiz
      setShowQuiz(true)
      setActiveTab("quiz")
    }
  }

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const currentSection = moduleContent.sections[currentSectionIndex]

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
              <Link href="/learn" className="text-[#0A7B24] font-medium">
                {t("nav.learn")}
              </Link>
              <Link href="/community" className="text-[#374151] hover:text-[#0A7B24] font-medium">
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
            <Link href="/learn" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning
            </Link>
          </div>

          {/* Module Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
                {currentPath.title}
              </Badge>
              <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]">
                {currentModule.level}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-[#0A7B24] mb-2">{currentModule.title}</h1>
            <p className="text-[#4B5563] mb-4">{currentModule.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {currentModule.duration}
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {moduleContent.sections.length} sections
              </div>
              {currentModule.completed && (
                <div className="flex items-center text-[#1EB53A]">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </div>
              )}
            </div>

            {!currentModule.completed && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#6B7280] mb-1">
                  <span>Progress</span>
                  <span>{currentModule.progress}%</span>
                </div>
                <Progress value={currentModule.progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Module Content Tabs */}
          <Tabs defaultValue="content" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content" className="text-sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-sm">
                <Award className="h-4 w-4 mr-2" />
                Knowledge Check
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
              {/* Section Navigation */}
              <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-medium text-[#374151]">Module Sections</h2>
                </div>
                <div className="p-2">
                  {moduleContent.sections.map((section, index) => (
                    <button
                      key={section.id}
                      className={`w-full text-left p-2 rounded-lg text-sm ${
                        index === currentSectionIndex
                          ? "bg-[#1EB53A]/10 text-[#0A7B24] font-medium"
                          : index < currentSectionIndex
                            ? "text-[#1EB53A]"
                            : "text-[#6B7280] hover:bg-[#F3F4F6]"
                      }`}
                      onClick={() => setCurrentSectionIndex(index)}
                    >
                      <div className="flex items-center">
                        {index < currentSectionIndex ? (
                          <CheckCircle className="h-4 w-4 mr-2 text-[#1EB53A]" />
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 ${
                              index === currentSectionIndex ? "bg-[#1EB53A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
                            }`}
                          >
                            {index + 1}
                          </span>
                        )}
                        {section.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Section Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0A7B24]">{currentSection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-green max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentSection.content }}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevSection} disabled={currentSectionIndex === 0}>
                    Previous
                  </Button>
                  <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white" onClick={handleNextSection}>
                    {currentSectionIndex < moduleContent.sections.length - 1 ? "Next" : "Take Quiz"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              {showQuiz ? (
                <KnowledgeQuiz
                  moduleId={currentModule.id}
                  questions={moduleContent.quiz}
                  onComplete={() => {
                    // Navigate back to learning page
                    window.location.href = "/learn"
                  }}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-[#0A7B24]">Knowledge Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="bg-[#F3F4F6] inline-flex items-center justify-center p-4 rounded-full mb-4">
                        <Award className="h-8 w-8 text-[#6B7280]" />
                      </div>
                      <h3 className="text-lg font-medium text-[#374151] mb-2">Complete the module first</h3>
                      <p className="text-[#6B7280] max-w-md mx-auto">
                        You need to go through all the module content before taking the knowledge check quiz.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                      onClick={() => {
                        setActiveTab("content")
                        setCurrentSectionIndex(0)
                      }}
                    >
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
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
