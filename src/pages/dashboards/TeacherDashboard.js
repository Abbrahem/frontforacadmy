import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    approvedCourses: 0,
    pendingCourses: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  const fetchMyCourses = useCallback(async () => {
    try {
      const response = await axios.get('/api/courses/teacher/my-courses');
      setCourses(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (user?.isApproved) {
        await fetchMyCourses();
        await fetchEnrolledStudents();
      } else {
        setLoading(false);
      }
    };
    loadData();
  }, [user, fetchMyCourses]);

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get('/api/enrollments/teacher/students');
      setEnrolledStudents(response.data);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
    }
  };

  const calculateStats = (courseData) => {
    const totalCourses = courseData.length;
    const approvedCourses = courseData.filter(c => c.isApproved).length;
    const pendingCourses = courseData.filter(c => !c.isApproved).length;
    const totalStudents = courseData.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);

    setStats({
      totalCourses,
      approvedCourses,
      pendingCourses,
      totalStudents
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone and will delete all associated videos, quizzes, and enrollments.')) {
      return;
    }

    try {
      await axios.delete(`/api/courses/${courseId}/teacher`);
      toast.success('Course deleted successfully');
      fetchMyCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  if (!user?.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card max-w-md mx-auto text-center"
        >
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Account Pending Approval</h2>
          <p className="text-dark-300 mb-6">
            Your teacher account is currently under review by our admin team. 
            You'll receive access to create courses once approved.
          </p>
          <div className="bg-dark-700 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">What happens next?</h3>
            <ul className="text-dark-300 text-sm space-y-1 text-left">
              <li>• Admin reviews your qualifications</li>
              <li>• You'll be notified via email</li>
              <li>• Full access granted upon approval</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome, {user?.name}! 👨‍🏫
          </h1>
          <p className="text-dark-300">
            Manage your courses and track student progress
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Total Courses</p>
                <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{stats.approvedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pendingCourses}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/teacher/create-course" className="card hover:shadow-glow transition-all duration-300 text-left group block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors duration-200">
                    Create Course
                  </h3>
                  <p className="text-dark-300 text-sm">Create course with image upload</p>
                </div>
              </div>
            </Link>

            <Link to="/teacher/upload-video" className="card hover:shadow-glow transition-all duration-300 text-left group block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-green-400 transition-colors duration-200">
                    Upload Video
                  </h3>
                  <p className="text-dark-300 text-sm">Upload to your courses via Cloudinary</p>
                </div>
              </div>
            </Link>

            <Link to="/teacher/create-quiz" className="card hover:shadow-glow transition-all duration-300 text-left group block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors duration-200">
                    Create Quiz
                  </h3>
                  <p className="text-dark-300 text-sm">8 questions with answer marking</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* My Courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Courses</h2>
            <button className="btn-primary">Create New Course</button>
          </div>

          {courses.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses created yet</h3>
              <p className="text-dark-300 mb-6">Start by creating your first course to share knowledge with students</p>
              <button className="btn-primary">Create Your First Course</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  className="card hover:shadow-glow transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={course.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {course.subject}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        course.isApproved 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white'
                      }`}>
                        {course.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors duration-200">
                    {course.title}
                  </h3>

                  <p className="text-dark-300 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-dark-300">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span>{course.enrollmentCount || 0} students</span>
                      </div>
                    </div>
                    <span className="text-sm text-primary-400 font-medium">{course.grade}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary text-sm py-2">
                      Manage
                    </button>
                    <button className="btn-secondary text-sm py-2 px-4">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course._id)}
                      className="btn-secondary text-sm py-2 px-4 bg-red-600 hover:bg-red-700 text-white"
                      title="Delete course and all associated content"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Enrolled Students */}
        {enrolledStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Enrolled Students</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledStudents.map((courseData) => (
                <div key={courseData.course._id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{courseData.course.title}</h3>
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                      {courseData.students.length} students
                    </span>
                  </div>
                  
                  {courseData.students.length === 0 ? (
                    <p className="text-dark-300 text-center py-4">No students enrolled yet</p>
                  ) : (
                    <div className="space-y-3">
                      {courseData.students.slice(0, 5).map((enrollment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {enrollment.student?.name?.charAt(0) || 'S'}
                              </span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">
                                {enrollment.student?.name || 'Unknown Student'}
                              </p>
                              <p className="text-dark-300 text-xs">
                                Grade: {enrollment.student?.grade || 'Not specified'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-primary-400 text-sm font-medium">
                              {enrollment.completionPercentage || 0}%
                            </p>
                            <p className="text-dark-300 text-xs">
                              {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {courseData.students.length > 5 && (
                        <div className="text-center">
                          <p className="text-dark-300 text-sm">
                            +{courseData.students.length - 5} more students
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
