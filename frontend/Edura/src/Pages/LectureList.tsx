import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Play, Video, Zap } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Progress } from "@/Components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Badge } from "@/Components/ui/badge"
import Navbar from "@/Components/Navbar"
import { useParams, Link, useNavigate } from "react-router-dom"
import "../Components/loader.css"
import useSWR from 'swr'
import axios from "axios"
import CommitMent from "@/Components/Commitment"
export default function CourseLecturesPage() {

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("lectures");
  const { data, isLoading: lecturesLoading, error } = useSWR(
    "/get-course-lectures",
    () => axios.get(`${process.env.VITE_BACKEND_URL}/api/v1/get-course-lectures`, { params: { courseId: id } }).then(res => res.data)
  );

  const progress = 50;
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (lecturesLoading) {
    return <div className="w-screen h-screen justify-center items-center flex bg-black">
      <span className="loader"></span>
    </div>
  }

  if (error) {
    return <div className="w-screen h-screen justify-center items-center flex flex-col bg-black text-white">
      <h2 className="text-2xl mb-4">Error loading course data</h2>
      <Link to="/courses">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </Link>
    </div>
  }

  const lectures = data?.lectures;

  return (
    <div className="min-h-screen bg-black text-white w-screen flex justify-center flex-col">
      {/* Header */}
      <Navbar />

      {/* Course Header */}
      <section className="relative py-10 overflow-hidden w-screen flex justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,41,230,0.15),transparent_65%)]" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Link to="/courses" className="mr-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-purple-900/20">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <motion.h1
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
              >
                {data?.name || "Advanced Blockchain Development Masterclass"}
              </motion.h1>
            </div>
            <Badge className="bg-purple-600 hover:bg-purple-600">
              <Zap className="h-4 w-4 mr-1" />
              {data?.price || 120} EDU
            </Badge>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Your progress</span>
              <span className="text-gray-300">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600" style={{ width: `${progress}%` }} />
            </Progress>
          </div>
        </div>
      </section>

      {/* Commitment Feature */}
      <CommitMent/>

      {/* Tabs and Content */}
      <section className="flex-1 bg-gray-950 w-screen flex justify-center">
        <div className="container px-4 md:px-6 py-8">
          <Tabs defaultValue="lectures" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-900/50 p-1 mb-6">
              <TabsTrigger value="lectures" className="data-[state=active]:bg-purple-600">
                Lectures
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600">
                Resources
              </TabsTrigger>
              <TabsTrigger value="discussion" className="data-[state=active]:bg-purple-600">
                Discussion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lectures" className="space-y-4 mt-4">
              {lectures.map((lecture : any, index : number) => (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={"p-4 rounded-lg border border-purple-900/30 bg-purple-900/10 flex items-center justify-between group"}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 rounded-full bg-gray-800">
                      <Video className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className={`font-medium text-white`}>
                        {lecture.title || lecture.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {lecture.duration}
                        <span className="mx-2">•</span>
                        {"Video"}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={"default"}
                    className={"bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"}
                    onClick={() => navigate(`/courses/${id}/lectures/${lecture.id}`)}
                  >
                    <>Continue<Play className="ml-2 h-4 w-4" /></>
                  </Button>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <div className="p-8 rounded-lg border border-gray-800 bg-gray-900/30 text-center">
                <h3 className="text-xl font-medium mb-4">Course Resources</h3>
                <p className="text-gray-400">No resources available for this course yet.</p>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-4">
              <div className="p-8 rounded-lg border border-gray-800 bg-gray-900/30 text-center">
                <h3 className="text-xl font-medium mb-4">Discussion Forum</h3>
                <p className="text-gray-400 mb-6">Connect with fellow students and instructors in the course discussion forum.</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Join Discussion
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}