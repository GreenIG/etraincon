"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, FileText, Download, Star, Users } from "lucide-react"

const courseData = {
  id: 1,
  title: "Curb Ramp & ADA Compliance",
  description: "Master Caltrans and ADA standards for accessible pedestrian route design.",
  instructor: "Dr. Sarah Johnson, P.E.",
  duration: "4 hours",
  lessons: 12,
  rating: 4.8,
  enrolled: 1250,
  progress: 75,
  modules: [
    {
      id: 1,
      title: "Introduction to ADA Standards",
      lessons: [
        { id: 1, title: "History of ADA", duration: "15 min", completed: true },
        { id: 2, title: "Key Principles", duration: "20 min", completed: true },
        { id: 3, title: "Legal Requirements", duration: "18 min", completed: true },
      ],
    },
    {
      id: 2,
      title: "Curb Ramp Design Fundamentals",
      lessons: [
        { id: 4, title: "Slope Requirements", duration: "25 min", completed: true },
        { id: 5, title: "Width Standards", duration: "20 min", completed: false },
        { id: 6, title: "Landing Areas", duration: "22 min", completed: false },
      ],
    },
    {
      id: 3,
      title: "Caltrans Specifications",
      lessons: [
        { id: 7, title: "DIB 82-06 Overview", duration: "30 min", completed: false },
        { id: 8, title: "Construction Details", duration: "28 min", completed: false },
        { id: 9, title: "Quality Control", duration: "25 min", completed: false },
      ],
    },
  ],
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  const completedLessons = courseData.modules.flatMap((m) => m.lessons).filter((l) => l.completed).length
  const totalLessons = courseData.modules.flatMap((m) => m.lessons).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
              <p className="text-gray-600 mb-4">{courseData.description}</p>

              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {courseData.duration}
                </span>
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {courseData.lessons} lessons
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {courseData.enrolled.toLocaleString()} enrolled
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {courseData.rating}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium">
                    {completedLessons}/{totalLessons} lessons completed
                  </span>
                </div>
                <Progress value={(completedLessons / totalLessons) * 100} className="h-2" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 mb-3">Continue Learning</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Download Materials
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Instructor</h4>
                    <p className="text-sm text-gray-600">{courseData.instructor}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none">
                    <p>
                      This comprehensive course covers all aspects of ADA-compliant curb ramp design according to
                      current Caltrans standards and federal regulations.
                    </p>

                    <h4>What you'll learn:</h4>
                    <ul>
                      <li>ADA compliance requirements for pedestrian facilities</li>
                      <li>Caltrans DIB 82-06 specifications and standards</li>
                      <li>Proper slope calculations and measurements</li>
                      <li>Construction details and quality control procedures</li>
                      <li>Common design mistakes and how to avoid them</li>
                    </ul>

                    <h4>Prerequisites:</h4>
                    <ul>
                      <li>Basic understanding of civil engineering principles</li>
                      <li>Familiarity with construction drawings</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Score</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="mt-6">
            <div className="space-y-6">
              {courseData.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="fade-in" style={{ animationDelay: `${moduleIndex * 0.1}s` }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        Module {module.id}: {module.title}
                      </span>
                      <Badge variant="outline">
                        {module.lessons.filter((l) => l.completed).length}/{module.lessons.length} completed
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors slide-up"
                          style={{ animationDelay: `${(moduleIndex * 3 + lessonIndex) * 0.05}s` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                lesson.completed ? "bg-green-500" : "bg-gray-200"
                              }`}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <Play className="w-3 h-3 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{lesson.title}</p>
                              <p className="text-sm text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          <Button size="sm" variant={lesson.completed ? "outline" : "default"}>
                            {lesson.completed ? "Review" : "Start"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">ADA Standards Reference Guide</p>
                        <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Caltrans DIB 82-06 Specification</p>
                        <p className="text-sm text-gray-500">PDF • 1.8 MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Design Templates & Checklists</p>
                        <p className="text-sm text-gray-500">ZIP • 5.2 MB</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Discussion forum coming soon!</p>
                  <p className="text-sm text-gray-400 mt-2">Connect with other learners and ask questions.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
