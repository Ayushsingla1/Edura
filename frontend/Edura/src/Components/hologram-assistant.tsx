import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface HologramAssistantProps {
  onClose: () => void
  initialQuestion?: string
}

export default function HologramAssistant({ onClose, initialQuestion }: HologramAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversation, setConversation] = useState<{ type: "user" | "ai"; text: string }[]>(
    initialQuestion ? [{ type: "user", text: initialQuestion }] : [],
  )
  const hologramRef = useRef<HTMLDivElement>(null)

  // Simulate AI response when a new user question is added
  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1]
    if (lastMessage && lastMessage.type === "user") {
      respondToQuestion(lastMessage.text)
    }
  }, [conversation])

  // Simulate AI typing effect
  useEffect(() => {
    if (isTyping && currentResponse) {
      const timer = setTimeout(() => {
        setConversation([...conversation, { type: "ai", text: currentResponse }])
        setCurrentResponse("")
        setIsTyping(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isTyping, currentResponse, conversation])

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      hologramRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate user speaking after a delay
      setTimeout(() => {
        const randomQuestions = [
          "Can you explain the concept of smart contracts?",
          "How do blockchain consensus mechanisms work?",
          "What are the applications of AI in education?",
          "How can I create my first decentralized application?",
        ]
        const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)]
        setConversation([...conversation, { type: "user", text: randomQuestion }])
        setIsListening(false)
      }, 3000)
    }
  }

  const respondToQuestion = (question: string) => {
    setIsTyping(true)

    // Simulate AI thinking and generate a response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Can you explain the concept of smart contracts?":
          "Smart contracts are self-executing contracts with the terms directly written into code. They automatically enforce and execute agreements when predetermined conditions are met, eliminating the need for intermediaries. On blockchain platforms like Ethereum, smart contracts enable trustless transactions and form the foundation for decentralized applications (dApps).",

        "How do blockchain consensus mechanisms work?":
          "Blockchain consensus mechanisms are protocols that ensure all nodes in a distributed network agree on the current state of the blockchain. The most common types include Proof of Work (used by Bitcoin), where miners solve complex puzzles; Proof of Stake, where validators are selected based on the amount of cryptocurrency they hold; and Delegated Proof of Stake, where token holders vote for a small number of delegates to validate transactions.",

        "What are the applications of AI in education?":
          "AI has numerous applications in education, including personalized learning paths tailored to individual student needs, automated grading systems that provide instant feedback, intelligent tutoring systems that adapt to learning styles, content summarization tools that extract key information from lectures, and predictive analytics that identify students who may need additional support before they fall behind.",

        "How can I create my first decentralized application?":
          "To create your first decentralized application (dApp), start by learning Solidity for writing smart contracts on Ethereum. Then, set up a development environment with tools like Hardhat or Truffle. Write and test your smart contracts locally, then deploy them to a testnet like Goerli or Sepolia. Finally, build a frontend using web3.js or ethers.js to interact with your smart contracts. Consider using frameworks like Scaffold-ETH to simplify the process.",
      }

      // Default response if question doesn't match any predefined ones
      const response =
        responses[question] ||
        "That's an interesting question. In the context of blockchain and education, I'd recommend exploring our course materials for more detailed information on this topic. Our lectures cover this concept in depth with practical examples."

      setCurrentResponse(response)
    }, 1500)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={cn(
            "bg-gray-950 border border-purple-800/30 rounded-xl overflow-hidden w-full max-w-3xl",
            isFullscreen ? "h-full" : "max-h-[80vh]",
          )}
          ref={hologramRef}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mr-2"></div>
              EDU-AI Holographic Assistant
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-8 w-8"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hologram Display */}
          <div className="relative h-64 bg-black flex items-center justify-center overflow-hidden">
            {/* Holographic effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,41,230,0.15),transparent_70%)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
            </div>

            {/* Holographic lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"
                style={{
                  left: `${(i / 20) * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  animation: "pulse 2s infinite",
                }}
              ></div>
            ))}

            {/* AI face representation */}
            <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 flex items-center justify-center border border-white/10">
              <div className="absolute w-full h-full rounded-full animate-ping bg-purple-500/10"></div>
              <div className="text-4xl font-bold text-white opacity-80">AI</div>
            </div>

            {/* Audio visualization */}
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-center gap-1 px-4">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-sm"
                  style={{
                    height: `${isTyping ? Math.random() * 100 : 5}%`,
                    transition: "height 0.1s ease",
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-900/50">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "mb-4 max-w-[80%] p-3 rounded-lg",
                  message.type === "user"
                    ? "bg-purple-600/20 border border-purple-600/30 ml-auto"
                    : "bg-blue-600/20 border border-blue-600/30",
                )}
              >
                <p className="text-white">{message.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="bg-blue-600/20 border border-blue-600/30 p-3 rounded-lg max-w-[80%] mb-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center">
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              className={cn(
                "mr-2",
                isListening
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800",
              )}
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <div className="flex-1 bg-gray-800 rounded-md p-2 text-sm text-gray-300">
              {isListening ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                  Listening...
                </div>
              ) : (
                "Click the microphone to ask a question..."
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </AnimatePresence>
  )
}

