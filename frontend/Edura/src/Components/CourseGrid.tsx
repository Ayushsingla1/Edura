import { Star, Video, Zap } from "lucide-react";
import {motion} from "motion/react"
import PurchaseButton from "./PurchaseButton";
import { useNavigate } from "react-router-dom";

function CourseGrid({ courses,type } : {courses : any , type : {type : string}}) {

  const navigate = useNavigate();
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course : any, index : number) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group"
          >
            {/* <a href={`/courses/${course.courseId}`}> */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 relative overflow-hcourseIdden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-12 w-12 text-white/50" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-x-4">
                      {
                        course.tags.map((category : string , index : number) => {
                          <span  key = {index } className="px-2 py-1 bg-purple-600/80 text-white text-xs rounded-md">{category}</span>
                        })
                      }
                      </div>
                      <span className="flex items-center text-white text-xs">
                        <Zap className="h-3 w-3 mr-1 text-yellow-400" />
                        {parseInt(course.price)/(10**17)} EDU
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-b-xl">
                  <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                      <span className="text-xs text-gray-400 ml-2">{course.educatorName}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-xs text-gray-400">4.9</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs text-gray-400">100+ students</div>
                    {
                      type.type === "all" ? (<PurchaseButton data = {{courseId : course.courseId as number , price : course.price as number}}/>) : (<button className="bg-purple-900 px-3 py-2 rounded-2xl text-white text-center" onClick={() => navigate(`/courses/${course.courseId}/lectures`)}>Watch</button>)
                    }
                  </div>
                </div>
              </div>
            {/* </a> */}
          </motion.div>
        ))}
      </div>
    )
  }

  

export default CourseGrid;