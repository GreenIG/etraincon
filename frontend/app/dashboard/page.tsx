"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Accessibility, Building, Route, Zap, Shield, Wrench, CheckCircle, PlayCircle, Clock, Loader2 } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Curb Ramp & ADA Compliance",
    description: "Master Caltrans and ADA standards for accessible pedestrian route design.",
    icon: Accessibility,
    color: "bg-blue-500",
    available: true,
  },
  {
    id: 2,
    title: "Structural Steel Design",
    description: "Advanced principles of steel structure design and analysis.",
    icon: Building,
    color: "bg-purple-500",
    available: false,
  },
  {
    id: 3,
    title: "Highway Geometric Design",
    description: "Design standards for safe and efficient highway systems.",
    icon: Route,
    color: "bg-green-500",
    available: false,
  },
  {
    id: 4,
    title: "Electrical Systems",
    description: "Power distribution and control systems for infrastructure.",
    icon: Zap,
    color: "bg-yellow-500",
    available: false,
  },
  {
    id: 5,
    title: "Construction Safety",
    description: "OSHA standards and safety protocols for construction sites.",
    icon: Shield,
    color: "bg-red-500",
    available: false,
  },
  {
    id: 6,
    title: "Materials Testing",
    description: "Quality control and testing procedures for construction materials.",
    icon: Wrench,
    color: "bg-indigo-500",
    available: false,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState<(typeof courses)[0] | null>(null)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizType, setQuizType] = useState<"trial" | "final">("trial")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuiz = (course: (typeof courses)[0], type: "trial" | "final") => {
    if (!course.available) return
    setSelectedCourse(course)
    setQuizType(type)
    setShowQuizModal(true)
  }

  const startQuiz = async () => {
    if (!selectedCourse) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Use the local API route to avoid CORS issues
      const response = await fetch(`/api/quiz/generate?course_id=${selectedCourse.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        // Store the quiz data in localStorage for the quiz page to use
        localStorage.setItem('quizData', JSON.stringify({
          courseId: selectedCourse.id,
          quizType: quizType,
          questions: data.quizzes,
          counts: data.counts,
          timestamp: Date.now()
        }))
        
        setShowQuizModal(false)
        router.push(`/quiz/${selectedCourse.id}?type=${quizType}`)
      } else {
        throw new Error(data.message || 'Failed to generate quiz')
      }
    } catch (err) {
      console.error('Quiz generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start quiz. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartCourse = (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    if (!course?.available) return
    router.push(`/course/${courseId}`)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Continue your learning journey and master new skills.</p>
          </div>
        </div>
      </div>

      {/* All Courses Grid */}
      <div className="fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {courses.map((course, index) => (
            <Card 
              key={course.id} 
              className={`hover-lift slide-up h-full ${!course.available ? 'opacity-75' : ''}`} 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${course.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <course.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{course.title}</CardTitle>
                  {!course.available && (
                    <Badge className="bg-gray-100 text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 sm:line-clamp-4 flex-1">{course.description}</p>

                <div className="flex flex-col space-y-2 pt-2">
                  <Button 
                    className={`w-full text-sm sm:text-base ${course.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => handleStartCourse(course.id)}
                    disabled={!course.available}
                  >
                    {course.available ? 'Start Course' : 'Coming Soon'}
                  </Button>

                  <Button
                    variant="outline"
                    className={`w-full text-sm sm:text-base ${course.available ? 'bg-transparent' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    onClick={() => handleQuiz(course, "trial")}
                    disabled={!course.available}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {course.available ? 'Trial Quiz' : 'Coming Soon'}
                  </Button>

                  <Button
                    className={`w-full text-sm sm:text-base ${course.available ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => handleQuiz(course, "final")}
                    disabled={!course.available}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {course.available ? 'Final Exam' : 'Coming Soon'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quiz Instructions Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {quizType === "trial" ? "Trial Quiz" : "Final Exam"}: {selectedCourse?.title}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {quizType === "trial"
                ? "Test your current knowledge with a short assessment."
                : "Complete the comprehensive final exam to earn your certificate."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-sm">
                  This {quizType === "trial" ? "trial quiz contains 10" : "final exam contains 25"} multiple-choice
                  questions.
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-sm">
                  You will have {quizType === "trial" ? "15 minutes" : "45 minutes"} to complete the assessment.
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-sm">
                  {quizType === "trial"
                    ? "Your results will help identify areas for improvement."
                    : "You need 80% or higher to earn your certificate."}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowQuizModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className={`w-full sm:w-auto ${quizType === "trial" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
              onClick={startQuiz}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                `Start ${quizType === "trial" ? "Trial Quiz" : "Final Exam"}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
