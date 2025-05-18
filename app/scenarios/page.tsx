"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useScrollToSection } from "@/hooks/useScrollToSection"
import {
  Shield,
  Gavel,
  Users,
  Users2,
  Landmark,
  Scale,
  FileText,
  MapPin,
  Download,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Lock,
  ChevronUp,
  GraduationCap
} from "lucide-react"

// Import scenarios data
import scenariosData from "@/data/scenarios"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"


// Mock resources
const resources = [
  {
    id: "resource-1",
    title: "Know Your Rights Pocket Guide",
    description: "A printable guide to your constitutional rights during arrest and detention.",
    type: "PDF",
    size: "1.2 MB",
    url: "/resources/know-your-rights.pdf",
  },
  {
    id: "resource-2",
    title: "Legal Aid Contact Directory",
    description: "Contact information for legal aid providers across Kenya.",
    type: "PDF",
    size: "0.8 MB",
    url: "/resources/legal-aid-directory.pdf",
  },
  {
    id: "resource-3",
    title: "Constitutional Rights Checklist",
    description: "A checklist to ensure your rights are respected during the arrest process.",
    type: "PDF",
    size: "0.5 MB",
    url: "/resources/rights-checklist.pdf",
  },
]

// Mock assistance providers
const assistanceProviders = [
  {
    id: "provider-1",
    name: "Kenya National Commission on Human Rights",
    address: "CVS Plaza, Lenana Road, Nairobi",
    phone: "+254 20 2717908",
    website: "https://www.knchr.org",
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },
  {
    id: "provider-2",
    name: "Independent Policing Oversight Authority",
    address: "ACK Garden Annex, 1st Ngong Avenue, Nairobi",
    phone: "+254 20 4906000",
    website: "https://www.ipoa.go.ke",
    coordinates: { lat: -1.2898, lng: 36.8185 },
  },
  {
    id: "provider-3",
    name: "Legal Aid Centre of Eldoret",
    address: "Eldoret Town, Uasin Gishu County",
    phone: "+254 53 2033856",
    website: "https://www.lace.or.ke",
    coordinates: { lat: 0.5143, lng: 35.2698 },
  },
]

export default function ScenariosPage() {
  const { t } = useLanguage()
  const { navigateToSection } = useScrollToSection()
  const searchParams = useSearchParams()
  const [showCategorySelection, setShowCategorySelection] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>("arrest")
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedProvisions, setExpandedProvisions] = useState<string[]>([])
  
  // Handle category from URL query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && scenariosData.categories.some(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam)
      setShowCategorySelection(false)
    }
  }, [searchParams])

  // Extract data from imported scenarios
  const { arrestScenarioSteps, protestScenarioSteps, categories } = scenariosData

  // Toggle provision expansion
  const toggleProvision = (provisionId: string) => {
    setExpandedProvisions((prev) =>
      prev.includes(provisionId) ? prev.filter((id) => id !== provisionId) : [...prev, provisionId],
    )
  }

  // Get the current scenario steps based on selected category
  const getCurrentScenarioSteps = () => {
    switch (selectedCategory) {
      case 'arrest':
        return arrestScenarioSteps
      case 'protest':
        return protestScenarioSteps
      case 'property':
        return scenariosData.propertyScenarioSteps
      case 'services':
        return scenariosData.servicesScenarioSteps
      case 'workplace':
        return scenariosData.workplaceScenarioSteps
      case 'healthcare':
        return scenariosData.healthcareScenarioSteps
      case 'education':
        return scenariosData.educationScenarioSteps
      case 'digital':
        return scenariosData.digitalScenarioSteps
      case 'accountability':
        return scenariosData.accountabilityScenarioSteps
      default:
        return arrestScenarioSteps
    }
  }
  
  const currentScenarioSteps = getCurrentScenarioSteps()

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!selectedCategory) return 0
    return Math.round(((currentStep + 1) / currentScenarioSteps.length) * 100)
  }

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < currentScenarioSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Reset scenario
  const resetScenario = () => {
    // Show the category selection view
    setShowCategorySelection(true)
    // Reset other state
    setCurrentStep(0)
    setExpandedProvisions([])
    // Update URL to remove any category parameter
    window.history.pushState({}, '', '/scenarios')
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {showCategorySelection ? (
          // Category Selection View
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A7B24] mb-4">Common Constitutional Scenarios</h1>
            <p className="text-[#4B5563] mb-8">
              Explore practical scenarios to understand how the Constitution of Kenya applies to everyday situations.
              Select a category to learn about your rights and responsibilities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border border-[#E5E7EB] hover:border-[#1EB53A] rounded-xl p-6 transition-all duration-200 hover:shadow-md cursor-pointer relative"
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setShowCategorySelection(false)
                  }}
                >
                  {category.popular && (
                    <div className="absolute top-4 right-4 bg-[#CE1126] text-white text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">
                    {category.id === 'arrest' && <Gavel className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'protest' && <Users2 className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'property' && <Landmark className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'services' && <FileText className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'workplace' && <Users className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'education' && <GraduationCap className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'digital' && <Lock className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'accountability' && <Scale className="h-6 w-6 text-[#1EB53A]" />}
                    {category.id === 'healthcare' && <Shield className="h-6 w-6 text-[#1EB53A]" />}
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-[#0A7B24]">{category.title}</h2>
                  <p className="text-[#4B5563]">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Scenario Steps View
          <div>
            {/* Progress Bar and Navigation */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  className="text-[#6B7280] hover:text-[#0A7B24] p-0 h-auto"
                  onClick={resetScenario}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Categories
                </Button>
                <span className="text-[#6B7280] text-sm">
                  Step {currentStep + 1} of {currentScenarioSteps.length}
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2 bg-[#E5E7EB]" />
            </div>

            {/* Scenario Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0A7B24] mb-2">
                {categories.find((c) => c.id === selectedCategory)?.title}
              </h1>
              <p className="text-[#4B5563]">{categories.find((c) => c.id === selectedCategory)?.description}</p>
            </div>

            {/* Current Step Content */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#0A7B24] mb-4">{currentScenarioSteps[currentStep].title}</h2>
              <div
                className="scenario-content prose prose-green max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: currentScenarioSteps[currentStep].content }}
              />
              
              <style jsx global>{`
                .scenario-content ul {
                  list-style-type: disc;
                  padding-left: 1.5rem;
                  margin: 1.5rem 0;
                }
                .scenario-content li {
                  margin: 0.75rem 0;
                  padding-left: 0.5rem;
                }
                .scenario-content p {
                  margin: 1rem 0;
                }
              `}</style>

              {/* Constitutional Provisions */}
              {currentScenarioSteps[currentStep].provisions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <h3 className="font-bold text-lg mb-4">Relevant Constitutional Provisions</h3>
                  <div className="space-y-4">
                    {currentScenarioSteps[currentStep].provisions.map((provision, index) => (
                      <div key={index} className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                        <div
                          className="p-4 bg-[#F9FAFB] flex items-center justify-between cursor-pointer"
                          onClick={() => toggleProvision(`provision-${index}`)}
                        >
                          <div>
                            <h4 className="font-medium text-[#374151]">{provision.title}</h4>
                            <span className="text-sm text-[#6B7280]">{provision.article}</span>
                          </div>
                          {expandedProvisions.includes(`provision-${index}`) ? (
                            <ChevronUp className="h-5 w-5 text-[#6B7280]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#6B7280]" />
                          )}
                        </div>
                        {expandedProvisions.includes(`provision-${index}`) && (
                          <div className="p-4 border-t border-[#E5E7EB] animate-in slide-in-from-top duration-300">
                            <p className="text-[#4B5563]">{provision.content}</p>
                            {provision.article && (
                              <div className="mt-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10 flex items-center gap-1"
                                  onClick={() => {
                                    // Extract chapter and article numbers from the article string
                                    const articleMatch = provision.article.match(/Article (\d+)/);
                                    if (articleMatch) {
                                      const articleNumber = articleMatch[1];
                                      // Determine chapter based on article number (simplified logic)
                                      let chapterNumber;
                                      if (articleNumber <= 50) chapterNumber = 4;
                                      else if (articleNumber <= 100) chapterNumber = 5;
                                      else if (articleNumber <= 150) chapterNumber = 6;
                                      else if (articleNumber <= 200) chapterNumber = 7;
                                      else chapterNumber = 8;
                                      
                                      navigateToSection(`/chapters/${chapterNumber}#article-${articleNumber}`);
                                    }
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View in Constitution
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step Navigation */}
            <div className="flex justify-between mb-12">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className="border-[#1EB53A] text-[#1EB53A] hover:bg-[#1EB53A]/10"
              >
                Previous Step
              </Button>
              <Button
                onClick={goToNextStep}
                disabled={currentStep === currentScenarioSteps.length - 1}
                className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
              >
                Next Step
              </Button>
            </div>

            {/* Resources Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#0A7B24] mb-6">Downloadable Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-[#E5E7EB] rounded-xl p-6 hover:border-[#1EB53A] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-[#1EB53A]/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-[#1EB53A]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#374151] mb-1">{resource.title}</h3>
                        <p className="text-sm text-[#6B7280] mb-3">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#6B7280]">
                            {resource.type} • {resource.size}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assistance Finder */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A7B24] mb-6">Find Assistance Near You</h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-6">
                {/* Map Placeholder */}
                <div className="h-64 bg-[#F3F4F6] flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Map of Kenya"
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center z-10">
                    <MapPin className="h-8 w-8 text-[#1EB53A] mx-auto mb-2" />
                    <p className="text-[#4B5563]">Map showing assistance providers in Kenya</p>
                    <Button className="mt-4 bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                      <Lock className="h-4 w-4 mr-2" />
                      Enable Location Services
                    </Button>
                  </div>
                </div>
              </div>

              {/* Assistance Providers List */}
              <div className="space-y-4">
                {assistanceProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="border border-[#E5E7EB] rounded-lg p-4 hover:border-[#1EB53A] hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[#374151] mb-1">{provider.name}</h3>
                        <p className="text-sm text-[#6B7280]">{provider.address}</p>
                        <p className="text-sm text-[#6B7280]">{provider.phone}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10"
                          asChild
                        >
                          <Link href={provider.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Website
                          </Link>
                        </Button>
                        <Button size="sm" className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                          <MapPin className="h-3 w-3 mr-1" />
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
