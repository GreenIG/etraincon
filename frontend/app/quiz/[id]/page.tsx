"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, ArrowRight, CheckCircle, Trophy, Flag, FlagOff, Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface QuizQuestion {
  question_type: "multiple_choice" | "open_ended"
  question: string
  options?: string[]
  correct_answer?: string // For future use when API provides correct answers
}

interface QuizData {
  courseId: number
  quizType: string
  questions: QuizQuestion[]
  counts: {
    multiple_choice: number
    open_ended: number
  }
  timestamp: number
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizType = searchParams.get("type") || "trial"
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | string)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null)
  const [timeLeft, setTimeLeft] = useState(quizType === "trial" ? 15 * 60 : 45 * 60) // 15 or 45 minutes
  const [startTime] = useState(Date.now())
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [showFlaggedReview, setShowFlaggedReview] = useState(false)

  // Load quiz data from localStorage
  useEffect(() => {
    const storedQuizData = localStorage.getItem('quizData')
    if (storedQuizData) {
      try {
        const parsedData = JSON.parse(storedQuizData) as QuizData
        // Check if the data is for the current course and not too old (1 hour)
        if (parsedData.courseId === parseInt(id) && 
            parsedData.quizType === quizType &&
            Date.now() - parsedData.timestamp < 3600000) {
          setQuizData(parsedData)
        } else {
          setError("Quiz data not found or expired. Please start the quiz again.")
        }
      } catch (err) {
        setError("Failed to load quiz data. Please try again.")
      }
    } else {
      setError("No quiz data found. Please start the quiz from the dashboard.")
    }
    setLoading(false)
  }, [id, quizType])

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null)
  }, [currentQuestion])

  useEffect(() => {
    if (!quizData) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizData])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion)
    } else {
      newFlagged.add(currentQuestion)
    }
    setFlaggedQuestions(newFlagged)
  }

  const isQuestionFlagged = () => {
    return flaggedQuestions.has(currentQuestion)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null && quizData) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)

      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      }
    }
  }

  const handleSubmitQuiz = () => {
    if (!quizData) return

    const finalAnswers = [...answers]
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer
    }

    const endTime = Date.now()
    const timeUsed = Math.floor((endTime - startTime) / 1000)

    // Calculate score based on question types
    let correct = 0
    let totalScored = 0
    
    finalAnswers.forEach((answer, index) => {
      const question = quizData.questions[index]
      
      if (question.question_type === "multiple_choice") {
        totalScored++
        // For multiple choice, we'll count answered questions as correct for now
        // In a real implementation, you'd compare with correct_answer from API
        if (answer !== undefined && answer !== null && answer !== "") {
          correct++
        }
      }
      // For open-ended questions, we don't score them automatically
      // They would need manual grading in a real implementation
    })

    const score = totalScored > 0 ? Math.round((correct / totalScored) * 100) : 0

    // Store results
    const results = {
      score,
      correct,
      totalScored,
      totalQuestions: quizData.questions.length,
      timeUsed,
      answers: finalAnswers,
      questions: quizData.questions,
      quizType,
      flaggedQuestions: Array.from(flaggedQuestions),
      courseId: quizData.courseId,
    }

    localStorage.setItem("quizResults", JSON.stringify(results))

    // Show congratulations popup
    setShowCongratulations(true)
  }

  const handleFinishQuiz = () => {
    setShowCongratulations(false)
    router.push("/results")
  }

  const progress = quizData ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0
  const isLastQuestion = quizData ? currentQuestion === quizData.questions.length - 1 : false

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-lg text-gray-600">Loading quiz...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Quiz Data Found</h2>
        <p className="text-lg text-gray-600 mb-6">
          It seems the quiz data for this course is not available. Please check back later or contact support.
        </p>
        <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {quizType === "trial" ? "Trial Quiz" : "Final Exam"}: Course {quizData.courseId}
            </h1>
            <div className="flex items-center space-x-4">
              {/* Flagged Questions Review Button */}
              {flaggedQuestions.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFlaggedReview(true)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Review Flagged ({flaggedQuestions.size})</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Question {currentQuestion + 1} of {quizData.questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">
                Question {currentQuestion + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFlag}
                className={isQuestionFlagged() ? "text-red-600 border-red-300" : ""}
              >
                {isQuestionFlagged() ? <Flag className="w-4 h-4" /> : <FlagOff className="w-4 h-4" />}
                {isQuestionFlagged() ? "Flagged" : "Flag"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg text-gray-900 leading-relaxed">
              {quizData.questions[currentQuestion]?.question}
            </div>

            {quizData.questions[currentQuestion]?.question_type === "multiple_choice" && (
              <RadioGroup
                value={typeof selectedAnswer === 'number' ? selectedAnswer.toString() : ""}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                className="space-y-3"
              >
                {quizData.questions[currentQuestion]?.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {quizData.questions[currentQuestion]?.question_type === "open_ended" && (
              <div className="space-y-3">
                <Label htmlFor="open-answer" className="text-base font-medium">
                  Your Answer:
                </Label>
                <textarea
                  id="open-answer"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="Type your detailed answer here..."
                  value={typeof selectedAnswer === 'string' ? selectedAnswer : ""}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
                <p className="text-sm text-gray-600">
                  Please provide a comprehensive answer. Open-ended questions will be reviewed manually.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Exit Quiz
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={selectedAnswer === null}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Flagged Questions Review Modal */}
      <Dialog open={showFlaggedReview} onOpenChange={setShowFlaggedReview}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Flagged Questions Review</DialogTitle>
            <DialogDescription>
              Review your flagged questions. Click on any question to jump to it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Array.from(flaggedQuestions).map((questionIndex) => {
              const question = quizData.questions[questionIndex]
              const userAnswer = answers[questionIndex]
              
              return (
                <Card key={questionIndex} className="cursor-pointer hover:bg-gray-50" 
                      onClick={() => {
                        setCurrentQuestion(questionIndex)
                        setShowFlaggedReview(false)
                      }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Question {questionIndex + 1} ({question.question_type === "multiple_choice" ? "Multiple Choice" : "Open Ended"})
                      </span>
                      <Flag className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium mb-2">{question.question}</p>
                    {question.question_type === "multiple_choice" && question.options && (
                      <div className="space-y-1">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`text-xs p-2 rounded ${
                              userAnswer === index 
                                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {option}
                            {userAnswer === index && ' (Your answer)'}
                          </div>
                        ))}
                      </div>
                    )}
                    {question.question_type === "open_ended" && (
                      <div className="space-y-2">
                        <div className="text-xs p-2 rounded bg-gray-50 text-gray-700">
                          Open-ended question
                        </div>
                        {userAnswer && typeof userAnswer === 'string' && userAnswer.trim() !== '' && (
                          <div className="text-xs p-2 rounded bg-green-50 text-green-800 border border-green-300">
                            <strong>Your answer:</strong> {userAnswer}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowFlaggedReview(false)}>
              Close Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Congratulations Modal */}
      <Dialog open={showCongratulations} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-green-600 mb-2">🎉 Congratulations! 🎉</DialogTitle>
            <DialogDescription className="text-lg text-gray-700 mb-6">
              You have successfully completed the {quizType === "trial" ? "trial quiz" : "final exam"}!
            </DialogDescription>
          </DialogHeader>

          <div className="text-center space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-green-800 font-medium mb-2">
                🏆 Quiz completed successfully!
              </p>
              <div className="text-sm text-green-700 space-y-1">
                <p>• {quizData?.counts.multiple_choice || 0} multiple-choice questions</p>
                <p>• {quizData?.counts.open_ended || 0} open-ended questions</p>
                <p>• Time used: {Math.floor((Date.now() - startTime) / 1000 / 60)} minutes</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Open-ended questions will be reviewed manually. 
                Your results will be updated once grading is complete.
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 text-lg"
              onClick={handleFinishQuiz}
            >
              View My Results
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
