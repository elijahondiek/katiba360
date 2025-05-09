"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Globe,
  BookOpen,
  Eye,
  Sparkles,
  CheckCircle2,
  Shield,
  Download,
  BarChart3,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"
import Confetti from "react-confetti"

// Onboarding steps
const STEPS = ["welcome", "language", "interests", "reading-level", "accessibility", "features", "complete"]

export default function OnboardingPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [readingLevel, setReadingLevel] = useState("simplified")
  const [accessibilityOptions, setAccessibilityOptions] = useState({
    largeText: false,
    highContrast: false,
    screenReader: false,
    reducedMotion: false,
  })
  const [showConfetti, setShowConfetti] = useState(false)

  // Show confetti when reaching the completion step
  useEffect(() => {
    if (currentStep === STEPS.length - 1) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  // Handle interest selection
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const completeOnboarding = () => {
    // In a real app, save all preferences to the user's profile
    router.push("/profile")
  }

  // Calculate progress percentage
  const progressPercentage = Math.round(((currentStep + 1) / STEPS.length) * 100)

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Katiba360 Logo" width={32} height={32} className="h-8 w-auto" />
              <span className="font-bold text-[#0A7B24]">Katiba360</span>
            </div>
            <span className="text-sm text-[#6B7280]">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Welcome Step */}
          {currentStep === 0 && (
            <div className="text-center space-y-6 animate-in fade-in-50 duration-500">
              <div className="mx-auto w-24 h-24 relative mb-4">
                <Image src="/logo.svg" alt="Katiba360 Logo" width={96} height={96} className="w-full h-full" />
                <div className="absolute inset-0 bg-[#1EB53A]/10 rounded-full animate-pulse"></div>
              </div>

              <h1 className="text-3xl font-bold text-[#0A7B24]">Welcome to Katiba360!</h1>
              <p className="text-[#4B5563] max-w-md mx-auto">
                Let's personalize your experience to help you understand Kenya's Constitution in a way that works best
                for you.
              </p>

              <div className="pt-6">
                <Button
                  onClick={nextStep}
                  className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white px-8 py-6 rounded-full text-lg"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-[#6B7280] pt-4">
                This will only take a minute and you can change your preferences anytime.
              </p>
            </div>
          )}

          {/* Language Selection Step */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Globe className="h-8 w-8 text-[#1EB53A]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0A7B24]">Choose Your Language</h1>
                <p className="text-[#4B5563] max-w-md mx-auto mt-2">
                  Select your preferred language for the Katiba360 interface and content.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries({
                  en: { name: "English", flag: "kenya.svg", nativeName: "English" },
                  sw: { name: "Kiswahili", flag: "kenya.svg", nativeName: "Kiswahili" },
                  kik: { name: "Kikuyu", flag: "kenya.svg", nativeName: "Gĩkũyũ" },
                  luo: { name: "Luo", flag: "kenya.svg", nativeName: "Dholuo" },
                  kal: { name: "Kalenjin", flag: "kenya.svg", nativeName: "Kalenjin" },
                  kam: { name: "Kamba", flag: "kenya.svg", nativeName: "Kikamba" },
                }).map(([code, { name, flag, nativeName }]) => (
                  <div
                    key={code}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      language === code
                        ? "border-[#1EB53A] bg-[#1EB53A]/5 shadow-sm"
                        : "border-gray-200 hover:border-[#1EB53A]/50 hover:shadow-sm"
                    }`}
                    onClick={() => setLanguage(code as any)}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={`/flags/${flag}`} alt={`${name} Flag`} width={48} height={48} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-lg text-[#374151]">{nativeName}</p>
                      <p className="text-sm text-[#6B7280]">{name}</p>
                    </div>
                    {language === code && (
                      <div className="bg-[#1EB53A] rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-[#6B7280] text-center mt-4">
                You can change your language preference anytime in settings.
              </p>
            </div>
          )}

          {/* Interests Selection Step */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-[#1EB53A]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0A7B24]">Select Your Interests</h1>
                <p className="text-[#4B5563] max-w-md mx-auto mt-2">
                  Choose topics you're most interested in to personalize your experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "rights", title: "Bill of Rights", description: "Fundamental rights and freedoms" },
                  { id: "governance", title: "Governance", description: "Executive, Legislature, and Judiciary" },
                  { id: "devolution", title: "Devolution", description: "County governments and their powers" },
                  { id: "land", title: "Land & Environment", description: "Land rights and environmental protection" },
                  { id: "finance", title: "Public Finance", description: "Taxation and revenue allocation" },
                  { id: "security", title: "National Security", description: "Security organs and civilian oversight" },
                  { id: "citizenship", title: "Citizenship", description: "Rights and duties of citizens" },
                  {
                    id: "leadership",
                    title: "Leadership & Integrity",
                    description: "Ethical requirements for leaders",
                  },
                ].map((interest) => (
                  <div
                    key={interest.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedInterests.includes(interest.id)
                        ? "border-[#1EB53A] bg-[#1EB53A]/5"
                        : "border-gray-200 hover:border-[#1EB53A]/30"
                    }`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-[#374151]">{interest.title}</h3>
                        <p className="text-sm text-[#6B7280] mt-1">{interest.description}</p>
                      </div>
                      {selectedInterests.includes(interest.id) ? (
                        <div className="bg-[#1EB53A] rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-200"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[#6B7280] text-center">
                Select at least one topic to continue. You can update these later.
              </p>
            </div>
          )}

          {/* Reading Level Step */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-[#1EB53A]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0A7B24]">Choose Your Reading Level</h1>
                <p className="text-[#4B5563] max-w-md mx-auto mt-2">
                  Select how you'd like constitutional content to be presented to you.
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    readingLevel === "simplified"
                      ? "border-[#1EB53A] bg-[#1EB53A]/5"
                      : "border-gray-200 hover:border-[#1EB53A]/30"
                  }`}
                  onClick={() => setReadingLevel("simplified")}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Simplified</h3>
                      <p className="text-sm text-[#6B7280] mt-1">
                        Easy-to-understand language with explanations of complex terms.
                      </p>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        readingLevel === "simplified" ? "bg-[#1EB53A] text-white" : "border-2 border-gray-200"
                      }`}
                    >
                      {readingLevel === "simplified" && <Check className="h-4 w-4" />}
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-white rounded border border-gray-100">
                    <p className="text-sm text-[#4B5563]">
                      <span className="font-medium">Example:</span> All power in Kenya belongs to the people. This power
                      can only be used as described in the Constitution.
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    readingLevel === "standard"
                      ? "border-[#1EB53A] bg-[#1EB53A]/5"
                      : "border-gray-200 hover:border-[#1EB53A]/30"
                  }`}
                  onClick={() => setReadingLevel("standard")}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Standard</h3>
                      <p className="text-sm text-[#6B7280] mt-1">
                        Original text with some clarifications where needed.
                      </p>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        readingLevel === "standard" ? "bg-[#1EB53A] text-white" : "border-2 border-gray-200"
                      }`}
                    >
                      {readingLevel === "standard" && <Check className="h-4 w-4" />}
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-white rounded border border-gray-100">
                    <p className="text-sm text-[#4B5563]">
                      <span className="font-medium">Example:</span> All sovereign power belongs to the people of Kenya
                      and shall be exercised only in accordance with this Constitution.
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    readingLevel === "advanced"
                      ? "border-[#1EB53A] bg-[#1EB53A]/5"
                      : "border-gray-200 hover:border-[#1EB53A]/30"
                  }`}
                  onClick={() => setReadingLevel("advanced")}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Advanced (Legal Terminology)</h3>
                      <p className="text-sm text-[#6B7280] mt-1">
                        Full legal language with technical terms and references.
                      </p>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        readingLevel === "advanced" ? "bg-[#1EB53A] text-white" : "border-2 border-gray-200"
                      }`}
                    >
                      {readingLevel === "advanced" && <Check className="h-4 w-4" />}
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-white rounded border border-gray-100">
                    <p className="text-sm text-[#4B5563]">
                      <span className="font-medium">Example:</span> All sovereign power is vested in the citizenry of
                      the Republic of Kenya and shall be exercised solely in accordance with the provisions set forth in
                      this Constitution.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#6B7280] text-center">
                You can switch between reading levels at any time while using Katiba360.
              </p>
            </div>
          )}

          {/* Accessibility Needs Step */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Eye className="h-8 w-8 text-[#1EB53A]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0A7B24]">Accessibility Preferences</h1>
                <p className="text-[#4B5563] max-w-md mx-auto mt-2">
                  Customize your experience to meet your accessibility needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Larger Text</h3>
                      <p className="text-sm text-[#6B7280] mt-1">
                        Increase the size of text throughout the application.
                      </p>
                    </div>
                    <Switch
                      checked={accessibilityOptions.largeText}
                      onCheckedChange={(checked) =>
                        setAccessibilityOptions({ ...accessibilityOptions, largeText: checked })
                      }
                      className="data-[state=checked]:bg-[#1EB53A]"
                    />
                  </div>

                  <div className="mt-3 p-3 bg-white rounded border border-gray-100">
                    <p className={`text-[#4B5563] ${accessibilityOptions.largeText ? "text-lg" : "text-sm"}`}>
                      This is how text will appear throughout the application.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">High Contrast Mode</h3>
                      <p className="text-sm text-[#6B7280] mt-1">Increase contrast for better readability.</p>
                    </div>
                    <Switch
                      checked={accessibilityOptions.highContrast}
                      onCheckedChange={(checked) =>
                        setAccessibilityOptions({ ...accessibilityOptions, highContrast: checked })
                      }
                      className="data-[state=checked]:bg-[#1EB53A]"
                    />
                  </div>

                  <div
                    className={`mt-3 p-3 rounded border ${
                      accessibilityOptions.highContrast
                        ? "bg-black text-white border-white"
                        : "bg-white border-gray-100 text-[#4B5563]"
                    }`}
                  >
                    <p className={accessibilityOptions.largeText ? "text-lg" : "text-sm"}>
                      This is how content will appear with high contrast mode.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Screen Reader Support</h3>
                      <p className="text-sm text-[#6B7280] mt-1">Optimize content for screen readers.</p>
                    </div>
                    <Switch
                      checked={accessibilityOptions.screenReader}
                      onCheckedChange={(checked) =>
                        setAccessibilityOptions({ ...accessibilityOptions, screenReader: checked })
                      }
                      className="data-[state=checked]:bg-[#1EB53A]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#374151]">Reduce Animations</h3>
                      <p className="text-sm text-[#6B7280] mt-1">Minimize motion for a more comfortable experience.</p>
                    </div>
                    <Switch
                      checked={accessibilityOptions.reducedMotion}
                      onCheckedChange={(checked) =>
                        setAccessibilityOptions({ ...accessibilityOptions, reducedMotion: checked })
                      }
                      className="data-[state=checked]:bg-[#1EB53A]"
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#6B7280] text-center">
                These settings can be adjusted anytime in your profile settings.
              </p>
            </div>
          )}

          {/* Feature Tour Step */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <div className="bg-[#1EB53A]/10 p-3 rounded-full w-fit mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-[#1EB53A]" />
                </div>
                <h1 className="text-2xl font-bold text-[#0A7B24]">Key Features</h1>
                <p className="text-[#4B5563] max-w-md mx-auto mt-2">
                  Here are some of the key features that will help you explore the constitution.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Interactive Chapters",
                    description:
                      "Explore constitutional chapters with interactive elements and simplified explanations.",
                    icon: <BookOpen className="h-5 w-5 text-[#1EB53A]" />,
                  },
                  {
                    title: "Rights Navigator",
                    description: "Easily browse and understand your constitutional rights with practical examples.",
                    icon: <Shield className="h-5 w-5 text-[#1EB53A]" />,
                  },
                  {
                    title: "Offline Access",
                    description: "Download content for offline reading when you don't have internet access.",
                    icon: <Download className="h-5 w-5 text-[#1EB53A]" />,
                  },
                  {
                    title: "Personalized Dashboard",
                    description: "Track your progress and get recommendations based on your interests.",
                    icon: <BarChart3 className="h-5 w-5 text-[#1EB53A]" />,
                  },
                  {
                    title: "Achievement System",
                    description: "Earn achievements as you explore and learn about the constitution.",
                    icon: <Award className="h-5 w-5 text-[#1EB53A]" />,
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="bg-[#1EB53A]/10 p-2 rounded-full">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#374151]">{feature.title}</h3>
                      <p className="text-sm text-[#6B7280] mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Step */}
          {currentStep === 6 && (
            <div className="text-center space-y-6 animate-in fade-in-50 duration-500">
              {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

              <div className="mx-auto w-24 h-24 relative mb-4">
                <div className="absolute inset-0 bg-[#1EB53A]/20 rounded-full animate-ping"></div>
                <div className="relative bg-[#1EB53A] rounded-full p-6">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-[#0A7B24]">You're All Set!</h1>
              <p className="text-[#4B5563] max-w-md mx-auto">
                Your Katiba360 experience has been personalized based on your preferences. You're ready to start
                exploring Kenya's Constitution!
              </p>

              <div className="pt-6">
                <Button
                  onClick={completeOnboarding}
                  className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white px-8 py-6 rounded-full text-lg"
                >
                  Start Exploring
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-[#6B7280] pt-4">
                You can adjust your preferences anytime in your profile settings.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep > 0 && currentStep < STEPS.length - 1 && (
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={nextStep}
                className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                disabled={
                  currentStep === 2 && selectedInterests.length === 0 // Disable if no interests selected
                }
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
