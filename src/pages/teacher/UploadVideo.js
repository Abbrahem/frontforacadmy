import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.courses || []);
      setCoursesLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('فشل في تحميل الكورسات');
      setCoursesLoading(false);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error('Video file size must be less than 500MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }
    
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }
    
    if (!videoTitle.trim()) {
      toast.error('Please enter a video title');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', videoTitle);
      formData.append('description', videoDescription);
      formData.append('courseId', selectedCourse);

      await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      toast.success('تم رفع الفيديو بنجاح!');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-dark-300">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
          <p className="text-dark-300">
            Add a new video to one of your approved courses
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card text-center"
          >
            <div className="py-12">
              <div className="mx-auto h-16 w-16 bg-dark-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Approved Courses</h3>
              <p className="text-dark-300 mb-6">
                You need to have at least one approved course before you can upload videos.
              </p>
              <button
                onClick={() => navigate('/teacher/create-course')}
                className="btn-primary"
              >
                Create Your First Course
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Select Course *
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <p className="text-dark-400 text-sm mt-1">
                  Only your approved courses are shown
                </p>
              </div>

              {/* Video Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="input-field"
                  placeholder="Enter video title"
                  required
                />
              </div>

              {/* Video Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Video Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Describe what this video covers"
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Video File *
                </label>
                <div className="border-2 border-dashed border-dark-600 rounded-lg p-6">
                  {videoFile ? (
                    <div className="text-center space-y-4">
                      <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{videoFile.name}</p>
                        <p className="text-dark-300 text-sm">{formatFileSize(videoFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVideoFile(null)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove Video
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="mx-auto h-16 w-16 bg-dark-700 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-primary-400 hover:text-primary-300 font-medium">
                            Upload Video File
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="hidden"
                            required
                          />
                        </label>
                        <p className="text-dark-400 text-sm mt-1">
                          MP4, MOV, AVI up to 500MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-300">Uploading...</span>
                    <span className="text-primary-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-dark-600 text-dark-300 rounded-lg hover:bg-dark-700 transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedCourse || !videoFile}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    'Upload Video'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-300 font-medium mb-1">Video Upload Tips</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Videos are uploaded to Cloudinary for optimal streaming</li>
                <li>• Maximum file size: 500MB</li>
                <li>• Supported formats: MP4, MOV, AVI</li>
                <li>• Videos will be available immediately after upload</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadVideo;
