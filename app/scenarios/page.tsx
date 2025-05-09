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
  MapPin,
  Download,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Lock,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

// Scenario categories
const categories = [
  {
    id: "arrest",
    title: "Know Your Rights During Arrest",
    description: "Learn about your constitutional rights when interacting with law enforcement.",
    icon: <Gavel className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
  {
    id: "property",
    title: "Property Rights & Land Ownership",
    description: "Understand constitutional protections for property and land rights in Kenya.",
    icon: <Landmark className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "services",
    title: "Accessing Government Services",
    description: "Know your rights when dealing with government offices and services.",
    icon: <FileText className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
  {
    id: "workplace",
    title: "Workplace Rights",
    description: "Explore your constitutional rights in employment and labor relations.",
    icon: <Users className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "healthcare",
    title: "Healthcare Rights",
    description: "Learn about your right to healthcare and medical services in Kenya.",
    icon: <Shield className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "education",
    title: "Education Rights",
    description: "Understand constitutional provisions for education in Kenya.",
    icon: <Scale className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
]

// Mock scenario steps for arrest process
const arrestScenarioSteps = [
  {
    id: "step-1",
    title: "During Arrest",
    content: `
      <h3>Your Rights During Arrest</h3>
      <p>When being arrested, you have the following constitutional rights:</p>
      <ul>
        <li>To be informed promptly, in a language you understand, of the reason for arrest</li>
        <li>To remain silent and not be compelled to make any confession or admission</li>
        <li>To communicate with an advocate and other persons whose assistance is necessary</li>
        <li>Not to be subjected to torture or cruel, inhuman, or degrading treatment</li>
      </ul>
    `,
    provisions: [
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)",
        content:
          "An arrested person has the right to be informed promptly, in language that the person understands, of the reason for the arrest, the right to remain silent, and the consequences of not remaining silent.",
      },
      {
        title: "Freedom from Torture",
        article: "Article 29(d)",
        content:
          "Every person has the right to freedom from torture and cruel, inhuman or degrading treatment or punishment.",
      },
    ],
  },
  {
    id: "step-2",
    title: "Police Custody",
    content: `
      <h3>Your Rights in Police Custody</h3>
      <p>While in police custody, you have the following rights:</p>
      <ul>
        <li>To be held in conditions that respect human dignity</li>
        <li>To be brought before a court within 24 hours</li>
        <li>To be released on bond or bail on reasonable conditions</li>
        <li>To access medical treatment if needed</li>
      </ul>
    `,
    provisions: [
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)(f)",
        content:
          "An arrested person has the right to be brought before a court as soon as reasonably possible, but not later than twenty-four hours after being arrested.",
      },
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)(h)",
        content:
          "An arrested person has the right to be released on bond or bail, on reasonable conditions, pending a charge or trial, unless there are compelling reasons not to be released.",
      },
    ],
  },
  {
    id: "step-3",
    title: "Court Appearance",
    content: `
      <h3>Your Rights During Court Appearance</h3>
      <p>When brought before a court, you have the following rights:</p>
      <ul>
        <li>To be informed of the charges against you</li>
        <li>To have legal representation (if you cannot afford one, the State should provide)</li>
        <li>To a fair and public hearing</li>
        <li>To be presumed innocent until proven guilty</li>
      </ul>
    `,
    provisions: [
      {
        title: "Fair Hearing",
        article: "Article 50(2)",
        content:
          "Every accused person has the right to a fair trial, which includes the right to be presumed innocent until the contrary is proved.",
      },
      {
        title: "Legal Representation",
        article: "Article 50(2)(g)",
        content:
          "Every accused person has the right to choose, and be represented by, an advocate, and to be informed of this right promptly.",
      },
    ],
  },
  {
    id: "step-4",
    title: "Next Steps",
    content: `
      <h3>What to Do If Your Rights Are Violated</h3>
      <p>If your rights have been violated during the arrest process, you can:</p>
      <ul>
        <li>File a complaint with the Independent Policing Oversight Authority (IPOA)</li>
        <li>Seek legal assistance from the Kenya National Commission on Human Rights</li>
        <li>File a constitutional petition in the High Court</li>
        <li>Contact a human rights organization for support</li>
      </ul>
    `,
    provisions: [
      {
        title: "Enforcement of Rights",
        article: "Article 22",
        content:
          "Every person has the right to institute court proceedings claiming that a right or fundamental freedom in the Bill of Rights has been denied, violated or infringed, or is threatened.",
      },
    ],
  },
]

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [expandedProvisions, setExpandedProvisions] = useState<string[]>([])

  // Toggle provision expansion
  const toggleProvision = (provisionId: string) => {
    setExpandedProvisions((prev) =>
      prev.includes(provisionId) ? prev.filter((id) => id !== provisionId) : [...prev, provisionId],
    )
  }

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!selectedCategory) return 0
    return Math.round(((currentStep + 1) / arrestScenarioSteps.length) * 100)
  }

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < arrestScenarioSteps.length - 1) {
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
    setSelectedCategory(null)
    setCurrentStep(0)
    setExpandedProvisions([])
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
        {!selectedCategory ? (
          // Category Selection View
          <div className="max-w-5xl mx-auto">
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
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.popular && (
                    <div className="absolute top-4 right-4 bg-[#CE1126] text-white text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mb-4">{category.icon}</div>
                  <h2 className="text-xl font-bold mb-2 text-[#0A7B24]">{category.title}</h2>
                  <p className="text-[#4B5563]">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Scenario Steps View
          <div className="max-w-4xl mx-auto">
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
                  Step {currentStep + 1} of {arrestScenarioSteps.length}
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
              <h2 className="text-xl font-bold text-[#0A7B24] mb-4">{arrestScenarioSteps[currentStep].title}</h2>
              <div
                className="prose prose-green max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: arrestScenarioSteps[currentStep].content }}
              />

              {/* Constitutional Provisions */}
              {arrestScenarioSteps[currentStep].provisions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                  <h3 className="font-bold text-lg mb-4">Relevant Constitutional Provisions</h3>
                  <div className="space-y-4">
                    {arrestScenarioSteps[currentStep].provisions.map((provision, index) => (
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
                disabled={currentStep === arrestScenarioSteps.length - 1}
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
