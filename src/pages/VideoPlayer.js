import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [hasMarkedWatched, setHasMarkedWatched] = useState(false);

  const fetchVideo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/videos/${id}`);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Video not found or access denied');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await axios.get(`/api/quizzes/video/${id}`);
      if (response.data && response.data.quiz) {
        setQuiz(response.data.quiz);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      // Quiz might not exist, which is okay
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      if (fetchVideo) {
        await fetchVideo();
      }
      if (fetchQuiz) {
        await fetchQuiz();
      }
    };
    loadData();
  }, [id, fetchVideo, fetchQuiz]);

  const markVideoWatched = async () => {
    if (hasMarkedWatched) return;
    
    try {
      await axios.post(`/api/enrollments/watch-video/${id}`, {
        watchTime: Math.floor(watchTime)
      });
      setHasMarkedWatched(true);
      toast.success('Video marked as watched! ✅');
    } catch (error) {
      console.error('Error marking video as watched:', error);
    }
  };

  const handleVideoProgress = (currentTime, duration) => {
    setWatchTime(currentTime);
    
    // Mark as watched when 80% of video is watched
    if (!hasMarkedWatched && currentTime / duration >= 0.8) {
      markVideoWatched();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Video Not Found</h2>
          <p className="text-dark-300">The video you're looking for doesn't exist or you don't have access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <nav className="flex items-center space-x-2 text-sm text-dark-300">
            <Link to="/dashboard" className="hover:text-white transition-colors duration-200">
              Dashboard
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link 
              to={`/courses/${video.course._id}`} 
              className="hover:text-white transition-colors duration-200"
            >
              {video.course.title}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{video.title}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="bg-dark-800 rounded-xl overflow-hidden">
                <div className="aspect-video">
                  <video
                    controls
                    className="w-full h-full"
                    poster={video.thumbnail}
                    onTimeUpdate={(e) => handleVideoProgress(e.target.currentTime, e.target.duration)}
                    onEnded={() => !hasMarkedWatched && markVideoWatched()}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {video.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-dark-300 mb-6">
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Math.floor(video.duration / 60)} minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{video.viewCount} views</span>
                </div>
                {hasMarkedWatched && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Watched</span>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-dark-300 leading-relaxed">{video.description}</p>
              </div>

              {/* Mark as Watched Button */}
              {!hasMarkedWatched && (
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <button
                    onClick={markVideoWatched}
                    className="btn-primary"
                  >
                    Mark as Watched
                  </button>
                  <p className="text-dark-400 text-sm mt-2">
                    Or watch 80% of the video to automatically mark as watched
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-24 space-y-6"
            >
              {/* Quiz Section */}
              {quiz && (
                <div className="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Quiz Available</h3>
                      <p className="text-dark-300 text-sm">Test your knowledge</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-300">Questions</span>
                      <span className="text-white">{quiz.questions?.length || 8}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-300">Time Limit</span>
                      <span className="text-white">{quiz.timeLimit} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-300">Passing Score</span>
                      <span className="text-white">{quiz.passingScore}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    disabled={!hasMarkedWatched}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {hasMarkedWatched ? 'Take Quiz' : 'Watch Video First'}
                  </button>
                  
                  {!hasMarkedWatched && (
                    <p className="text-dark-400 text-xs mt-2 text-center">
                      Complete the video to unlock the quiz
                    </p>
                  )}
                </div>
              )}

              {/* Course Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Course Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-medium">{video.course.title}</h4>
                    <p className="text-dark-300 text-sm">{video.course.subject} • {video.course.grade}</p>
                  </div>
                  
                  <Link
                    to={`/courses/${video.course._id}`}
                    className="block btn-outline text-center"
                  >
                    View Course
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
                
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-dark-300 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <span>Back to Dashboard</span>
                  </Link>
                  
                  <Link
                    to={`/courses/${video.course._id}`}
                    className="flex items-center space-x-2 text-dark-300 hover:text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Course Overview</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
