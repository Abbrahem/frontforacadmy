import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    overview: {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalCourses: 0,
    totalEnrollments: 0
    },
    activity: {
      videoActivity: [],
      quizActivity: [],
      studentProgress: [],
      coursePopularity: []
    },
    recentActivity: {
      recentEnrollments: [],
      recentVideoCompletions: [],
      recentQuizAttempts: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComprehensiveStats();
  }, []);

  const fetchComprehensiveStats = async () => {
    try {
      const response = await axios.get('/api/admin/comprehensive-stats');
      console.log('Comprehensive stats response:', response.data);
      
      if (response.data.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching comprehensive stats:', error);
      // Fallback to basic stats
      try {
        const basicResponse = await axios.get('/api/admin/dashboard');
        setStats({
          overview: {
            totalUsers: basicResponse.data.users.total,
            totalStudents: basicResponse.data.users.students,
            totalTeachers: basicResponse.data.users.teachers,
            totalParents: basicResponse.data.users.parents,
            totalCourses: basicResponse.data.courses.total,
            totalEnrollments: basicResponse.data.enrollments.total
          },
          activity: { videoActivity: [], quizActivity: [], studentProgress: [], coursePopularity: [] },
          recentActivity: { recentEnrollments: [], recentVideoCompletions: [], recentQuizAttempts: [] }
        });
      } catch (fallbackError) {
        console.error('Error fetching basic stats:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟ سيتم حذف جميع الفيديوهات والاختبارات المرتبطة به.')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        toast.success('تم حذف الكورس بنجاح');
        fetchComprehensiveStats(); // Refresh stats
    } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('فشل في حذف الكورس');
      }
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            لوحة تحكم المدير 🛠️
          </h1>
          <p className="text-dark-300">
            إدارة المنصة ومتابعة الأداء والإحصائيات الشاملة
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-dark-300 text-sm">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-white">{stats.overview.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <p className="text-white font-medium">{stats.overview.totalStudents}</p>
                <p className="text-dark-300">طلاب</p>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">{stats.overview.totalTeachers}</p>
                <p className="text-dark-300">معلمين</p>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">{stats.overview.totalParents}</p>
                <p className="text-dark-300">أولياء أمور</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                <p className="text-dark-300 text-sm">إجمالي الكورسات</p>
                <p className="text-2xl font-bold text-white">{stats.overview.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
            <div className="mt-4">
              <p className="text-sm text-dark-300">التسجيلات النشطة</p>
              <p className="text-lg font-bold text-primary-400">{stats.overview.totalEnrollments}</p>
                </div>
              </div>

              <div className="card">
                  <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">النشاط اليومي</p>
                <p className="text-2xl font-bold text-white">
                  {stats.recentActivity.recentEnrollments.length + 
                   stats.recentActivity.recentVideoCompletions.length + 
                   stats.recentActivity.recentQuizAttempts.length}
                </p>
                  </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                  </div>
                </div>
            <div className="mt-4">
              <p className="text-sm text-dark-300">أنشطة حديثة</p>
              <p className="text-lg font-bold text-primary-400">آخر 7 أيام</p>
              </div>
            </div>
          </motion.div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">نظرة عامة على الأداء</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-300 text-sm">إجمالي الطلاب</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-300 text-sm">إجمالي المعلمين</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalTeachers}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-300 text-sm">إجمالي الكورسات</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalCourses}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-300 text-sm">إجمالي التسجيلات</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalEnrollments}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">النشاط الأخير</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Enrollments */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                التسجيلات الجديدة
              </h3>
              <div className="space-y-3">
                {stats.recentActivity.recentEnrollments.slice(0, 5).map((enrollment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                        <div>
                      <p className="text-white font-medium">{enrollment.student?.name || 'طالب'}</p>
                      <p className="text-dark-300 text-sm">{enrollment.course?.title}</p>
                    </div>
                    <span className="text-primary-400 text-sm">{formatDate(enrollment.enrolledAt)}</span>
                  </div>
                ))}
                {stats.recentActivity.recentEnrollments.length === 0 && (
                  <p className="text-dark-300 text-center py-4">لا توجد تسجيلات حديثة</p>
                )}
                      </div>
                    </div>

            {/* Recent Video Completions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                الفيديوهات المكتملة
              </h3>
              <div className="space-y-3">
                {stats.recentActivity.recentVideoCompletions.slice(0, 5).map((completion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{completion.student?.[0]?.name || 'طالب'}</p>
                      <p className="text-dark-300 text-sm">{completion.video?.[0]?.title || 'فيديو'}</p>
                    </div>
                    <span className="text-primary-400 text-sm">
                      {formatDate(completion.progress?.completedVideos?.completedAt)}
                    </span>
                    </div>
                ))}
                {stats.recentActivity.recentVideoCompletions.length === 0 && (
                  <p className="text-dark-300 text-center py-4">لا توجد فيديوهات مكتملة حديثاً</p>
                )}
              </div>
            </div>
          </div>
          </motion.div>

        {/* Course Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">إدارة الكورسات</h2>
            <Link to="/admin/courses" className="btn-outline">
              إدارة الكورسات
              </Link>
            </div>
            
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-right py-3 px-4 text-white font-medium">اسم الكورس</th>
                    <th className="text-right py-3 px-4 text-white font-medium">المادة</th>
                    <th className="text-right py-3 px-4 text-white font-medium">عدد الطلاب</th>
                    <th className="text-right py-3 px-4 text-white font-medium">الحالة</th>
                    <th className="text-right py-3 px-4 text-white font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.activity.coursePopularity.slice(0, 10).map((course, index) => (
                    <tr key={index} className="border-b border-dark-700 hover:bg-dark-700">
                      <td className="py-3 px-4 text-white">{course.courseTitle || 'كورس'}</td>
                      <td className="py-3 px-4 text-dark-300">{course.subject || 'غير محدد'}</td>
                      <td className="py-3 px-4 text-primary-400 font-medium">{course.enrollmentCount}</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                          نشط
                        </span>
                      </td>
                      <td className="py-3 px-4">
                      <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          حذف
                      </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                    </div>
                  </motion.div>

        {/* Student Performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          >
          <h2 className="text-2xl font-bold text-white mb-6">أداء الطلاب</h2>
            <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-right py-3 px-4 text-white font-medium">الطالب</th>
                    <th className="text-right py-3 px-4 text-white font-medium">عدد الكورسات</th>
                    <th className="text-right py-3 px-4 text-white font-medium">الفيديوهات المشاهدة</th>
                    <th className="text-right py-3 px-4 text-white font-medium">الاختبارات المنجزة</th>
                    <th className="text-right py-3 px-4 text-white font-medium">متوسط الدرجات</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.activity.studentProgress.slice(0, 10).map((student, index) => (
                    <tr key={index} className="border-b border-dark-700 hover:bg-dark-700">
                      <td className="py-3 px-4 text-white">{student.studentName || 'طالب'}</td>
                      <td className="py-3 px-4 text-primary-400">{student.totalCourses}</td>
                      <td className="py-3 px-4 text-white">{student.totalVideosWatched}</td>
                      <td className="py-3 px-4 text-white">{student.totalQuizzesTaken}</td>
                      <td className="py-3 px-4 text-green-400 font-medium">
                        {Math.round(student.averageQuizScore || 0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
