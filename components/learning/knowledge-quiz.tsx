"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, ArrowRight, Award } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLearning } from "@/contexts/learning-context"
import confetti from "canvas-confetti"

interface Question {
  id: string
  text: string
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string
}

interface KnowledgeQuizProps {
  moduleId: string
  questions: Question[]
  onComplete: () => void
}

export function KnowledgeQuiz({ moduleId, questions, onComplete }: KnowledgeQuizProps) {
  const { completeModule } = useLearning()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = (currentQuestionIndex / totalQuestions) * 100

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return
    setSelectedOption(optionId)
  }

  const handleSubmitAnswer = () => {
    if (!selectedOption) return

    const isCorrect = currentQuestion.options.find((option) => option.id === selectedOption)?.isCorrect || false

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    }

    setIsAnswerSubmitted(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsAnswerSubmitted(false)
    } else {
      // Quiz completed
      const score = Math.round(((correctAnswers + (isCorrectAnswer ? 1 : 0)) / totalQuestions) * 100)
      setQuizCompleted(true)

      // If score is 100%, trigger confetti
      if (score === 100) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }

      // Mark module as completed with the score
      completeModule(moduleId, score)
    }
  }

  const isCorrectAnswer = selectedOption
    ? currentQuestion.options.find((option) => option.id === selectedOption)?.isCorrect || false
    : false

  // If quiz is completed, show the results
  if (quizCompleted) {
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-[#0A7B24]">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#0A7B24]">{finalScore}%</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-[#E5E7EB]"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-[#1EB53A]"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${finalScore * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>

            <p className="text-lg font-medium">
              You got {correctAnswers} out of {totalQuestions} questions correct!
            </p>

            {finalScore >= 80 ? (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center justify-center p-2 bg-[#1EB53A]/10 text-[#0A7B24] rounded-full mb-2">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-[#0A7B24] font-medium">Great job! You've mastered this content.</p>
              </div>
            ) : finalScore >= 60 ? (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center justify-center p-2 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full mb-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <p className="text-[#F59E0B] font-medium">Good work! You've passed the quiz.</p>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center justify-center p-2 bg-[#CE1126]/10 text-[#CE1126] rounded-full mb-2">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <p className="text-[#CE1126] font-medium">You might want to review the material and try again.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white" onClick={onComplete}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#6B7280]">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-[#0A7B24]">
            Score: {correctAnswers} / {totalQuestions}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="text-lg mt-4 text-[#0A7B24]">{currentQuestion.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption || ""} className="space-y-3">
          {currentQuestion.options.map((option) => {
            let optionClass = "border p-4 rounded-lg"

            if (isAnswerSubmitted) {
              if (option.isCorrect) {
                optionClass += " border-[#1EB53A] bg-[#1EB53A]/10"
              } else if (option.id === selectedOption) {
                optionClass += " border-[#CE1126] bg-[#CE1126]/10"
              }
            } else {
              optionClass += " border-gray-200 hover:border-[#1EB53A]/50"
              if (option.id === selectedOption) {
                optionClass += " border-[#1EB53A]"
              }
            }

            return (
              <div key={option.id} className={optionClass} onClick={() => handleOptionSelect(option.id)}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5 mt-1">
                    <RadioGroupItem value={option.id} id={option.id} disabled={isAnswerSubmitted} />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor={option.id}
                      className={`font-medium ${isAnswerSubmitted && option.isCorrect ? "text-[#1EB53A]" : ""}`}
                    >
                      {option.text}
                    </Label>
                  </div>
                  {isAnswerSubmitted && (
                    <div>
                      {option.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-[#1EB53A]" />
                      ) : option.id === selectedOption ? (
                        <XCircle className="h-5 w-5 text-[#CE1126]" />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </RadioGroup>

        {isAnswerSubmitted && (
          <div className="mt-4 p-4 bg-[#F3F4F6] rounded-lg">
            <div className="flex items-start gap-2">
              <div>
                {isCorrectAnswer ? (
                  <CheckCircle className="h-5 w-5 text-[#1EB53A] mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-[#CE1126] mt-0.5" />
                )}
              </div>
              <div>
                <p className={`font-medium ${isCorrectAnswer ? "text-[#1EB53A]" : "text-[#CE1126]"}`}>
                  {isCorrectAnswer ? "Correct!" : "Incorrect"}
                </p>
                <p className="text-[#4B5563] mt-1">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-[#6B7280]">
          <HelpCircle className="h-4 w-4 mr-1" />
          Select an answer and click "Check Answer"
        </div>

        {isAnswerSubmitted ? (
          <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white" onClick={handleNextQuestion}>
            {currentQuestionIndex < totalQuestions - 1 ? (
              <>
                Next Question <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              "Complete Quiz"
            )}
          </Button>
        ) : (
          <Button
            className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
            onClick={handleSubmitAnswer}
            disabled={!selectedOption}
          >
            Check Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
