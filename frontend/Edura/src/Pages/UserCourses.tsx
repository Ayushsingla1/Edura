import { motion } from "framer-motion"
import { Tabs, TabsContent}  from "@/Components/ui/tabs"
import Navbar from "@/Components/Navbar"
import CourseGrid from "@/Components/CourseGrid";
import { useAccount, useReadContract } from "wagmi"
import { ABI, contractAddress } from "@/utils/contractDetails"
import "../Components/loader.css";
import { useNavigate } from "react-router-dom"

export default function UserCourses() {

  const navigate = useNavigate();
  const {address} = useAccount();
  const {data , isLoading , error} = useReadContract({
    abi : ABI,
    address : contractAddress,
    functionName : "getStudentCourses",
    account : address
  })
  const {data : data2 , isLoading : isLoading2 , error : error2} = useReadContract({
    abi : ABI,
    address : contractAddress,
    functionName : "getAllCourses"
  })
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if(isLoading || isLoading2){
    return <div className="w-screen h-screen justify-center items-center flex bg-black">
      <span className="loader"></span>
    </div>
  }

  if(error || error2){
    return <div>
      error while fetching data
    </div>
  }

  if(!isLoading && !isLoading2 && (data as any[]).length === 0){
    return <div className="flex bg-black w-screen h-screen justify-center items-center text-white gap-y-10 flex-col">
        <div>No courses purchased</div>
        <button onClick={() => navigate('/courses')} className="px-4 py-2 rounded-xl bg-gradient-to-l from-blue-900 to-purple-900 hover:cursor-pointer">View Courses</button>
    </div>
  }

  if(!isLoading && !isLoading2 && data){

    const filteredCourses : any[] = [];
    for(let i = 0 ; i < (data as any[]).length ; i++){
        for(let j = 0; j < (data2 as any[]).length ; j++){
            if((data2 as any[])[j]?.courseId === (data as any[])[i]) filteredCourses.push((data2 as any[])[j]);
        }
    }
    console.log(filteredCourses)
    return (
      <div className="min-h-screen bg-black text-white w-screen flex justify-center flex-col">
        <Navbar/>
        <section className="relative py-28 overflow-hidden w-screen flex justify-center">
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
  
        {/* Course Categories */}
        <section className="py-8 bg-black flex w-screen justify-center">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsContent value="all" className="mt-6">
                <CourseGrid courses={filteredCourses} type = {{"type" : "user"}}/>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    )
  }
}