"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  MapPin,
  Download,
  Send,
  Code,
  Database,
  Server,
  Wrench,
  Trophy,
  Users,
  ChevronDown,
} from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const animationRef = useRef<number>()
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "skills", "achievements", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  // Initialize particles
  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = []
      const particleCount = window.innerWidth < 768 ? 30 : 60

      for (let i = 0; i < particleCount; i++) {
        const baseOpacity = Math.random() * 0.4 + 0.2
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: Math.random() * 2.5 + 1,
          opacity: baseOpacity,
          baseOpacity: baseOpacity,
        })
      }
      particlesRef.current = newParticles
    }

    initParticles()

    const handleResize = () => {
      initParticles()
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update particles directly in ref
      particlesRef.current = particlesRef.current.map((particle) => {
        // Smooth cursor interaction
        const dx = mousePosition.x - particle.x
        const dy = mousePosition.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 120

        if (distance < maxDistance && distance > 0) {
          const force = ((maxDistance - distance) / maxDistance) * 0.03
          const angle = Math.atan2(dy, dx)
          particle.vx += Math.cos(angle) * force
          particle.vy += Math.sin(angle) * force

          // Enhance opacity near cursor
          particle.opacity = Math.min(particle.baseOpacity + 0.3, 0.8)
        } else {
          // Fade back to base opacity
          particle.opacity = particle.baseOpacity
        }

        // Update position with smooth movement
        particle.x += particle.vx
        particle.y += particle.vy

        // Smooth boundary collision with damping
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -0.8
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -0.8
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        // Smooth friction
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Add slight random movement for natural feel
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01

        return particle
      })

      // Draw particles with darker blue/grey colors
      particlesRef.current.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity

        // Darker gradient for particles
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, "#3B82F6") // Darker blue
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw connections with darker colors
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxConnectionDistance = 100

          if (distance < maxConnectionDistance) {
            ctx.save()
            const opacity = ((maxConnectionDistance - distance) / maxConnectionDistance) * 0.1
            ctx.globalAlpha = opacity

            // Darker gradient line
            const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y)
            gradient.addColorStop(0, "#374151") // Dark gray
            gradient.addColorStop(1, "#4B5563") // Slightly lighter gray

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
  }

  const projects = [
    {
      title: "Art Gallery Management System",
      description:
        "Developed an end-to-end ticket booking platform for art events with secure login, payment integration, and booking management.",
      tech: ["React.js", "Express.js", "TypeScript", "SQL"],
      github: "#",
      demo: "#",
      icon: "🎨",
    },
    {
      title: "Roots-Tech",
      description:
        "Full-stack booking app connecting customers with service providers, featuring geo-location, real-time notifications, and responsive UI.",
      tech: ["React.js", "Express.js", "MongoDB"],
      github: "#",
      demo: "#",
      icon: "🌱",
    },
    {
      title: "Passwordless Authentication System",
      description:
        "Built a secure authentication system eliminating passwords using FIDO2 protocol, with MongoDB storage and session control.",
      tech: ["React.js", "Node.js", "WebAuthn", "FIDO2"],
      github: "#",
      demo: "#",
      icon: "🔐",
    },
  ]

  const skills = {
    Languages: ["C", "C++", "Java", "Python", "HTML", "CSS", "JavaScript", "SQL"],
    Frameworks: ["React.js", "Node.js", "Express.js", "FastAPI"],
    Databases: ["MongoDB", "MySQL", "PostgreSQL"],
    Tools: ["Docker", "GitHub", "VS Code", "Postman", "Linux", "Jupyter", "Google Colab"],
    "Soft Skills": ["Teamwork", "Problem-Solving", "Communication", "Time Management"],
  }

  const achievements = [
    {
      title: "Runner-up, REACT-THON",
      description: "Built Spotify clone with advanced UI components",
      icon: "🥈",
    },
    {
      title: "Runner-up, TechVision",
      description: "Presented gamified learning app for cyber law",
      icon: "🥈",
    },
    {
      title: "Winner (x2), Interclass Cultural Fest",
      description: "Creative performances",
      icon: "🏆",
    },
    {
      title: "Acting Mentor",
      description: "Led dramatics training and stage coaching for peers",
      icon: "🎭",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Smooth Particles Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "transparent" }} />
        </div>
      </div>

      {/* Smooth Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-blue-400 transition-colors duration-300">Sudhama Bhat</div>
            <div className="hidden md:flex space-x-8">
              {["hero", "about", "projects", "skills", "achievements", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all duration-300 hover:text-blue-400 hover:scale-105 ${
                    activeSection === section ? "text-blue-400 scale-105" : "text-gray-300"
                  }`}
                >
                  {section === "hero" ? "Home" : section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-gray-400 bg-clip-text text-transparent transition-all duration-500 hover:scale-105">
              Sudhama Bhat
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-4 transition-all duration-300">
              Full Stack Developer | DevOps Enthusiast
            </h2>
            <div className="flex items-center justify-center text-gray-400 mb-8 transition-all duration-300">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Kundapur, Karnataka, India</span>
            </div>
          </div>

          <div
            className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-700/25"
            >
              View Projects
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-400 px-8 py-3 text-lg bg-transparent transition-all duration-300 hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2" />
              Resume
            </Button>
          </div>

          <div className="flex justify-center space-x-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a
              href="https://linkedin.com/in/sudhama-bhat-349a31241"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/Sudhama-bhat"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="mailto:sudhamabhat5@gmail.com"
              className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400 transition-colors duration-300 hover:text-blue-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500 transition-all duration-300 hover:scale-105">
            About Me
          </h2>
          <div className="text-center">
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto transition-all duration-300 hover:text-gray-200">
              I'm an Information Science Engineering student passionate about crafting scalable full-stack web
              applications and exploring DevOps tools and cloud platforms. I enjoy solving real-world challenges with
              clean, efficient code and an eye for performance optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-6 bg-gray-950/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500 transition-all duration-300 hover:scale-105">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-gray-900/80 border-gray-700 hover:border-blue-500 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-700/10 group"
              >
                <CardHeader>
                  <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                    {project.icon}
                  </div>
                  <CardTitle className="text-xl text-white transition-colors duration-300 group-hover:text-blue-300">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="bg-slate-700 text-gray-300 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </a>
                    <a
                      href={project.demo}
                      className="flex items-center text-slate-400 hover:text-slate-300 transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500 transition-all duration-300 hover:scale-105">
            Skills
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList], index) => (
              <Card
                key={index}
                className="bg-gray-900/80 border-gray-700 transition-all duration-500 hover:border-blue-500 hover:transform hover:scale-105 hover:shadow-xl group"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center transition-colors duration-300 group-hover:text-blue-300">
                    {category === "Languages" && (
                      <Code className="w-5 h-5 mr-2 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {category === "Frameworks" && (
                      <Server className="w-5 h-5 mr-2 text-slate-400 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {category === "Databases" && (
                      <Database className="w-5 h-5 mr-2 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {category === "Tools" && (
                      <Wrench className="w-5 h-5 mr-2 text-gray-400 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {category === "Soft Skills" && (
                      <Users className="w-5 h-5 mr-2 text-slate-500 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="outline"
                        className="border-gray-500 text-gray-300 transition-all duration-300 hover:border-blue-400 hover:text-blue-300 hover:scale-105"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="relative z-10 py-20 px-6 bg-gray-950/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-500 transition-all duration-300 hover:scale-105">
            Achievements
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="bg-gray-900/80 border-gray-700 transition-all duration-500 hover:border-blue-500 hover:transform hover:scale-105 hover:shadow-xl group"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center transition-colors duration-300 group-hover:text-blue-300">
                    <span className="text-2xl mr-3 transition-transform duration-300 group-hover:scale-110">
                      {achievement.icon}
                    </span>
                    {achievement.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                    {achievement.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-900/80 border-gray-700 transition-all duration-500 hover:border-blue-500 hover:transform hover:scale-105 hover:shadow-xl group">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center transition-colors duration-300 group-hover:text-blue-300">
                <Trophy className="w-5 h-5 mr-2 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                Volunteer Experience
              </CardTitle>
              <CardDescription className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                <strong>Smart India Hackathon (SIH) Volunteer</strong> – Coordinated logistics, resolved queries, and
                supported teams during national-level hackathon events.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-500 transition-all duration-300 hover:scale-105">
            Let's Connect
          </h2>
          <p className="text-center text-gray-300 mb-12 text-lg transition-all duration-300 hover:text-gray-200">
            Let's collaborate or just have a tech talk!
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white transition-colors duration-300">Get in Touch</h3>
              <div className="space-y-4">
                <a
                  href="mailto:sudhamabhat5@gmail.com"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 hover:translate-x-2"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  sudhamabhat5@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/sudhama-bhat-349a31241"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 hover:translate-x-2"
                >
                  <Linkedin className="w-5 h-5 mr-3" />
                  LinkedIn Profile
                </a>
                <a
                  href="https://github.com/Sudhama-bhat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 hover:translate-x-2"
                >
                  <Github className="w-5 h-5 mr-3" />
                  GitHub Profile
                </a>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 transition-all duration-300 focus:scale-105"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 transition-all duration-300 focus:scale-105"
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500 min-h-[120px] transition-all duration-300 focus:scale-105"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-700/25"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 transition-colors duration-300 hover:text-gray-300">
            © 2024 Sudhama Bhat. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
