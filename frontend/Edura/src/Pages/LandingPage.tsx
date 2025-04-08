import { useState } from "react"
// import Navafrom "next/a"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Brain, Lock, Video, Zap } from "lucide-react"
import { Button } from "@/Components/ui/button"
import HologramAssistant from "@/Components/hologram-assistant"
import Navbar from "@/Components/Navbar"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const [showHologram, setShowHologram] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
        <Navbar/>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,41,230,0.15),transparent_65%)]" />
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/5" />
            ))}
          </div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeIn}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
                Edu-Chain
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                The future of decentralized education powered by blockchain and AI
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-whit rounded-2xl text-center"
                onClick={() => navigate('/courses')}
              >
                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-950/30 rounded-2xl"
                onClick={() => navigate('/meet')}
              >
                Meet AI Assistant
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="relative h-64 md:h-80 mt-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-4xl">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-sm opacity-75"></div>
                  <div className="relative bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                        <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-3">
                          <BookOpen className="h-6 w-6 text-purple-400" />
                        </div>
                        <h3 className="font-medium text-white">AI-Generated Notes</h3>
                        <p className="text-xs text-gray-400 mt-1">Automatic notes from video lectures</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                        <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                          <Brain className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="font-medium text-white">Smart Quizzes</h3>
                        <p className="text-xs text-gray-400 mt-1">AI-generated assessments</p>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                        <div className="h-12 w-12 rounded-full bg-cyan-600/20 flex items-center justify-center mb-3">
                          <Lock className="h-6 w-6 text-cyan-400" />
                        </div>
                        <h3 className="font-medium text-white">Fund Locking</h3>
                        <p className="text-xs text-gray-400 mt-1">Commit to learning with stakes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-purple-400"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3,
              scale: Math.random() * 2 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950/20 flex w-screen justify-center">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Revolutionary Learning Experience
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Combining blockchain technology with artificial intelligence to create a secure, engaging, and effective
              educational platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-black rounded-xl p-6 h-full border border-white/10">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-black flex justify-center w-screen">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Popular Courses
              </h2>
              <p className="mt-2 text-gray-400">Explore our top-rated blockchain and tech courses</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <a href="/courses">
                <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/30">
                  View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <a href={`/courses/${course.id}`}>
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-12 w-12 text-white/50" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-purple-600/80 text-white text-xs rounded-md">
                            {course.category}
                          </span>
                          <span className="flex items-center text-white text-xs">
                            <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                            {course.eduTokens} EDU
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-b-xl">
                      <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                          <span className="text-xs text-gray-400 ml-2">{course.instructor}</span>
                        </div>
                        <div className="text-xs text-gray-400">{course.duration}</div>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-black to-purple-950/20 w-screen flex justify-center">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,41,230,0.3),transparent_70%)]" />
            <div className="relative z-10 py-12 px-6 md:py-20 md:px-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                Join Edu-Chain today and experience the future of decentralized education. Earn while you learn and take
                control of your educational journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-950/30"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hologram Assistant Modal */}
      {showHologram && <HologramAssistant onClose={() => setShowHologram(false)} />}
    </div>
  )
}

const features = [
  {
    title: "Blockchain-Powered Education",
    description: "Secure, transparent, and decentralized learning platform built on edu-chain technology.",
    icon: <BookOpen className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "AI-Generated Study Materials",
    description: "Automatically create comprehensive notes from video lectures to enhance your learning.",
    icon: <Brain className="h-6 w-6 text-blue-400" />,
  },
  {
    title: "Interactive Quizzes",
    description: "Test your knowledge with AI-generated quizzes tailored to each lecture's content.",
    icon: <Zap className="h-6 w-6 text-cyan-400" />,
  },
  {
    title: "Fund Locking Contracts",
    description: "Lock your funds as motivation and get them back upon completing your learning goals.",
    icon: <Lock className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Holographic AI Assistant",
    description: "Get instant help from our advanced AI assistant with holographic visualization.",
    icon: <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />,
  },
  {
    title: "Earn While You Learn",
    description: "Complete courses and earn edu-tokens that can be used within the platform.",
    icon: <div className="h-6 w-6 text-blue-400">₮</div>,
  },
]

const popularCourses = [
  {
    id: "blockchain-fundamentals",
    title: "Blockchain Fundamentals",
    description: "Learn the core concepts of blockchain technology and its applications in various industries.",
    instructor: "Dr. Alex Johnson",
    category: "Blockchain",
    eduTokens: 50,
    duration: "4 weeks",
  },
  {
    id: "smart-contract-development",
    title: "Smart Contract Development",
    description: "Master the art of creating and deploying secure smart contracts on blockchain networks.",
    instructor: "Maria Rodriguez",
    category: "Development",
    eduTokens: 75,
    duration: "6 weeks",
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning Basics",
    description: "Understand the fundamentals of artificial intelligence and machine learning algorithms.",
    instructor: "Prof. James Chen",
    category: "AI",
    eduTokens: 60,
    duration: "5 weeks",
  },
]

