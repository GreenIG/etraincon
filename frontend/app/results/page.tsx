"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Target, BookOpen, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

interface QuizResults {
  score: number
  correct: number
  totalScored: number
  totalQuestions: number
  timeUsed: number
  answers: (number | string)[]
  questions: Array<{
    question_type: "multiple_choice" | "open_ended"
    question: string
    options?: string[]
    correct_answer?: string
  }>
  quizType: string
  flaggedQuestions: number[]
  courseId: number
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<QuizResults | null>(null)

  useEffect(() => {
    const storedResults = localStorage.getItem("quizResults")
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      router.push("/dashboard")
    }
  }, [router])

  if (!results) {
    return <div>Loading...</div>
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Separate multiple-choice and open-ended questions
  const multipleChoiceQuestions = results.questions.filter(q => q.question_type === "multiple_choice")
  const openEndedQuestions = results.questions.filter(q => q.question_type === "open_ended")

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-blue-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <p className="text-gray-600">Review your performance and get personalized recommendations.</p>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`${getScoreBg(results.score)} border-2 fade-in hover-lift`}>
            <CardContent className="p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - results.score / 100)}`}
                    className={`${getScoreColor(results.score)} transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(results.score)}`}>
                    {results.score}%
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Score</h3>
              <p className="text-sm text-gray-600">Based on multiple-choice questions</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-2 border-blue-200 fade-in hover-lift" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {results.correct}/{results.totalScored}
              </div>
              <p className="text-sm text-gray-600">Multiple-Choice Correct</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-2 border-purple-200 fade-in hover-lift" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {openEndedQuestions.length}
              </div>
              <p className="text-sm text-gray-600">Open-Ended Questions</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-2 border-orange-200 fade-in hover-lift" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(results.timeUsed)}
              </div>
              <p className="text-sm text-gray-600">Time Used</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Multiple Choice Results */}
          <Card className="fade-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>Multiple Choice Questions</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {results.correct}/{results.totalScored} Correct
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {multipleChoiceQuestions.map((question, index) => {
                  const userAnswer = results.answers[index]
                  const isCorrect = userAnswer !== undefined && userAnswer !== null && userAnswer !== ""
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                      {question.options && (
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`text-sm p-2 rounded ${
                                userAnswer === optIndex 
                                  ? (isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                                  : 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              {option}
                              {userAnswer === optIndex && ' (Your answer)'}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Open Ended Results */}
          <Card className="fade-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span>Open-Ended Questions</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {openEndedQuestions.length} Questions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {openEndedQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600">No open-ended questions in this quiz.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {openEndedQuestions.map((question, index) => {
                    const questionIndex = results.questions.findIndex(q => q.question === question.question)
                    const userAnswer = results.answers[questionIndex]
                    
                    return (
                      <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <p className="font-medium text-gray-900 mb-3">{question.question}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
                            {userAnswer && typeof userAnswer === 'string' && userAnswer.trim() !== '' ? (
                              <div className="p-3 bg-white rounded border text-sm text-gray-800">
                                {userAnswer}
                              </div>
                            ) : (
                              <div className="p-3 bg-yellow-50 rounded border border-yellow-200 text-sm text-yellow-800">
                                No answer provided
                              </div>
                            )}
                          </div>
                          <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> This question will be reviewed manually by an instructor.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        <Card className="mb-8 fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Personalized Recommendations & Review</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openEndedQuestions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect Score!</h3>
                <p className="text-gray-600">You answered all questions correctly. Great job!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {openEndedQuestions.map((question, index) => (
                  <Card
                    key={question.question}
                    className="border-l-4 border-l-red-500 slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">{question.question}</h4>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                          <Badge variant="destructive" className="text-sm">
                            {question.correct_answer}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                          <Badge className="bg-green-100 text-green-800 text-sm">
                            {question.correct_answer}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Suggestion:</strong> To improve, review DIB 82-06, Section 4.3 on running slope
                              requirements. We recommend the{" "}
                              <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                'Advanced Slopes' micro-lesson
                              </Link>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex items-center space-x-2">
            <span>Back to Dashboard</span>
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            onClick={() => router.push("/dashboard")}
          >
            <span>Explore Learning Paths</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
