import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight, Video, Zap, BookOpen, Star } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Badge } from "@/Components/ui/badge"
import Navbar from "@/Components/Navbar"
import CourseGrid from "@/Components/CourseGrid";
import { useReadContract } from "wagmi"
import { ABI, contractAddress } from "@/utils/contractDetails"
import "../Components/loader.css";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedtags, setSelectedtags] = useState("all")
  const [selectedSort, setSelectedSort] = useState("popular")

  const {data , isLoading , error}  = useReadContract({
    abi : ABI,
    address : contractAddress,
    functionName : "getAllCourses"
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if(isLoading){
    return <div className="w-screen h-screen justify-center items-center flex bg-black">
      <span className="loader"></span>
    </div>
  }

  if(error){
    return <div>
      error while fetching data
    </div>
  }

  if(!isLoading && data){

    const filteredCourses = (data as any[])
    .filter(
      (course) =>
        (selectedtags === "all" || course.tags.includes(selectedtags)) &&
        (searchQuery === "" ||
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      if (selectedSort === "popular") return b.students - a.students
      if (selectedSort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (selectedSort === "price-low") return a.price - b.price
      if (selectedSort === "price-high") return b.price - a.price
      return 0
    })
    return (
      <div className="min-h-screen bg-black text-white w-screen flex justify-center flex-col">
        {/* Header */}
        <Navbar/>
        <section className="relative py-20 overflow-hidden w-screen flex justify-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,41,230,0.15),transparent_65%)]" />
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
              className="text-center space-y-4"
            >
              <motion.h1
                variants={fadeIn}
                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
              >
                Explore Courses
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-gray-300 max-w-2xl mx-auto">
                Discover a wide range of blockchain and tech courses to enhance your skills and earn edu-tokens while
                learning.
              </motion.p>
            </motion.div>
          </div>
        </section>
  
        {/* Search and Filter */}
        <section className="py-8 bg-gray-950 w-screen flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 bg-gray-900 border-gray-800 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select value={selectedtags} onValueChange={setSelectedtags}>
                  <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="tags" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Blockchain">Blockchain</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
  
        {/* Course Categories */}
        <section className="py-8 bg-black flex w-screen justify-center">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-gray-900/50 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                  All
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="data-[state=active]:bg-purple-600">
                  Blockchain
                </TabsTrigger>
                <TabsTrigger value="development" className="data-[state=active]:bg-purple-600">
                  Development
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600">
                  AI
                </TabsTrigger>
                <TabsTrigger value="cybersecurity" className="data-[state=active]:bg-purple-600">
                  Cybersecurity
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <CourseGrid courses={filteredCourses} type={{"type" : "all"}}/>
              </TabsContent>
              <TabsContent value="blockchain" className="mt-6">
                <CourseGrid type={{"type" : "all"}} courses={filteredCourses.filter((course) => course.tags.includes("Blockchain"))} />
              </TabsContent>
              <TabsContent value="development" className="mt-6">
                <CourseGrid type={{"type" : "all"}} courses={filteredCourses.filter((course) => course.tags.includes("Development"))} />
              </TabsContent>
              <TabsContent value="ai" className="mt-6">
                <CourseGrid type={{"type" : "all"}} courses={filteredCourses.filter((course) => course.tags.includes("AI"))} />
              </TabsContent>
              <TabsContent value="cybersecurity" className="mt-6">
                <CourseGrid type={{"type" : "all"}} courses={filteredCourses.filter((course) => course.tags.includes("Cybersecurity"))} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
  
        <section className="py-16 bg-gradient-to-b from-black to-purple-950/20 w-screen justify-center flex">
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
              <div className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <Badge className="bg-purple-600 hover:bg-purple-700 mb-4">Featured Course</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Advanced Blockchain Development Masterclass
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Master the art of blockchain development with this comprehensive course. Learn to build decentralized
                    applications, create smart contracts, and understand the intricacies of blockchain architecture.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-gray-300">24 Lectures</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-gray-300">40+ Hours</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">4.9 (120 reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-white flex items-center">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                      120 EDU
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }
}
