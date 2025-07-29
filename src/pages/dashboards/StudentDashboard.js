import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalVideos: 0,
    watchedVideos: 0,
    totalQuizzes: 0,
    passedQuizzes: 0,
    averageQuizScore: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get student ID from user object or localStorage
  const getStudentId = () => {
    console.log('Getting student ID from user:', user);
    
    if (user?.id) return user.id;
    if (user?._id) return user._id;
    
    // Try to get from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user from localStorage:', parsedUser);
        return parsedUser.id || parsedUser._id;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  };

  const studentId = getStudentId();

  useEffect(() => {
    console.log('StudentDashboard mounted, user:', user);
    console.log('Student ID:', studentId);
    fetchData();
  }, [studentId, user]);

  const fetchData = async () => {
    try {
      // Fetch enrollments
      const enrollmentsResponse = await axios.get('/api/enrollments/my-enrollments');
      console.log('Enrollments response:', enrollmentsResponse.data);
      setEnrollments(enrollmentsResponse.data.enrollments || []);

      // Fetch detailed statistics
      const statsResponse = await axios.get('/api/enrollments/student-stats');
      console.log('Stats response:', statsResponse.data);
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
        setRecentActivity(statsResponse.data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-4">
            مرحباً بك، {user?.name}! 👋
            {studentId && (
              <span className="bg-primary-700 text-white rounded px-3 py-1 text-base font-mono select-all" title="Student ID">
                ID: {studentId}
              </span>
            )}
          </h1>
          <p className="text-dark-300">
            استمر في رحلة التعلم. أنت تبلي بلاءً حسناً!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">الكورسات المسجلة</p>
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
                <p className="text-dark-300 text-sm">الكورسات المكتملة</p>
                <p className="text-2xl font-bold text-white">{stats.completedCourses}</p>
                <p className="text-sm text-primary-400">{stats.completionRate}% معدل الإكمال</p>
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
                <p className="text-dark-300 text-sm">الفيديوهات المشاهدة</p>
                <p className="text-2xl font-bold text-white">{stats.watchedVideos}</p>
                <p className="text-sm text-primary-400">من {stats.totalVideos} فيديو</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">الاختبارات المنجزة</p>
                <p className="text-2xl font-bold text-white">{stats.passedQuizzes}</p>
                <p className="text-sm text-primary-400">متوسط {stats.averageQuizScore}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">تقييم الأداء</p>
                <p className="text-2xl font-bold text-white">{stats.performanceRating}</p>
                <p className="text-sm text-primary-400">مستوى الطالب</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stats.performanceColor === 'gold' ? 'bg-yellow-500' :
                stats.performanceColor === 'blue' ? 'bg-blue-600' :
                stats.performanceColor === 'green' ? 'bg-green-600' :
                stats.performanceColor === 'orange' ? 'bg-orange-500' :
                'bg-red-600'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">النشاط الأخير</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                      {activity.subject}
                    </span>
                    <span className="text-dark-300 text-sm">
                      {formatDate(activity.lastActivity)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {activity.courseTitle}
                  </h3>
                  <p className="text-dark-300 text-sm mb-3">
                    المعلم: {activity.teacherName}
                  </p>
                  {activity.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-300">الفيديوهات:</span>
                        <span className="text-white">{activity.progress.completedVideos?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-300">الاختبارات:</span>
                        <span className="text-white">{activity.progress.quizzesTaken?.length || 0}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">كورساتي</h2>
            <Link to="/courses" className="btn-outline">
              تصفح المزيد من الكورسات
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">لم تسجل في أي كورس بعد</h3>
              <p className="text-dark-300 mb-6">ابدأ رحلة التعلم بالتسجيل في كورس</p>
              <Link to="/courses" className="btn-primary">
                تصفح الكورسات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <motion.div
                  key={enrollment._id}
                  className="card hover:shadow-glow transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={enrollment.course.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                      alt={enrollment.course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {enrollment.course.subject}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-dark-900 bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {enrollment.progress ? Math.round((enrollment.progress.completedVideos?.length || 0) / (enrollment.progress.totalVideos || 1) * 100) : 0}% مكتمل
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-400 transition-colors duration-200">
                    {enrollment.course.title}
                  </h3>

                  <p className="text-dark-300 mb-4 line-clamp-2">
                    {enrollment.course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-dark-300">التقدم</span>
                      <span className="text-primary-400">{enrollment.progress ? Math.round((enrollment.progress.completedVideos?.length || 0) / (enrollment.progress.totalVideos || 1) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress ? Math.round((enrollment.progress.completedVideos?.length || 0) / (enrollment.progress.totalVideos || 1) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-dark-300">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{enrollment.progress?.completedVideos?.length || 0} فيديو</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{enrollment.progress?.completedQuizzes?.length || 0} منجز</span>
                      </div>
                    </div>
                    {enrollment.status === 'completed' && (
                      <div className="flex items-center space-x-1 text-green-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>مكتمل</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/courses/${enrollment.course._id}`}
                    className="block btn-primary text-center"
                  >
                    استمر في التعلم
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
