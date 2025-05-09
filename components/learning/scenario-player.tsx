"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, BookOpen, MessageSquare, User, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLearning, type ScenarioDecisionPoint, type ScenarioOption } from "@/contexts/learning-context"
import Image from "next/image"

interface ScenarioPlayerProps {
  scenarioId: string
  decisionPoints: ScenarioDecisionPoint[]
  onComplete: () => void
}

export function ScenarioPlayer({ scenarioId, decisionPoints, onComplete }: ScenarioPlayerProps) {
  const { currentScenario, makeDecision } = useLearning()
  const [currentPointIndex, setCurrentPointIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [decisionHistory, setDecisionHistory] = useState<
    {
      pointId: string
      optionId: string
      option: ScenarioOption
    }[]
  >([])
  const [isCompleted, setIsCompleted] = useState(false)

  const currentPoint = decisionPoints[currentPointIndex]

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId)
  }

  // Handle decision confirmation
  const handleConfirmDecision = () => {
    if (!selectedOption || !currentPoint) return

    // Find the selected option
    const option = currentPoint.options.find((o) => o.id === selectedOption)
    if (!option) return

    // Record the decision
    makeDecision(currentPoint.id, selectedOption)

    // Add to decision history
    setDecisionHistory((prev) => [
      ...prev,
      {
        pointId: currentPoint.id,
        optionId: selectedOption,
        option,
      },
    ])

    // Show feedback
    setShowFeedback(true)
  }

  // Handle next decision point
  const handleNextPoint = () => {
    if (currentPointIndex < decisionPoints.length - 1) {
      setCurrentPointIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      // Scenario completed
      setIsCompleted(true)
    }
  }

  // Render the scenario introduction
  if (currentPointIndex === 0 && !showFeedback && !isCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <div className="relative h-48">
          <Image
            src={currentScenario?.coverImage || "/placeholder.svg"}
            alt={currentScenario?.title || "Scenario"}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-lg" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl font-bold">{currentScenario?.title}</h1>
            <p className="text-sm opacity-90">{currentScenario?.description}</p>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="bg-[#F3F4F6] p-4 rounded-lg">
              <h2 className="font-medium text-[#374151] mb-2">About This Scenario</h2>
              <p className="text-[#4B5563]">
                In this interactive scenario, you will face real-world situations related to Kenya's constitution. Your
                decisions will have consequences, and you'll learn how constitutional principles apply in practice.
              </p>
            </div>

            <div>
              <h2 className="font-medium text-[#374151] mb-2">Instructions</h2>
              <ul className="space-y-2 text-[#4B5563]">
                <li className="flex items-start gap-2">
                  <span className="text-[#1EB53A] font-bold">•</span>
                  <span>Read each situation carefully before making decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1EB53A] font-bold">•</span>
                  <span>Consider the constitutional implications of your choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1EB53A] font-bold">•</span>
                  <span>
                    After each decision, you'll receive feedback and learn about relevant constitutional provisions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1EB53A] font-bold">•</span>
                  <span>
                    There are no strictly right or wrong answers, but some choices align better with constitutional
                    principles
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white" onClick={handleNextPoint}>
            Begin Scenario
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render the scenario completion
  if (isCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-[#0A7B24]">Scenario Completed!</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-[#1EB53A]/10 p-4 rounded-lg text-center">
              <h2 className="font-medium text-[#0A7B24] mb-2">Congratulations!</h2>
              <p className="text-[#4B5563]">
                You've successfully completed the "{currentScenario?.title}" scenario. Let's review your journey and the
                constitutional principles you've explored.
              </p>
            </div>

            <div>
              <h2 className="font-medium text-[#374151] mb-3">Your Decisions</h2>
              <div className="space-y-4">
                {decisionHistory.map((decision, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-[#F3F4F6] p-3 border-b">
                      <p className="font-medium text-[#374151]">
                        Decision {index + 1}: {decisionPoints[index].situation}
                      </p>
                    </div>
                    <div className="p-3">
                      <p className="text-[#4B5563] mb-2">
                        <span className="font-medium">Your choice:</span> {decision.option.text}
                      </p>
                      <p className="text-[#4B5563] text-sm">
                        <span className="font-medium">Outcome:</span> {decision.option.consequence}
                      </p>

                      {decision.option.constitutionalProvisions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-[#6B7280]">Related Constitutional Provisions:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {decision.option.constitutionalProvisions.map((provision, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20 text-xs"
                              >
                                {provision}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F3F4F6] p-4 rounded-lg">
              <h2 className="font-medium text-[#374151] mb-2">Reflection</h2>
              <p className="text-[#4B5563] mb-3">
                Think about how your decisions aligned with constitutional principles. Consider how different choices
                might have led to different outcomes.
              </p>
              <p className="text-[#4B5563]">
                Remember that in real life, constitutional rights and principles often require balancing competing
                interests and considerations.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentPointIndex(0)
              setSelectedOption(null)
              setShowFeedback(false)
              setDecisionHistory([])
              setIsCompleted(false)
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Play Again
          </Button>
          <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white" onClick={onComplete}>
            Complete
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render decision feedback
  if (showFeedback) {
    const selectedOptionData = currentPoint.options.find((o) => o.id === selectedOption)

    if (!selectedOptionData) return null

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg text-[#0A7B24]">Decision Outcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-[#F3F4F6] p-4 rounded-lg">
            <h3 className="font-medium text-[#374151] mb-2">Your Decision</h3>
            <p className="text-[#4B5563]">{selectedOptionData.text}</p>
          </div>

          <div>
            <h3 className="font-medium text-[#374151] mb-2">Consequence</h3>
            <p className="text-[#4B5563]">{selectedOptionData.consequence}</p>
          </div>

          {selectedOptionData.constitutionalProvisions.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#1EB53A]/10 p-3 border-b flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#0A7B24]" />
                <h3 className="font-medium text-[#0A7B24]">Constitutional Connection</h3>
              </div>
              <div className="p-3">
                <p className="text-[#4B5563] mb-2">
                  This situation relates to the following constitutional provisions:
                </p>
                <div className="space-y-2">
                  {selectedOptionData.constitutionalProvisions.map((provision, index) => (
                    <Badge key={index} variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
                      {provision}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-[#F3F4F6] p-3 border-b flex items-center gap-2">
              <Users className="h-4 w-4 text-[#6B7280]" />
              <h3 className="font-medium text-[#374151]">Expert Commentary</h3>
            </div>
            <div className="p-3">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#1EB53A]/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#0A7B24]" />
                </div>
                <div>
                  <p className="font-medium text-[#374151]">Dr. Wanjiku Mwangi</p>
                  <p className="text-xs text-[#6B7280]">Constitutional Law Expert</p>
                </div>
              </div>
              <p className="text-[#4B5563]">
                "This situation highlights the importance of balancing individual rights with community interests. The
                Constitution provides a framework for resolving such tensions through principles of proportionality and
                reasonableness."
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#1EB53A] hover:bg-[#0A7B24] text-white" onClick={handleNextPoint}>
            Continue
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render decision point
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]">
            Scenario {currentPointIndex + 1} of {decisionPoints.length}
          </Badge>
          <Badge variant="outline" className="bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20">
            {currentScenario?.category}
          </Badge>
        </div>
        <CardTitle className="text-lg text-[#0A7B24]">{currentPoint.situation}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-[#F3F4F6] p-4 rounded-lg">
          <p className="text-[#4B5563]">{currentPoint.context}</p>
        </div>

        <div>
          <h3 className="font-medium text-[#374151] mb-3">What will you do?</h3>
          <div className="space-y-3">
            {currentPoint.options.map((option) => (
              <div
                key={option.id}
                className={`
                  border p-4 rounded-lg cursor-pointer transition-all
                  ${selectedOption === option.id ? "border-[#1EB53A] bg-[#1EB53A]/5" : "border-gray-200 hover:border-[#1EB53A]/50"}
                `}
                onClick={() => handleSelectOption(option.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5
                    ${selectedOption === option.id ? "border-[#1EB53A] bg-[#1EB53A]" : "border-gray-300"}
                  `}
                  >
                    {selectedOption === option.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                  <p className={`${selectedOption === option.id ? "text-[#0A7B24] font-medium" : "text-[#374151]"}`}>
                    {option.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F9FAFB] p-4 rounded-lg border border-dashed">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-sm text-[#6B7280]">
                <span className="font-medium">Tip:</span> Consider the constitutional implications of your decision.
                Think about how different stakeholders might be affected.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (currentPointIndex > 0) {
              setCurrentPointIndex((prev) => prev - 1)
              setSelectedOption(null)
              setShowFeedback(false)
              setDecisionHistory((prev) => prev.slice(0, -1))
            }
          }}
          disabled={currentPointIndex === 0 || decisionHistory.length === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button
          className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
          onClick={handleConfirmDecision}
          disabled={!selectedOption}
        >
          Confirm Decision
        </Button>
      </CardFooter>
    </Card>
  )
}
