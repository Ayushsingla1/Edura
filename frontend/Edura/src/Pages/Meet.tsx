import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles, AlignLeft, MessageCircle, Brain, RefreshCw, Download, X, Maximize, Minimize, Share } from "lucide-react"
import { Button } from "@/Components/ui/button"
import Navbar from "@/Components/Navbar"
import { connectToDeepgram, getAIResponseAudio } from "@/utils/deepgramConnection"

export default function ImmersiveTeacherPage() {
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeMode, setActiveMode] = useState("chat") // chat, notes, visualize
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false)
  const [energyLevel, setEnergyLevel] = useState(Array(20).fill(10))
  const [audioVisualization, setAudioVisualization] = useState(Array(30).fill(5))
  const deepgramSocket = useRef(null);
  const [transcript, setTranscript] = useState('');
  
  const chatContainerRef = useRef(null)
  
  const [chatHistory, setChatHistory] = useState([
    {
      isUser: false,
      message: "I'm your AI tutor. What would you like to learn today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
 
  // Simulate audio visualization when teacher is speaking
  useEffect(() => {
    let interval : any;
    if (isTeacherSpeaking) {
      interval = setInterval(() => {
        setAudioVisualization(prev => 
          prev.map(() => Math.random() * 40 + 5)
        )
      }, 100)
    } else {
      setAudioVisualization(Array(30).fill(5))
    }
    
    return () => clearInterval(interval)
  }, [isTeacherSpeaking])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyLevel(prev => 
        prev.map(() => Math.random() * 20 + 5)
      )
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async() => {
    if (inputText.trim() === "") return

    const newMessage = {
        isUser: true,
        message: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setChatHistory((prev : any) => [...prev,newMessage]);

    setInputText("");
    await getAIResponseAudio(inputText,setIsTeacherSpeaking,setChatHistory);
  }
  
  const toggleMicrophone = async() => {
    console.log(deepgramSocket.current);
    if(isListening){
        console.log("is listening now")
        //@ts-ignore
        if (deepgramSocket.current?.readyState === WebSocket.OPEN) {
          //@ts-ignore
            deepgramSocket.current?.close();
            console.log(transcript);
            if(transcript.length !== 0) {
              const newMessage = {
                isUser: true,
                message: transcript,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
              setChatHistory((prev : any) => [...prev,newMessage]);
              await getAIResponseAudio(transcript,setIsTeacherSpeaking,setChatHistory);
            }
        }
        setIsListening(false);
    }

    else if(!isListening){
        setTranscript('');
        connectToDeepgram(setTranscript,deepgramSocket);
        setIsListening(true);
    }
  }
  
  const toggleSound = () => {
    setIsMuted(!isMuted)
    if (isTeacherSpeaking && !isMuted) {
      setIsTeacherSpeaking(false)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  
  return (
<div className={`min-h-screen bg-black text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && <Navbar />}
      
      <div className={`container mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-64px)]'}`}>
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
              Interactive AI Tutor
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-purple-950/30 h-8 w-8 sm:h-10 sm:w-10"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-purple-950/30 h-8 w-8 sm:h-10 sm:w-10"
              onClick={toggleSound}
            >
              {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-purple-950/30 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Share className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            {isFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-purple-950/30 h-8 w-8 sm:h-10 sm:w-10"
                onClick={toggleFullscreen}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
          {/* Teacher visualization section */}
          <motion.div 
            layout
            className={`relative overflow-hidden rounded-xl border border-purple-500/30 ${
              activeMode === "chat" 
                ? 'h-1/3 lg:h-auto lg:w-1/2' 
                : 'h-1/3 lg:h-auto lg:w-2/3'
            }`}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(120,41,230,0.2), rgba(0,0,0,0.8))'
            }}
          >
            {/* Hexagonal grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M25 0 L50 14.4 L50 28.6 L25 43.4 L0 28.6 L0 14.4 Z" fill="none" stroke="rgba(123,97,255,0.3)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
            
            {/* Audio visualization bars behind the teacher */}
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 flex items-end justify-center gap-1 px-4 opacity-70">
              {audioVisualization.map((height, idx) => (
                <motion.div 
                  key={idx}
                  className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                  initial={{ height: 5 }}
                  animate={{ height: height * 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              ))}
            </div>
            
            {/* Holographic teacher visualization - responsive sizing */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Holographic rings */}
              <motion.div 
                className="absolute w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full border-2 border-purple-500/30"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full border-2 border-blue-500/40"
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Teacher silhouette - responsive sizing */}
              <motion.div 
                className="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full bg-gradient-to-b from-purple-600/30 to-blue-600/30 flex items-center justify-center"
                animate={{
                  boxShadow: isTeacherSpeaking 
                    ? "0 0 30px 5px rgba(123, 97, 255, 0.5)"
                    : "0 0 20px 2px rgba(123, 97, 255, 0.3)"
                }}
              >
                {/* Teacher face approximation - would be replaced with actual 3D model */}
                <div className="w-16 h-20 sm:w-24 sm:h-30 lg:w-32 lg:h-40 rounded-t-full bg-gradient-to-b from-blue-500/20 to-purple-500/20 relative">
                  {/* Eyes */}
                  <div className="absolute top-7 sm:top-10 lg:top-14 left-0 right-0 flex justify-center space-x-5 sm:space-x-8 lg:space-x-10">
                    <motion.div 
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-cyan-400"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 rounded-full bg-cyan-400"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Mouth */}
                  <motion.div 
                    className="absolute bottom-5 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 w-5 sm:w-8 lg:w-10 h-0.5 sm:h-1 bg-cyan-400 rounded-full"
                    animate={{ 
                      scaleY: isTeacherSpeaking ? [1, 1.5, 2, 1.5, 1] : 1,
                      opacity: isTeacherSpeaking ? [0.6, 1, 0.6] : 0.6
                    }}
                    transition={{ 
                      duration: isTeacherSpeaking ? 0.3 : 1, 
                      repeat: isTeacherSpeaking ? Infinity : 0 
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Energy lines radiating from teacher - reduced for mobile */}
              <div className="absolute inset-0">
                {energyLevel.filter((_, i) => (window.innerWidth < 640 ? i % 3 === 0 : true)).map((length, idx) => {
                  const angle = (idx / energyLevel.length) * 360
                  const radians = (angle * Math.PI) / 180
                  const x = Math.cos(radians)
                  const y = Math.sin(radians)
                  
                  return (
                    <motion.div
                      key={idx}
                      className="absolute top-1/2 left-1/2 w-0.5 sm:w-1 bg-gradient-to-r from-purple-500 to-transparent"
                      style={{
                        height: `${window.innerWidth < 640 ? length * 0.5 : length}px`,
                        transformOrigin: '0 0',
                        transform: `rotate(${angle}deg) translate(-50%, -50%)`,
                        opacity: 0.6
                      }}
                      animate={{
                        height: [
                          window.innerWidth < 640 ? length * 0.5 : length, 
                          window.innerWidth < 640 ? (length + 5) * 0.5 : length + 10, 
                          window.innerWidth < 640 ? length * 0.5 : length
                        ],
                        opacity: [0.4, 0.6, 0.4]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.1
                      }}
                    />
                  )
                })}
              </div>
              
              {/* Holographic particles - fewer on mobile */}
              {Array.from({ length: window.innerWidth < 640 ? 15 : 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full bg-cyan-400"
                  initial={{
                    x: (Math.random() - 0.5) * (window.innerWidth < 640 ? 100 : 200),
                    y: (Math.random() - 0.5) * (window.innerWidth < 640 ? 100 : 200),
                    opacity: Math.random() * 0.5 + 0.3,
                    scale: Math.random() * 1.5 + 0.5,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * (window.innerWidth < 640 ? 100 : 200),
                    y: (Math.random() - 0.5) * (window.innerWidth < 640 ? 100 : 200),
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            
            {/* Recording indicator */}
            {isListening && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center space-x-1 sm:space-x-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-red-900/50 backdrop-blur-sm rounded-full text-white text-xs">
                <motion.div 
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[10px] sm:text-xs">Recording...</span>
              </div>
            )}
            
            {/* Speaking indicator */}
            {isTeacherSpeaking && !isMuted && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center space-x-1 sm:space-x-2 px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-900/50 backdrop-blur-sm rounded-full text-white text-xs">
                <motion.div 
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[10px] sm:text-xs">Speaking...</span>
              </div>
            )}
            
            {/* Topic bubbles floating around - fewer on mobile */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {["Physics", "Math", "Chemistry", "Biology", "History"].slice(0, window.innerWidth < 640 ? 3 : 5).map((topic, idx) => (
                <motion.div
                  key={topic}
                  className="absolute px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-[10px] sm:text-xs text-white border border-purple-500/30"
                  initial={{
                    x: Math.random() * (window.innerWidth < 640 ? 150 : 300) - (window.innerWidth < 640 ? 75 : 150),
                    y: Math.random() * (window.innerWidth < 640 ? 150 : 300) - (window.innerWidth < 640 ? 75 : 150),
                    opacity: 0.7,
                  }}
                  animate={{
                    x: Math.random() * (window.innerWidth < 640 ? 150 : 300) - (window.innerWidth < 640 ? 75 : 150),
                    y: Math.random() * (window.innerWidth < 640 ? 150 : 300) - (window.innerWidth < 640 ? 75 : 150),
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 15 + Math.random() * 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {topic}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Interactive content section */}
          <motion.div 
            layout
            className={`flex-1 relative overflow-hidden rounded-xl border border-white/10 ${
              activeMode === "chat" 
                ? 'h-2/3 lg:h-auto lg:w-1/2' 
                : 'h-2/3 lg:h-auto lg:w-1/3'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10" />
            
            {/* Mode tabs */}
            <div className="flex border-b border-white/10">
              <Button
                variant="ghost"
                className={`flex-1 rounded-none h-10 sm:h-12 text-xs sm:text-sm ${activeMode === "chat" ? 'bg-purple-900/30 text-white' : 'text-gray-400'}`}
                onClick={() => setActiveMode("chat")}
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Chat
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 rounded-none h-10 sm:h-12 text-xs sm:text-sm ${activeMode === "notes" ? 'bg-purple-900/30 text-white' : 'text-gray-400'}`}
                onClick={() => setActiveMode("notes")}
              >
                <AlignLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Notes
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 rounded-none h-10 sm:h-12 text-xs sm:text-sm ${activeMode === "visualize" ? 'bg-purple-900/30 text-white' : 'text-gray-400'}`}
                onClick={() => setActiveMode("visualize")}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Visualize
              </Button>
            </div>
            
            {/* Content based on active mode */}
            <div className="h-[calc(100%-40px)] sm:h-[calc(100%-48px)] overflow-hidden">
              <AnimatePresence mode="wait">
                {activeMode === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    {/* Chat messages - FIXED SCROLLING HERE */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 max-h-[calc(100%-60px)] sm:max-h-[calc(100%-70px)]"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {chatHistory.map((msg, idx) => (
                        <motion.div 
                          key={idx} 
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className={`max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                            msg.isUser 
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                              : 'bg-white/10 backdrop-blur-sm'
                          }`}>
                            <p className="text-xs sm:text-sm">{msg.message}</p>
                            <p className="text-[8px] sm:text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* "Teacher is typing" indicator */}
                      {isTeacherSpeaking && (
                        <motion.div 
                          className="flex justify-start"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2">
                            <div className="flex space-x-1">
                              <motion.div 
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              />
                              <motion.div 
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div 
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Input area - fixed height to prevent overlap with chat */}
                    <div className="p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-sm opacity-75"></div>
                        <div className="relative bg-black/80 backdrop-blur-sm rounded-full border border-white/10 flex items-center p-1 sm:p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`text-gray-400 hover:text-white h-7 w-7 sm:h-9 sm:w-9 ${isListening ? 'bg-red-500/20 text-red-400' : ''}`}
                            onClick={toggleMicrophone}
                          >
                            {isListening ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </Button>
                          
                          <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                          />
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white h-7 w-7 sm:h-9 sm:w-9"
                            onClick={handleSendMessage}
                          >
                            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeMode === "notes" && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full p-2 sm:p-4 overflow-y-auto"
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 h-full border border-white/10">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-lg font-medium">Smart Notes</h3>
                        <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-950/20 text-xs sm:text-sm h-7 sm:h-8">
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Save
                        </Button>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-1 sm:space-y-2">
                          <h4 className="text-xs sm:text-sm font-medium text-purple-400">Quantum Computing Basics</h4>
                          <p className="text-xs sm:text-sm text-gray-300">
                            Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously through superposition.
                          </p>
                          <p className="text-xs sm:text-sm text-gray-300">
                            Unlike classical bits that are either 0 or 1, qubits can be both at the same time, enabling quantum computers to process complex calculations exponentially faster.
                          </p>
                        </div>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <h4 className="text-xs sm:text-sm font-medium text-purple-400">Key Concepts</h4>
                          <ul className="text-xs sm:text-sm text-gray-300 space-y-1 list-disc pl-4 sm:pl-5">
                            <li>Superposition: Qubits exist in multiple states</li>
                            <li>Entanglement: Quantum correlation between qubits</li>
                            <li>Quantum Gates: Manipulate qubits in algorithms</li>
                          </ul>
                        </div>
                        
                        <div className="px-2 py-1.5 sm:px-3 sm:py-2 bg-purple-950/30 rounded-lg border border-purple-500/20">
                          <p className="text-[10px] sm:text-xs text-purple-300">
                            <span className="font-medium">Pro Tip:</span> Think of superposition like spinning a coin - while it's spinning, it's neither heads nor tails but potentially both until observed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeMode === "visualize" && (
                  <motion.div
                    key="visualize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full p-2 sm:p-4 overflow-y-auto"
                  >
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 h-full border border-white/10 flex flex-col">
                      <h3 className="text-sm sm:text-lg font-medium mb-3 sm:mb-4">Concept Visualization</h3>
                      
                      <div className="flex-1 flex items-center justify-center">
                        <div className="relative w-36 h-36 sm:w-48 sm:h-48">
                          {/* Simplified visualization of qubit representation */}
                          <div className="absolute inset-0 border-2 border-blue-500/50 rounded-full"></div>
                          
                          {/* Bloch sphere representation */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 w-0.5 sm:w-1 h-28 sm:h-40 -translate-x-1/2 -translate-y-1/2"
                            style={{ transformOrigin: "50% 50%" }}
                            animate={{ 
                              rotateY: [0, 180, 360],
                              rotateX: [30, 60, 30]
                            }}
                            transition={{ 
                              duration: 8,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <div className="absolute top-0 w-3 h-3 sm:w-4 sm:h-4 -translate-x-1/2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                          </motion.div>
                          
                          {/* Coordinates */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 sm:-translate-y-6 text-[10px] sm:text-xs text-blue-300">|0⟩</div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 sm:translate-y-6 text-[10px] sm:text-xs text-blue-300">|1⟩</div>
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 text-[10px] sm:text-xs text-blue-300">-X</div>
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 sm:translate-x-6 text-[10px] sm:text-xs text-blue-300">+X</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 sm:mt-4 text-center">
                        <p className="text-xs sm:text-sm text-gray-300">
                          Qubit representation on a Bloch sphere showing superposition state
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// These exports would typically be in another file
export const features = [
  {
    title: "Interactive Learning",
    description: "Engage with concepts through interactive visual simulations and guided explanations.",
    icon: <Brain className="h-6 w-6 text-purple-400" />
  },
  // More features would be here
]

export const popularCourses = [
  {
    id: 1,
    title: "Quantum Computing Fundamentals",
    description: "Learn the basics of quantum computing and quantum mechanics",
    category: "Physics",
    instructor: "Dr. Smith",
    duration: "6 weeks",
    eduTokens: 250
  },
  // More courses would be here
]