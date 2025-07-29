import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';

const ParentDashboard = () => {
  // const { user } = useAuth();
  const [childData, setChildData] = useState(null);
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

  useEffect(() => {
    fetchChildProgress();
  }, []);

  const fetchChildProgress = async () => {
    try {
      const response = await axios.get('/api/enrollments/parent/child-progress');
      console.log('Child progress response:', response.data);
      
      if (response.data.success) {
        setChildData(response.data.child);
        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching child progress:', error);
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

  if (!childData) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">لم يتم العثور على الطالب</h3>
            <p className="text-dark-300">لم يتم ربط أي طالب بهذا الحساب</p>
          </div>
        </div>
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
            تقدم الطالب: {childData.name} 📊
          </h1>
          <p className="text-dark-300">
            تابع تقدم ابنك في التعلم والتحصيل الدراسي
          </p>

          {/* Child Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">الاسم</p>
                  <p className="text-white font-medium">{childData.name}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">الصف الدراسي</p>
                  <p className="text-white font-medium">{childData.grade}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-dark-300 text-sm">المادة</p>
                  <p className="text-white font-medium">{childData.subject}</p>
                </div>
              </div>
            </div>
          </div>
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
                         <span className="text-white">{activity.progress.completedQuizzes?.length || 0}</span>
                  </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
          )}

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">ملخص الأداء</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Progress */}
          <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                تقدم الفيديوهات
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">الفيديوهات المشاهدة</span>
                  <span className="text-white font-medium">{stats.watchedVideos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">إجمالي الفيديوهات</span>
                  <span className="text-white font-medium">{stats.totalVideos}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stats.totalVideos > 0 ? Math.round((stats.watchedVideos / stats.totalVideos) * 100) : 0}%` }}
                  ></div>
                    </div>
                <p className="text-sm text-primary-400 text-center">
                  {stats.totalVideos > 0 ? Math.round((stats.watchedVideos / stats.totalVideos) * 100) : 0}% من الفيديوهات تمت مشاهدتها
                      </p>
                    </div>
            </div>

            {/* Quiz Performance */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                أداء الاختبارات
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">الاختبارات المنجزة</span>
                  <span className="text-white font-medium">{stats.passedQuizzes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">إجمالي الاختبارات</span>
                  <span className="text-white font-medium">{stats.totalQuizzes}</span>
                    </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">متوسط الدرجات</span>
                  <span className="text-white font-medium">{stats.averageQuizScore}%</span>
                  </div>
                <div className="w-full bg-dark-700 rounded-full h-3">
                  <div
                    className="bg-yellow-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stats.averageQuizScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-primary-400 text-center">
                  متوسط الدرجات في الاختبارات
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;
