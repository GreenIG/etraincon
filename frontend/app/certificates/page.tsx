"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Award, Download, Calendar, CheckCircle, Clock, X, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

const certificates = [
  {
    id: 1,
    title: "ADA Compliance Certification",
    course: "Curb Ramp & ADA Compliance",
    issueDate: "March 15, 2024",
    expiryDate: "March 15, 2027",
    score: 92,
    status: "Active",
    certificateNumber: "ADA-2024-001234",
    color: "bg-blue-500",
    questions: [
      {
        id: 1,
        question: "What is the maximum running slope allowed for a curb ramp according to ADA standards?",
        options: ["5%", "8.33%", "10%", "12%"],
        userAnswer: 1,
        correctAnswer: 1,
        isCorrect: true,
      },
      {
        id: 2,
        question: "What is the minimum width required for a curb ramp?",
        options: ["32 inches", "36 inches", "42 inches", "48 inches"],
        userAnswer: 0,
        correctAnswer: 1,
        isCorrect: false,
      },
      {
        id: 3,
        question: "What is the maximum cross slope for a curb ramp?",
        options: ["1:48", "1:50", "2%", "5%"],
        userAnswer: 2,
        correctAnswer: 2,
        isCorrect: true,
      },
      {
        id: 4,
        question: "Which standard governs ADA compliance for curb ramps?",
        options: ["PROWAG", "MUTCD", "AASHTO", "IBC"],
        userAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
      },
      {
        id: 5,
        question: "What is the required landing size at the top of a curb ramp?",
        options: ["3x3 feet", "4x4 feet", "5x5 feet", "6x6 feet"],
        userAnswer: 1,
        correctAnswer: 2,
        isCorrect: false,
      },
    ],
    strengths: [
      "Excellent understanding of slope requirements",
      "Strong knowledge of ADA standards and regulations",
      "Good grasp of cross slope specifications",
    ],
    weaknesses: [
      "Need to review minimum width requirements",
      "Landing size specifications require attention",
      "Construction detail standards need improvement",
    ],
    suggestions: [
      "Review DIB 82-06 Section 4.2 for width requirements",
      "Practice calculating landing dimensions",
      "Study construction detail drawings more thoroughly",
      "Take the Advanced ADA Compliance course for deeper understanding",
    ],
  },
  {
    id: 2,
    title: "Construction Safety Certificate",
    course: "Construction Safety",
    issueDate: "February 28, 2024",
    expiryDate: "February 28, 2027",
    score: 88,
    status: "Active",
    certificateNumber: "CS-2024-005678",
    color: "bg-red-500",
    questions: [],
    strengths: ["Strong safety protocol knowledge", "Good hazard identification skills"],
    weaknesses: ["PPE selection needs improvement", "Emergency procedures review needed"],
    suggestions: ["Review OSHA 1926 standards", "Practice emergency response scenarios"],
  },
  {
    id: 3,
    title: "Highway Design Certification",
    course: "Highway Geometric Design",
    issueDate: "January 20, 2024",
    expiryDate: "January 20, 2027",
    score: 95,
    status: "Active",
    certificateNumber: "HD-2024-009012",
    color: "bg-green-500",
    questions: [],
    strengths: ["Proficient in highway design principles"],
    weaknesses: ["Need to enhance understanding of traffic flow"],
    suggestions: ["Study traffic engineering textbooks", "Attend workshops on traffic management"],
  },
  {
    id: 4,
    title: "Materials Testing Certificate",
    course: "Materials Testing",
    issueDate: "December 10, 2023",
    expiryDate: "December 10, 2026",
    score: 85,
    status: "Expiring Soon",
    certificateNumber: "MT-2023-003456",
    color: "bg-indigo-500",
    questions: [],
    strengths: ["Solid knowledge of material properties"],
    weaknesses: ["Require more practice in testing methodologies"],
    suggestions: ["Practice with different materials", "Review testing protocols"],
  },
  {
    id: 5,
    title: "Electrical Systems Certificate",
    course: "Electrical Systems",
    issueDate: "November 5, 2023",
    expiryDate: "November 5, 2026",
    score: 90,
    status: "Active",
    certificateNumber: "ES-2023-007890",
    color: "bg-yellow-500",
    questions: [],
    strengths: ["Good understanding of electrical circuits"],
    weaknesses: ["Need to improve knowledge of renewable energy systems"],
    suggestions: ["Study renewable energy technologies", "Take advanced courses in electrical systems"],
  },
]

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<(typeof certificates)[0] | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleDownload = (certificateId: number) => {
    console.log(`Downloading certificate ${certificateId}`)
    alert("Certificate download started!")
  }

  const handleViewDetails = (certificate: (typeof certificates)[0]) => {
    setSelectedCertificate(certificate)
    setShowDetails(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    return "text-yellow-600"
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">View and download your earned certificates and certifications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 fade-in">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
            <p className="text-sm text-gray-600">Total Certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
            <p className="text-sm text-gray-600">Expiring Soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">91%</div>
            <p className="text-sm text-gray-600">Avg. Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((certificate, index) => (
          <Card key={certificate.id} className="hover-lift slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${certificate.color} rounded-lg flex items-center justify-center`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{certificate.title}</CardTitle>
                    <p className="text-sm text-gray-600">{certificate.course}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(certificate.status)}>{certificate.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Issue Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {certificate.issueDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Expiry Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {certificate.expiryDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Score</p>
                  <p className={`font-bold text-lg ${getScoreColor(certificate.score)}`}>{certificate.score}%</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Certificate ID</p>
                  <p className="font-mono text-xs text-gray-700">{certificate.certificateNumber}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleDownload(certificate.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleViewDetails(certificate)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificate Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{selectedCertificate?.title} - Detailed Analysis</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedCertificate && (
            <div className="space-y-6">
              {/* Certificate Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600 mb-1">{selectedCertificate.score}%</div>
                      <p className="text-sm text-gray-600">Final Score</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {selectedCertificate.questions.filter((q) => q.isCorrect).length}/
                        {selectedCertificate.questions.length}
                      </div>
                      <p className="text-sm text-gray-600">Correct Answers</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">{selectedCertificate.course}</div>
                      <p className="text-sm text-gray-600">Course Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions Analysis */}
              {selectedCertificate.questions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                      Question Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedCertificate.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 flex-1 pr-4">
                            {index + 1}. {question.question}
                          </h4>
                          <Badge
                            className={question.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {question.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Your Answer:</p>
                            <p className={`font-medium ${question.isCorrect ? "text-green-700" : "text-red-700"}`}>
                              {question.options[question.userAnswer]}
                            </p>
                          </div>
                          {!question.isCorrect && (
                            <div>
                              <p className="text-gray-600 mb-1">Correct Answer:</p>
                              <p className="font-medium text-green-700">{question.options[question.correctAnswer]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Strengths and Weaknesses */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedCertificate.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedCertificate.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Personalized Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedCertificate.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <Lightbulb className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State for New Users */}
      <div className="text-center py-12 fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete courses to earn certificates</h3>
        <p className="text-gray-600 mb-4">Take final exams and achieve 80% or higher to earn your certifications.</p>
        <Button className="bg-blue-600 hover:bg-blue-700">Browse Courses</Button>
      </div>
    </div>
  )
}
