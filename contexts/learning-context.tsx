"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for learning paths and modules
export interface LearningModule {
  id: string
  title: string
  description: string
  duration: string // e.g., "15 min"
  level: "beginner" | "intermediate" | "advanced"
  prerequisites: string[]
  completed: boolean
  progress: number // 0-100
  quizScore?: number
  lastAccessed?: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  modules: LearningModule[]
  completed: boolean
  progress: number // 0-100
  certificate?: {
    issued: string
    id: string
  }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedOn?: string
  progress?: number // For in-progress achievements
}

// Define types for scenarios
export interface ScenarioOption {
  id: string
  text: string
  consequence: string
  constitutionalProvisions: string[]
  leadsTo?: string // ID of the next decision point
}

export interface ScenarioDecisionPoint {
  id: string
  situation: string
  context: string
  options: ScenarioOption[]
}

export interface Scenario {
  id: string
  title: string
  description: string
  coverImage: string
  category: string
  completed: boolean
  currentDecisionPoint?: string
  decisionHistory?: {
    decisionPointId: string
    optionId: string
    timestamp: string
  }[]
}

// Define context interface
interface LearningContextType {
  learningPaths: LearningPath[]
  currentPath: LearningPath | null
  currentModule: LearningModule | null
  achievements: Achievement[]
  scenarios: Scenario[]
  currentScenario: Scenario | null

  // Learning path methods
  selectLearningPath: (pathId: string) => void
  selectModule: (moduleId: string) => void
  updateModuleProgress: (moduleId: string, progress: number) => void
  completeModule: (moduleId: string, quizScore?: number) => void
  resetModuleProgress: (moduleId: string) => void

  // Scenario methods
  selectScenario: (scenarioId: string) => void
  makeDecision: (decisionPointId: string, optionId: string) => void
  resetScenario: (scenarioId: string) => void

  // Achievement methods
  getAchievement: (achievementId: string) => Achievement | undefined

  // Stats
  getOverallProgress: () => number
  getRecommendedContent: () => (LearningModule | Scenario)[]
}

// Create context
const LearningContext = createContext<LearningContextType | undefined>(undefined)

// Mock data for learning paths
const mockLearningPaths: LearningPath[] = [
  {
    id: "constitutional-basics",
    title: "Constitutional Basics",
    description: "Learn the fundamental principles and structure of the Kenyan Constitution",
    modules: [
      {
        id: "introduction",
        title: "Introduction to the Constitution",
        description: "Understand what a constitution is and why it matters",
        duration: "15 min",
        level: "beginner",
        prerequisites: [],
        completed: false,
        progress: 0,
      },
      {
        id: "history",
        title: "History of Kenya's Constitution",
        description: "Explore the journey to Kenya's current constitution",
        duration: "20 min",
        level: "beginner",
        prerequisites: ["introduction"],
        completed: false,
        progress: 0,
      },
      {
        id: "structure",
        title: "Structure and Organization",
        description: "Learn how the constitution is organized and its main components",
        duration: "25 min",
        level: "beginner",
        prerequisites: ["introduction"],
        completed: false,
        progress: 0,
      },
      {
        id: "sovereignty",
        title: "Sovereignty and Supremacy",
        description: "Understand the principles of sovereignty and constitutional supremacy",
        duration: "30 min",
        level: "intermediate",
        prerequisites: ["introduction", "structure"],
        completed: false,
        progress: 0,
      },
    ],
    completed: false,
    progress: 0,
  },
  {
    id: "bill-of-rights",
    title: "Bill of Rights",
    description: "Explore the fundamental rights and freedoms protected by the Constitution",
    modules: [
      {
        id: "rights-introduction",
        title: "Introduction to Rights",
        description: "Understand the concept of constitutional rights",
        duration: "20 min",
        level: "beginner",
        prerequisites: [],
        completed: false,
        progress: 0,
      },
      {
        id: "equality-freedom",
        title: "Equality and Freedom from Discrimination",
        description: "Explore Article 27 and its implications",
        duration: "30 min",
        level: "intermediate",
        prerequisites: ["rights-introduction"],
        completed: false,
        progress: 0,
      },
      {
        id: "economic-social",
        title: "Economic and Social Rights",
        description: "Learn about rights to healthcare, education, housing and food",
        duration: "35 min",
        level: "intermediate",
        prerequisites: ["rights-introduction"],
        completed: false,
        progress: 0,
      },
      {
        id: "limitations",
        title: "Limitations of Rights",
        description: "Understand when and how rights can be limited",
        duration: "25 min",
        level: "advanced",
        prerequisites: ["rights-introduction", "equality-freedom", "economic-social"],
        completed: false,
        progress: 0,
      },
    ],
    completed: false,
    progress: 0,
  },
  {
    id: "devolution",
    title: "Devolution and Counties",
    description: "Learn about Kenya's system of devolved government",
    modules: [
      {
        id: "devolution-basics",
        title: "Basics of Devolution",
        description: "Understand the concept and purpose of devolution",
        duration: "25 min",
        level: "beginner",
        prerequisites: [],
        completed: false,
        progress: 0,
      },
      {
        id: "county-governments",
        title: "County Governments",
        description: "Learn about the structure and functions of county governments",
        duration: "30 min",
        level: "intermediate",
        prerequisites: ["devolution-basics"],
        completed: false,
        progress: 0,
      },
      {
        id: "revenue-allocation",
        title: "Revenue Allocation",
        description: "Understand how resources are shared between national and county governments",
        duration: "35 min",
        level: "advanced",
        prerequisites: ["devolution-basics", "county-governments"],
        completed: false,
        progress: 0,
      },
    ],
    completed: false,
    progress: 0,
  },
]

// Mock data for achievements
const mockAchievements: Achievement[] = [
  {
    id: "constitution-explorer",
    title: "Constitution Explorer",
    description: "Complete your first learning module",
    icon: "🔍",
  },
  {
    id: "rights-champion",
    title: "Rights Champion",
    description: "Complete the Bill of Rights learning path",
    icon: "🛡️",
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "🏆",
  },
  {
    id: "scenario-master",
    title: "Scenario Master",
    description: "Complete 5 interactive scenarios",
    icon: "🎭",
    progress: 0,
  },
  {
    id: "devolution-expert",
    title: "Devolution Expert",
    description: "Complete the Devolution learning path",
    icon: "🏛️",
  },
]

// Mock data for scenarios
const mockScenarios: Scenario[] = [
  {
    id: "land-dispute",
    title: "Community Land Dispute",
    description: "Navigate a complex land dispute between a community and a developer",
    coverImage: "/rural-kenyan-landscape.png",
    category: "Land Rights",
    completed: false,
  },
  {
    id: "healthcare-access",
    title: "Healthcare Access Challenge",
    description: "Help a rural family navigate their right to healthcare",
    coverImage: "/kenyan-rural-clinic.png",
    category: "Social Rights",
    completed: false,
  },
  {
    id: "county-budget",
    title: "County Budget Participation",
    description: "Participate in a county's budget-making process",
    coverImage: "/placeholder.svg?key=rd0or",
    category: "Devolution",
    completed: false,
  },
  {
    id: "election-observer",
    title: "Election Observer",
    description: "Observe an election and identify constitutional issues",
    coverImage: "/placeholder.svg?key=he1nu",
    category: "Elections",
    completed: false,
  },
]

// Provider component
export function LearningProvider({ children }: { children: ReactNode }) {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(mockLearningPaths)
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null)
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)

  // Load saved learning data from localStorage on component mount
  useEffect(() => {
    const savedLearningPaths = localStorage.getItem("learning-paths")
    const savedAchievements = localStorage.getItem("achievements")
    const savedScenarios = localStorage.getItem("scenarios")

    if (savedLearningPaths) {
      try {
        setLearningPaths(JSON.parse(savedLearningPaths))
      } catch (error) {
        console.error("Failed to parse saved learning paths", error)
      }
    }

    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements))
      } catch (error) {
        console.error("Failed to parse saved achievements", error)
      }
    }

    if (savedScenarios) {
      try {
        setScenarios(JSON.parse(savedScenarios))
      } catch (error) {
        console.error("Failed to parse saved scenarios", error)
      }
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("learning-paths", JSON.stringify(learningPaths))
  }, [learningPaths])

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }, [achievements])

  useEffect(() => {
    localStorage.setItem("scenarios", JSON.stringify(scenarios))
  }, [scenarios])

  // Check for achievements
  useEffect(() => {
    // Check for Constitution Explorer achievement
    const hasCompletedAnyModule = learningPaths.some((path) => path.modules.some((module) => module.completed))

    if (hasCompletedAnyModule) {
      unlockAchievement("constitution-explorer")
    }

    // Check for Rights Champion achievement
    const billOfRightsPath = learningPaths.find((path) => path.id === "bill-of-rights")
    if (billOfRightsPath?.completed) {
      unlockAchievement("rights-champion")
    }

    // Check for Devolution Expert achievement
    const devolutionPath = learningPaths.find((path) => path.id === "devolution")
    if (devolutionPath?.completed) {
      unlockAchievement("devolution-expert")
    }

    // Check for Perfect Score achievement
    const hasPerfectScore = learningPaths.some((path) => path.modules.some((module) => module.quizScore === 100))

    if (hasPerfectScore) {
      unlockAchievement("perfect-score")
    }

    // Check for Scenario Master achievement
    const completedScenarios = scenarios.filter((scenario) => scenario.completed).length
    if (completedScenarios >= 5) {
      unlockAchievement("scenario-master")
    } else {
      updateAchievementProgress("scenario-master", completedScenarios * 20) // 20% per scenario
    }
  }, [learningPaths, scenarios])

  // Helper function to unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id === achievementId && !achievement.earnedOn) {
          return {
            ...achievement,
            earnedOn: new Date().toISOString(),
            progress: 100,
          }
        }
        return achievement
      }),
    )
  }

  // Helper function to update achievement progress
  const updateAchievementProgress = (achievementId: string, progress: number) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id === achievementId && !achievement.earnedOn) {
          return {
            ...achievement,
            progress,
          }
        }
        return achievement
      }),
    )
  }

  // Select a learning path
  const selectLearningPath = (pathId: string) => {
    const path = learningPaths.find((p) => p.id === pathId) || null
    setCurrentPath(path)
    setCurrentModule(null)
  }

  // Select a module
  const selectModule = (moduleId: string) => {
    if (!currentPath) return

    const module = currentPath.modules.find((m) => m.id === moduleId) || null
    if (module) {
      // Update last accessed timestamp
      setLearningPaths((prev) =>
        prev.map((path) => {
          if (path.id === currentPath.id) {
            return {
              ...path,
              modules: path.modules.map((m) => {
                if (m.id === moduleId) {
                  return {
                    ...m,
                    lastAccessed: new Date().toISOString(),
                  }
                }
                return m
              }),
            }
          }
          return path
        }),
      )
    }
    setCurrentModule(module)
  }

  // Update module progress
  const updateModuleProgress = (moduleId: string, progress: number) => {
    setLearningPaths((prev) =>
      prev.map((path) => {
        const updatedModules = path.modules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              progress,
              lastAccessed: new Date().toISOString(),
            }
          }
          return module
        })

        // Calculate path progress
        const pathProgress = Math.round(
          updatedModules.reduce((sum, module) => sum + module.progress, 0) / updatedModules.length,
        )

        return {
          ...path,
          modules: updatedModules,
          progress: pathProgress,
          completed: pathProgress === 100,
        }
      }),
    )

    // Update current module if it's the one being updated
    if (currentModule?.id === moduleId) {
      setCurrentModule((prev) => (prev ? { ...prev, progress } : null))
    }
  }

  // Complete a module
  const completeModule = (moduleId: string, quizScore?: number) => {
    setLearningPaths((prev) =>
      prev.map((path) => {
        const updatedModules = path.modules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              completed: true,
              progress: 100,
              quizScore,
              lastAccessed: new Date().toISOString(),
            }
          }
          return module
        })

        // Calculate path progress
        const pathProgress = Math.round(
          updatedModules.reduce((sum, module) => sum + (module.completed ? 100 : module.progress), 0) /
            updatedModules.length,
        )

        // Check if path is completed
        const pathCompleted = updatedModules.every((module) => module.completed)

        return {
          ...path,
          modules: updatedModules,
          progress: pathProgress,
          completed: pathCompleted,
          certificate:
            pathCompleted && !path.certificate
              ? {
                  issued: new Date().toISOString(),
                  id: `CERT-${path.id}-${Date.now().toString(36).toUpperCase()}`,
                }
              : path.certificate,
        }
      }),
    )

    // Update current module if it's the one being completed
    if (currentModule?.id === moduleId) {
      setCurrentModule((prev) => (prev ? { ...prev, completed: true, progress: 100, quizScore } : null))
    }
  }

  // Reset module progress
  const resetModuleProgress = (moduleId: string) => {
    setLearningPaths((prev) =>
      prev.map((path) => {
        const updatedModules = path.modules.map((module) => {
          if (module.id === moduleId) {
            return {
              ...module,
              completed: false,
              progress: 0,
              quizScore: undefined,
            }
          }
          return module
        })

        // Recalculate path progress
        const pathProgress = Math.round(
          updatedModules.reduce((sum, module) => sum + (module.completed ? 100 : module.progress), 0) /
            updatedModules.length,
        )

        return {
          ...path,
          modules: updatedModules,
          progress: pathProgress,
          completed: false, // If we're resetting a module, the path can't be complete
        }
      }),
    )

    // Update current module if it's the one being reset
    if (currentModule?.id === moduleId) {
      setCurrentModule((prev) => (prev ? { ...prev, completed: false, progress: 0, quizScore: undefined } : null))
    }
  }

  // Select a scenario
  const selectScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId) || null
    setCurrentScenario(scenario)
  }

  // Make a decision in a scenario
  const makeDecision = (decisionPointId: string, optionId: string) => {
    if (!currentScenario) return

    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === currentScenario.id) {
          const decisionHistory = scenario.decisionHistory || []
          return {
            ...scenario,
            currentDecisionPoint: optionId, // This would normally point to the next decision point
            decisionHistory: [
              ...decisionHistory,
              {
                decisionPointId,
                optionId,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        }
        return scenario
      }),
    )
  }

  // Reset a scenario
  const resetScenario = (scenarioId: string) => {
    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === scenarioId) {
          return {
            ...scenario,
            completed: false,
            currentDecisionPoint: undefined,
            decisionHistory: [],
          }
        }
        return scenario
      }),
    )

    // Update current scenario if it's the one being reset
    if (currentScenario?.id === scenarioId) {
      setCurrentScenario((prev) =>
        prev
          ? {
              ...prev,
              completed: false,
              currentDecisionPoint: undefined,
              decisionHistory: [],
            }
          : null,
      )
    }
  }

  // Get an achievement by ID
  const getAchievement = (achievementId: string) => {
    return achievements.find((a) => a.id === achievementId)
  }

  // Get overall learning progress
  const getOverallProgress = () => {
    if (learningPaths.length === 0) return 0

    const totalProgress = learningPaths.reduce((sum, path) => sum + path.progress, 0)
    return Math.round(totalProgress / learningPaths.length)
  }

  // Get recommended content based on progress
  const getRecommendedContent = () => {
    const recommendations: (LearningModule | Scenario)[] = []

    // Find incomplete modules where prerequisites are met
    learningPaths.forEach((path) => {
      path.modules.forEach((module) => {
        if (!module.completed) {
          const prerequisitesMet = module.prerequisites.every((prereqId) => {
            return path.modules.some((m) => m.id === prereqId && m.completed)
          })

          if (prerequisitesMet) {
            recommendations.push(module)
          }
        }
      })
    })

    // Add incomplete scenarios
    scenarios.forEach((scenario) => {
      if (!scenario.completed) {
        recommendations.push(scenario)
      }
    })

    // Sort by progress (prioritize those already started)
    return recommendations
      .sort((a, b) => {
        // If both have progress, prioritize the one with more progress
        if ("progress" in a && "progress" in b && a.progress > 0 && b.progress > 0) {
          return b.progress - a.progress
        }

        // If only one has progress, prioritize it
        if ("progress" in a && a.progress > 0) return -1
        if ("progress" in b && b.progress > 0) return 1

        // Otherwise, no specific order
        return 0
      })
      .slice(0, 5) // Return top 5 recommendations
  }

  return (
    <LearningContext.Provider
      value={{
        learningPaths,
        currentPath,
        currentModule,
        achievements,
        scenarios,
        currentScenario,
        selectLearningPath,
        selectModule,
        updateModuleProgress,
        completeModule,
        resetModuleProgress,
        selectScenario,
        makeDecision,
        resetScenario,
        getAchievement,
        getOverallProgress,
        getRecommendedContent,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

// Custom hook to use the learning context
export function useLearning() {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider")
  }
  return context
}
