import { Route, Routes } from 'react-router-dom'
import './App.css'
import NotFound from './Pages/NotFound'
import Home from './Pages/Home'
import { Toaster } from "@/Components/ui/sonner"
import { TooltipProvider } from '@/Components/ui/tooltip'
import LecturePage from './Pages/LecturePage'
import CoursesPage from './Pages/Courses'
import HomePage from './Pages/LandingPage'
import CourseLecturesPage from './Pages/LectureList'
import AITeacherPage from './Pages/Meet'
import UserCourses from './Pages/UserCourses'


function App() {

  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />}>
          <Route index element={<HomePage />} />
          <Route path='courses' element = {<CoursesPage/>}/>
          <Route path='courses/:id/lectures/:lectureId' element = {<LecturePage/>}/>
          <Route path = 'userCourses' element = {<UserCourses/>}/>
          <Route path='courses/:id/lectures' element = {<CourseLecturesPage/>} />
          <Route path='meet' element = {<AITeacherPage/>}/>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}

export default App
