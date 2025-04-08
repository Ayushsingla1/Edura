import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  DownloadCloud,
  MessageSquare,
  Play,
  Video,
  Brain,
  BookOpen,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Zap,
  Pause,
  Volume2,
  VolumeX,
  Settings
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Progress } from "@/Components/ui/progress";
import axios from "axios";
import { notesData } from "@/lib/data";

export default function LecturePage() {

  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("video");
  const [progress, setProgress] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [lecture, setLecture] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [notes, setNotes] = useState();
  const [notesLoading, setNotesLoading] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const formatTime = (timeInSeconds : number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        //@ts-ignore
        videoRef.current.pause();
      } else {
       //@ts-ignore 
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      //@ts-ignore
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Update progress bar when video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      //@ts-ignore
      const current = videoRef.current.currentTime;
      //@ts-ignore
      const duration = videoRef.current.duration;
      const progressPercentage = (current / duration) * 100;
      setCurrentTime(current);
      setProgress(progressPercentage);
    }
  };

  // Set video progress when clicking on progress bar
  const handleProgressClick = (e : any) => {
    if (videoRef.current && videoLoaded) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.clientWidth;
      const seekPercentage = (clickPosition / progressBarWidth);
      //@ts-ignore
      const seekTime = seekPercentage * videoRef.current.duration;
      //@ts-ignore
      videoRef.current.currentTime = seekTime;
      setProgress(seekPercentage * 100);
    }
  };

  // Handle video metadata loaded - get duration
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      //@ts-ignore
      setVideoDuration(videoRef.current.duration);
      setVideoLoaded(true);
    }
  };

  useEffect(() => {

    console.log(activeTab);
    if (activeTab === "video" && !videoRef.current) {
      // Only use this interval if video element isn't available yet
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) return prev + 0.1;
          clearInterval(interval);
          return 100;
        });
      }, 100);
      return () => clearInterval(interval);
    }
    else if (activeTab === "notes" && !notes) {
      // console.log("hello jiii ")
      setNotesLoading(true);
      const fxn = async () => {
        try {
          const res = await axios.get('http://localhost:3000/api/v1/get-notes', { params: { id: lectureId } });
          console.log(res.data);
          setNotes(res.data);
        } catch (error) {
          console.log(error);
        }
        finally {
          setNotesLoading(false);
        }
      }
      fxn();
    }
    else if (activeTab === "quiz") {
      setQuizLoading(true);
      if (notes) {
        const fxn = async () => {
          try {
            const res = await axios.post('http://localhost:3000/api/v1/get-quiz', { transcript: notes });
            console.log(res.data);
            setQuiz(res.data.questions);
          } catch (e) {
            console.log(e);
          }
          finally {
            setQuizLoading(false);
          }
        }
        fxn();
      }
      else {
        const fxn = async () => {
          try {
            const res = await axios.get('http://localhost:3000/api/v1/get-notes', { params: { id: lectureId } });
            console.log(res.data);
            const res2 = await axios.post('http://localhost:3000/api/v1/get-quiz', { transcript: res.data });
            setNotes(res.data);
            setQuiz(res2.data.questions);
          } catch (error) {
            console.log(error);
          }
          finally {
            setQuizLoading(false);
          }
        }
        fxn();
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const myfxn = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/api/v1/get-lecture', { params: { id: lectureId } });
        console.log(res.data);
        setLecture(res.data.lecture);
        if (res.data.lecture.transcription.length != 0) setNotes(res.data.lecture.transcription);
      } catch (error) {
        console.log("error loading lecture");
        //@ts-ignore
        setError(error);
      }
      finally {
        setIsLoading(false);
      }
    }
    myfxn();
  }, [lectureId]);

  const toggleSection = (sectionId : any) => {
    setExpandedSections(prev => ({
      ...prev,
      //@ts-ignore
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleAnswerSelect = (questionIndex : number, answerIndex:number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleQuizSubmit = () => {
    setQuizCompleted(true);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    Object.keys(selectedAnswers).forEach((questionIndex : any)=> {

      const question = quiz[questionIndex];
      if (question.options[(selectedAnswers as any[])[questionIndex]] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      score: correct,
      total: quiz.length,
      percentage: Math.round((correct / quiz.length) * 100)
    };
  };

  if (isLoading) {
    return <div className="flex w-screen h-screen bg-black justify-center items-center">
      <span className="loader"></span>
    </div>
  }

  if (error) {
    return <div className="flex w-screen h-screen bg-black justify-center items-center text-white flex-col gap-y-10">
      <div>Error 404 | Not Found</div>
      <button className="flex bg-purple-900 px-5 py-2 rounded-xl text-center" onClick={() => navigate(-1)}>Back</button>
    </div>
  }

  if (!isLoading && !error) {

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Course
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <DownloadCloud className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-3/4 mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{(lecture as any)?.name}</h1>
                <p className="text-gray-400">{(lecture as any)?.description}</p>

                <div className="flex items-center mt-4 text-sm text-gray-400">
                  <div className="flex items-center mr-4">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-2" />
                    <span>{(lecture as any)?.course?.educatorName}</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Video className="h-4 w-4 mr-1" />
                    <span>{videoLoaded ? formatTime(videoDuration) : (0)}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="px-2 py-1 bg-purple-600/50 text-white text-xs rounded-md">
                      {(lecture as any)?.course?.category || "Blockchain"}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="video" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="video" className="data-[state=active]:bg-purple-600">
                    <Video className="h-4 w-4 mr-2" /> Video
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-purple-600">
                    <BookOpen className="h-4 w-4 mr-2" /> Notes
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="data-[state=active]:bg-purple-600">
                    <Brain className="h-4 w-4 mr-2" /> Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                    {/* Actual video element */}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      src={(lecture as any)?.url || (videoRef as any).current?.src || "#"}
                      onClick={togglePlayPause}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleMetadataLoaded}
                      onEnded={() => setIsPlaying(false)}
                      poster="/video-thumbnail.jpg"
                    />

                    {/* Play button overlay - show only when paused */}
                    {!isPlaying && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={togglePlayPause}
                      >
                        <div className="bg-purple-600/80 rounded-full h-16 w-16 flex items-center justify-center hover:bg-purple-600 transition-colors">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Video controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      {/* Progress bar */}
                      <div
                        className="relative h-1 mb-2 bg-white/20 cursor-pointer rounded-full overflow-hidden"
                        onClick={handleProgressClick}
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-purple-600"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex justify-between items-center text-sm text-white">
                        <div className="flex items-center space-x-4">
                          <button
                            className="focus:outline-none hover:text-purple-400 transition-colors"
                            onClick={togglePlayPause}
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </button>

                          <button
                            className="focus:outline-none hover:text-purple-400 transition-colors"
                            onClick={toggleMute}
                          >
                            {isMuted ? (
                              <VolumeX className="h-5 w-5" />
                            ) : (
                              <Volume2 className="h-5 w-5" />
                            )}
                          </button>

                          <span>
                            {formatTime(currentTime)} / {videoLoaded ? formatTime(videoDuration) : "00:00"}
                          </span>
                        </div>

                        <button className="focus:outline-none hover:text-purple-400 transition-colors">
                          <Settings className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="text-sm text-gray-400 mb-1">Course Progress</div>
                        <Progress value={20} className="h-2 w-32 bg-white/20" />
                      </div>
                      <div className="text-sm text-purple-400">{20}% complete</div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-300 mr-2">Earn on completion:</span>
                      <span className="flex items-center text-sm text-yellow-400">
                        <Zap className="h-3 w-3 mr-1" />
                        {(lecture as any)?.course?.price || 1} EDU
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-4">Rate this lecture</h3>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/5">
                        <ThumbsUp className="h-5 w-5 mr-2" />
                        Helpful
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/5">
                        <ThumbsDown className="h-5 w-5 mr-2" />
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="focus-visible:outline-none focus-visible:ring-0">
                  {
                    notesLoading ? (<div className="flex justify-center items-center text-white"><span>Loading...</span></div>) : (
                      <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-medium text-white mb-2">Transcription</h3>
                      <p className="text-gray-300">{notes}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-medium text-white mb-2">Key Points</h3>
                      <ul className="space-y-2">
                        {notesData.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mt-1 h-4 w-4 rounded-full bg-purple-600/50 mr-2" />
                            <span className="text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">Detailed Notes</h3>
                      <div className="space-y-4">
                        {notesData?.detailedNotes.map((section : any, index : number) => (
                          <div
                            key={index}
                            className="border border-white/10 rounded-lg overflow-hidden"
                          >
                            <div
                              className="flex justify-between items-center p-4 bg-white/5 cursor-pointer"
                              onClick={() => toggleSection(section.title)}
                            >
                              <h4 className="font-medium text-white">{section.title}</h4>
                              {//@ts-ignore
                              expandedSections[section.title] ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            {//@ts-ignore
                            expandedSections[section.title] && (
                              <div className="p-4 border-t border-white/10">
                                <p className="text-gray-300">{section.content}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                    )
                  }
                </TabsContent>

                <TabsContent value="quiz" className="focus-visible:outline-none focus-visible:ring-0">
                  {
                    quizLoading ? (<div className="flex justify-center items-center text-white h-full"><span>Generating a quiz for you...</span></div>) : (<div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                      {!quizStarted ? (
                        <div className="text-center py-8">
                          <ClipboardCheck className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                          <h3 className="text-2xl font-medium text-white mb-2">Ready to Test Your Knowledge?</h3>
                          <p className="text-gray-300 max-w-md mx-auto mb-6">
                            This quiz contains {(quiz as any[]).length} questions to test your understanding of the lecture content.
                          </p>
                          <Button
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            onClick={() => setQuizStarted(true)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Quiz
                          </Button>
                        </div>
                      ) : quizCompleted ? (
                        <div className="text-center py-8">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-12 w-12 text-purple-400" />
                          </div>
  
                          <h3 className="text-2xl font-medium text-white mb-2">Quiz Completed!</h3>
  
                          <div className="mb-6">
                            <div className="text-4xl font-bold text-white mb-1">
                              {calculateQuizScore().score}/{calculateQuizScore().total}
                            </div>
                            <p className="text-gray-300">
                              You scored {calculateQuizScore().percentage}%
                            </p>
                          </div>
  
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                              variant="outline"
                              className="border-purple-500 text-purple-400 hover:bg-purple-950/30"
                              onClick={() => {
                                setQuizStarted(false);
                                setQuizCompleted(false);
                                setSelectedAnswers({});
                              }}
                            >
                              Retry Quiz
                            </Button>
                            <Button
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              onClick={() => navigate(`/courses/${(lecture as any).course.courseId}/lectures/${(lecture as any)?.id}`)}
                            >
                              Next Lecture
                            </Button>
                          </div>
  
                          <div className="mt-8 p-4 bg-purple-600/20 rounded-lg border border-purple-500/30 inline-block">
                            <div className="flex items-center text-purple-300">
                              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                              You've earned {(lecture as any)?.course?.price || 0.05} EDU tokens for completing this quiz!
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-medium text-white">Question {currentQuestion + 1} of {quiz.length}</h3>
                            <Progress value={(currentQuestion + 1) / quiz.length * 100} className="w-32 h-2 bg-white/20" />
                          </div>
  
                          <div className="mb-8">
                            <h4 className="text-lg font-medium text-white mb-4">{quiz[currentQuestion].question}</h4>
                            <div className="space-y-3">
                              {quiz[currentQuestion].options.map((option : any, index : number) => (
                                <div
                                  key={index}
                                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${//@ts-ignore
                                     selectedAnswers[currentQuestion] === index
                                      ? 'border-purple-500 bg-purple-500/20'
                                      : 'border-white/10 hover:border-white/30'
                                    }`}
                                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                                >
                                  <div className="flex items-center">
                                    <div className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center ${//@ts-ignore
                                   selectedAnswers[currentQuestion] === index
                                        ? 'bg-purple-500'
                                        : 'border border-white/50'
                                      }`}>
                                      {//@ts-ignore
                                        selectedAnswers[currentQuestion] === index && (
                                        <div className="h-2 w-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                    <span className="text-gray-200">{option}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
  
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              className="border-white/20 text-gray-300 hover:bg-white/5"
                              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                              disabled={currentQuestion === 0}
                            >
                              Previous
                            </Button>
  
                            {currentQuestion < quiz.length - 1 ? (
                              <Button
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                                disabled={//@ts-ignore 
                                selectedAnswers[currentQuestion] === undefined}
                              >
                                Next
                              </Button>
                            ) : (
                              <Button
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(selectedAnswers).length < quiz.length}
                              >
                                Submit Quiz
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>)
                  }
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}