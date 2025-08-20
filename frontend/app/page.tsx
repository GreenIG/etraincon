"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Mail, Shield, User, BookOpen, TrendingUp, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { setStoredUser } from "@/lib/auth"

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")
  const [signupSuccess, setSignupSuccess] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    
    if (!loginData.email || !loginData.password) {
      setLoginError("Email and password are required")
      return
    }

    setLoginLoading(true)
    setLoginError("")

    try {
      const response = await fetch("https://etraincon.com/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (data.ok) {
        // Store user data in localStorage or context
        setStoredUser(data.user)
    setLoginOpen(false)
        setLoginData({ email: "", password: "" })
        setLoginError("")
        // Redirect to dashboard
    router.push("/dashboard")
      } else {
        if (data.code === "UNVERIFIED") {
          setLoginError("Account not verified. Please check your email for verification link.")
        } else {
          setLoginError(data.error || "Login failed. Please try again.")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Network error. Please check your connection and try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    
    if (!formData.username || !formData.email || !formData.password) {
      setSignupError("All fields are required")
      return
    }

    if (!formData.email.includes('@')) {
      setSignupError("Please enter a valid email address")
      return
    }

    setSignupLoading(true)
    setSignupError("")
    setSignupSuccess("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('username', formData.username)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)

      const response = await fetch("https://etraincon.com/api/register.php", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      })

      const data = await response.text()
      
      // Check if the response contains success message
      if (data.includes("Registration successful")) {
        setSignupSuccess("Registration successful! Please check your email to activate your account.")
        setFormData({ username: "", email: "", password: "" })
        // Don't close the dialog immediately, let user see the success message
        setTimeout(() => {
    setSignupOpen(false)
          setSignupSuccess("")
        }, 3000)
      } else if (data.includes("already registered")) {
        setSignupError("This email address is already registered.")
      } else if (data.includes("Invalid email format")) {
        setSignupError("Please enter a valid email address.")
      } else if (data.includes("Please fill in all fields")) {
        setSignupError("Please fill in all fields.")
      } else {
        setSignupError("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setSignupError("Network error. Please check your connection and try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  const requestDemo = () => {
    alert("Demo request submitted! Our team will contact you within 24 hours to schedule your personalized demo.")
  }

  const signupEarlyAccess = (email: string) => {
    if (email) {
      alert(`Thanks for your interest! We'll notify ${email} when Pro features are available.`)
    }
  }

  const subscribeNewsletter = (email: string) => {
    if (email) {
      alert(`Thanks for subscribing! We'll send updates to ${email}.`)
    }
  }

  const submitContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert("Thank you for your message! We'll get back to you within 24 hours.")
    ;(e.target as HTMLFormElement).reset()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log("Sign up:", formData)
  }

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log("Google sign up")
  }

  const resetLoginForm = () => {
    setLoginData({ email: "", password: "" })
    setLoginError("")
    setLoginLoading(false)
  }

  const resetSignupForm = () => {
    setFormData({ username: "", email: "", password: "" })
    setSignupError("")
    setSignupSuccess("")
    setSignupLoading(false)
  }

  const handleLoginDialogChange = (open: boolean) => {
    setLoginOpen(open)
    if (!open) {
      resetLoginForm()
    }
  }

  const handleSignupDialogChange = (open: boolean) => {
    setSignupOpen(open)
    if (!open) {
      resetSignupForm()
    }
  }

  return (
    <div className="bg-white text-gray-900">
      <GlobalStyles />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500" />
            <span className="font-bold text-lg gradient-text">etraincon</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              About
            </a>
            <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#blog" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Blog
            </a>
            <a href="#faq" className="text-gray-700 hover:text-indigo-600 transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-700" onClick={() => setLoginOpen(true)}>
              Login
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              onClick={() => setSignupOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[85vh] lg:min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
        {/* Animated background elements */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="blob-bg absolute top-20 left-10 w-72 h-72 opacity-20" />
          <div className="blob-bg absolute bottom-20 right-10 w-96 h-96 opacity-10" style={{ animationDelay: "-3s" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
            <div className="slide-in-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
                  {"🚀 AI-Powered Learning Platform"}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05]">
                <span className="text-white">Build Your</span>
                <br />
                <span className="gradient-text">Skills.</span>
                <br />
                <span className="text-white">Unlock</span>
                <br />
                <span className="gradient-text">Opportunity.</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                The next-generation learning and compliance platform for construction professionals, teams, and
                agencies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 pulse-glow"
                  onClick={() => setSignupOpen(true)}
                >
                  <span className="relative z-10">Sign Up Free</span>
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </Button>

                <Button
                  variant="outline"
                  className="glass-card text-white px-8 py-6 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 border-white/30 bg-transparent"
                  onClick={requestDemo}
                >
                  Request a Demo
                </Button>

                <a
                  href="#features"
                  className="text-white/90 hover:text-white px-4 py-4 text-lg font-medium transition-colors inline-flex items-center group"
                >
                  Browse Library
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <div className="slide-in-right floating-animation">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 modern-shadow">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Learning Dashboard</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-sm font-medium">Live</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <ProgressCard title="OSHA 30 Certification" percent={85} gradient="primary" />
                      <ProgressCard title="Safety Assessment" percent={100} gradient="cyan" rightLabel="Completed ✓" />
                      <ProgressCard title="Blueprint Reading" percent={45} gradient="warm" rightLabel="In Progress" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <Stat label="Courses" value="12" className="text-white" />
                      <Stat label="Completed" value="8" className="text-green-400" />
                      <Stat label="Certificates" value="3" className="text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              {"✨ Powerful Features"}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span>{"What Can "}</span>
              <span className="gradient-text">etraincon</span>
              <span>{" Do for You?"}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<Check className="w-10 h-10 text-white" />}
              badgeGradient="gradient-bg"
              hoverGradient="gradient-bg"
              title="Skill Assessment"
              description="Test and grow your construction skills with AI-powered assessments, anytime, anywhere."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-white" />}
              badgeGradient="gradient-bg-2"
              hoverGradient="gradient-bg-2"
              title="Compliance Training"
              description="Stay certified with ADA, OSHA, and local codes through interactive training modules."
            />
            <FeatureCard
              icon={<BookOpen className="w-10 h-10 text-white" />}
              badgeGradient="gradient-bg-3"
              hoverGradient="gradient-bg-3"
              title="Knowledge Library"
              description="Access comprehensive guides, manuals, and resources that are always up-to-date."
            />
          </div>

          <div className="text-center">
            <div className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Coming Soon</h3>
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                Automated job matching, AI credentialing, and a comprehensive talent marketplace to connect skilled
                professionals with opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How etraincon Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Step number={1} title="Create your profile" note="Google/email signup" />
            <Step number={2} title="Take your first assessment" note="Evaluate your current skills" />
            <Step number={3} title="Track your learning progress" note="Monitor your development" />
            <Step number={4} title="Connect with employers" note="Find opportunities or teams" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About etraincon</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our mission: Empowering construction talent, bridging the gap between training and opportunity.
          </p>
          <Button variant="link" className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg">
            {"Read More →"}
          </Button>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <p className="text-gray-600 mb-6">Access basic skill assessments & library</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-500">/month</span>
              </div>
              <Button
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => setSignupOpen(true)}
              >
                Get Started Free
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-yellow-400 hover-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  COMING SOON
                </span>
              </div>
              <p className="text-gray-600 mb-6">Compliance courses, advanced analytics, job matching</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                TBD<span className="text-lg text-gray-500">/month</span>
              </div>
              <div className="mb-1 space-y-3">
                <Input
                  type="email"
                  placeholder="Your email here"
                  className="w-full"
                  id="early-access-email"
                  defaultValue=""
                />
                <Button
                  className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  onClick={() => {
                    const el = document.getElementById("early-access-email") as HTMLInputElement | null
                    signupEarlyAccess(el?.value || "")
                    if (el) el.value = ""
                  }}
                >
                  Sign up for early access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <div className="blob-bg absolute top-10 right-10 w-64 h-64 opacity-10" />
          <div className="blob-bg absolute bottom-10 left-10 w-80 h-80 opacity-5" style={{ animationDelay: "-2s" }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
              {"📧 Newsletter"}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Stay in the Loop</h2>
          <p className="text-white/80 text-lg sm:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Get exclusive updates on new training modules, free resources, industry insights, and career opportunities
            delivered to your inbox.
          </p>

          <div className="max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-white/10 text-white placeholder:text-white/60 border-white/20"
                    id="newsletter-email"
                    defaultValue=""
                  />
                  <Button
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 pulse-glow"
                    onClick={() => {
                      const el = document.getElementById("newsletter-email") as HTMLInputElement | null
                      subscribeNewsletter(el?.value || "")
                      if (el) el.value = ""
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm mt-4">Join 10,000+ construction professionals. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-800 text-sm font-medium mb-4">
              {"📚 Latest Insights"}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">From the Blog</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights in construction training and career development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <BlogCard
              label="Technology"
              title="The Future of Construction Training"
              description="How AI and digital platforms are revolutionizing skill development in the construction industry..."
              gradientClass="gradient-bg"
            />
            <BlogCard
              label="Safety"
              title="OSHA Compliance Made Simple"
              description="Essential safety regulations every construction worker should know to stay compliant and safe..."
              gradientClass="gradient-bg-4"
            />
            <BlogCard
              label="Career"
              title="Building Your Construction Career"
              description="Tips and strategies for advancing from apprentice to project manager in the construction field..."
              gradientClass="gradient-bg-5"
            />
          </div>

          <div className="text-center">
            <Button className="inline-flex items-center px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group">
              Read all posts
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">FAQs</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4 mb-12">
            <FAQItem value="item-1" question="Is etraincon really free to start?">
              Yes! Our free tier includes access to basic skill assessments and our knowledge library. You can start
              learning and tracking your progress immediately.
            </FAQItem>
            <FAQItem value="item-2" question="What certifications can I earn?">
              We offer preparation for OSHA 10 & 30, ADA compliance, and various local building codes. More
              certifications are being added regularly.
            </FAQItem>
            <FAQItem value="item-3" question="How does the job matching work?">
              Our AI analyzes your skills, certifications, and preferences to match you with relevant job opportunities.
              This feature is coming soon in our Pro tier.
            </FAQItem>
            <FAQItem value="item-4" question="Can teams use etraincon together?">
              We're developing team management features that will allow supervisors to track team progress and ensure
              compliance across projects.
            </FAQItem>
          </Accordion>

          <div className="text-center">
            <Button variant="link" className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg">
              {"See all FAQs →"}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={submitContact} className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Name
                </Label>
                <Input id="name" placeholder="Your full name" required />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <Label htmlFor="message" className="mb-2 block">
                  Message
                </Label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2",
                    "border-gray-300 focus:ring-indigo-500",
                  )}
                  placeholder="How can we help?"
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                Send Message
              </Button>
            </form>

            <div className="flex flex-col justify-center text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Direct Email</h3>
              <a href="mailto:info@etraincon.com" className="text-indigo-600 hover:text-indigo-700 text-lg font-medium">
                info@etraincon.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-gray-400 text-lg">Ready to start your learning journey?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Email Section */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Email</h3>
              <a 
                href="mailto:info@etraincon.com" 
                className="text-green-500 hover:text-green-400 transition-colors inline-flex items-center"
              >
                info@etraincon.com
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                </svg>
              </a>
          </div>

            {/* Follow Us Section */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
          </div>
              <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49zm-7.83 1.418c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
        </div>
            </div>

            {/* Legal Section */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-white hover:text-green-400 transition-colors inline-flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  Disclaimer
                </a>
                <a href="#" className="block text-white hover:text-green-400 transition-colors inline-flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                Privacy Policy
                </a>
                <a href="#" className="block text-white hover:text-green-400 transition-colors inline-flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  Terms
                </a>
              </div>
            </div>
            </div>

          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              © 2025 <span className="underline">etraincon</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={handleLoginDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to etraincon</DialogTitle>
            <DialogDescription>Welcome back! Enter your credentials to access your dashboard.</DialogDescription>
          </DialogHeader>
          
          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{loginError}</p>
            </div>
          )}
          
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin(e)
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input 
                id="login-email" 
                type="email" 
                placeholder="you@example.com" 
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                disabled={loginLoading}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input 
                id="login-password" 
                type="password" 
                placeholder="••••••••" 
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                disabled={loginLoading}
                required 
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={signupOpen} onOpenChange={handleSignupDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Up for etraincon</DialogTitle>
            <DialogDescription>Create your account to start learning.</DialogDescription>
          </DialogHeader>
          
          {signupError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{signupError}</p>
            </div>
          )}
          
          {signupSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-700 text-sm">{signupSuccess}</p>
            </div>
          )}
          
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSignup(e)
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="signup-username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-10"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={signupLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={signupLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={signupLoading}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={signupLoading}
            >
              {signupLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignUp}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 8.55 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button 
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => {
                handleSignupDialogChange(false)
                handleLoginDialogChange(true)
              }}
            >
              Log In
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* Components */

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold", className)}>{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  )
}

function ProgressCard({
  title,
  percent,
  gradient = "primary",
  rightLabel,
}: {
  title: string
  percent: number
  gradient?: "primary" | "cyan" | "warm"
  rightLabel?: string
}) {
  const bar =
    gradient === "primary"
      ? "progress-bar"
      : gradient === "cyan"
        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
        : "bg-gradient-to-r from-yellow-500 to-orange-500"

  const right = rightLabel ?? `${Math.max(0, Math.min(100, percent))}%`

  const rightClass =
    gradient === "primary" ? "text-green-400" : gradient === "cyan" ? "text-blue-400" : "text-yellow-400"

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-medium">{title}</span>
        <span className={cn("font-bold", rightClass)}>{right}</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div className={cn(bar, "h-3 rounded-full")} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  badgeGradient,
  hoverGradient,
  title,
  description,
}: {
  icon: React.ReactNode
  badgeGradient: string
  hoverGradient: string
  title: string
  description: string
}) {
  return (
    <div className="group hover-lift">
      <div className="relative text-center p-8 bg-white rounded-3xl modern-shadow border border-gray-100 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300",
            hoverGradient,
          )}
        />
        <div className="relative">
          <div
            className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-white",
              badgeGradient,
            )}
          >
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, note }: { number: number; title: string; note: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{note}</p>
    </div>
  )
}

function BlogCard({
  label,
  title,
  description,
  gradientClass,
}: {
  label: string
  title: string
  description: string
  gradientClass: string
}) {
  return (
    <article className="group hover-lift">
      <div className="bg-white rounded-3xl overflow-hidden modern-shadow border border-gray-100">
        <div className={cn("relative h-56 overflow-hidden", gradientClass)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              {label}
            </span>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
          <button className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold group">
            Read More
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  )
}

function FAQItem({ value, question, children }: { value: string; question: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="bg-white rounded-lg shadow-sm px-2">
      <AccordionTrigger className="px-4 py-3 text-left">
        <span className="font-semibold text-gray-900">{question}</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 text-gray-600">{children}</AccordionContent>
    </AccordionItem>
  )
}

function SocialIcon({ label, href }: { label: string; href: string }) {
  const getIcon = (label: string) => {
    switch (label) {
      case "LinkedIn":
  return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case "Twitter":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        )
      case "Facebook":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        )
      case "Instagram":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49zm-7.83 1.418c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
          </svg>
        )
      case "YouTube":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      case "GitHub":
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        )
      default:
        return <User className="w-6 h-6" />
    }
  }

  return (
    <a 
      href={href} 
      aria-label={label} 
      className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
      target="_blank"
      rel="noopener noreferrer"
    >
      {getIcon(label)}
      <span className="sr-only">{label}</span>
    </a>
  )
}

/* Global styles for gradients, blobs, animations, and utility classes.
   Added via styled-jsx to avoid editing globals and to keep styles colocated with this page. [^1] */
function GlobalStyles() {
  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      .gradient-text {
        background: linear-gradient(135deg, #2563eb, #7c3aed, #db2777);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .glass-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .floating-animation {
        animation: float 6s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .pulse-glow {
        animation: pulse-glow 2s infinite;
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.3); }
        50% { box-shadow: 0 0 40px rgba(37, 99, 235, 0.6); }
      }
      .slide-in-left {
        animation: slideInLeft 0.8s ease-out both;
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .slide-in-right {
        animation: slideInRight 0.8s ease-out both;
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .fade-in-up {
        animation: fadeInUp 0.8s ease-out both;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .hover-lift:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }
      .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .gradient-bg-2 {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      .gradient-bg-3 {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      .gradient-bg-4 {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
      .gradient-bg-5 {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }
      .modern-shadow {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      .neon-border {
        border: 2px solid transparent;
        background:
          linear-gradient(#fff, #fff) padding-box,
          linear-gradient(135deg, #2563eb, #7c3aed) border-box;
      }
      .progress-bar {
        background: linear-gradient(90deg, #2563eb, #7c3aed, #db2777);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .blob-bg {
        background: linear-gradient(45deg, #2563eb, #7c3aed);
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        animation: blob 7s infinite;
        filter: blur(0.5px);
      }
      @keyframes blob {
        0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
        50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
        75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
      }
    `}</style>
  )
}
