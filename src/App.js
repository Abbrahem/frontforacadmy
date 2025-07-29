import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import CourseRequests from './pages/admin/CourseRequests';
import EnrollmentsManagement from './pages/admin/EnrollmentsManagement';
import PerformanceManagement from './pages/admin/PerformanceManagement';
import AdminEditCourse from './pages/admin/EditCourse';
import StudentStats from './pages/parent/StudentStats';
import VideoPlayer from './pages/VideoPlayer';
import QuizPage from './pages/QuizPage';

// Teacher Pages
import CreateCourse from './pages/teacher/CreateCourse';
import UploadVideo from './pages/teacher/UploadVideo';
import CreateQuiz from './pages/teacher/CreateQuiz';
import EditCourse from './pages/teacher/EditCourse';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-900 text-white">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/course-requests" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CourseRequests />
                </ProtectedRoute>
              } />
              <Route path="/admin/enrollments" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EnrollmentsManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/performance" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PerformanceManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/edit-course/:id" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEditCourse />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/create-course" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              <Route path="/teacher/upload-video" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <UploadVideo />
                </ProtectedRoute>
              } />
              <Route path="/teacher/create-quiz" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateQuiz />
                </ProtectedRoute>
              } />
              <Route path="/teacher/edit-course/:id" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <EditCourse />
                </ProtectedRoute>
              } />
              
              {/* Parent Routes */}
              <Route path="/parent/dashboard" element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <ParentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/parent/student-stats" element={
                <ProtectedRoute allowedRoles={['parent']}>
                  <StudentStats />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } />
              
              <Route path="/video/:id" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <VideoPlayer />
                </ProtectedRoute>
              } />
              
              <Route path="/course/:courseId/learn" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <VideoPlayer />
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/:id" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <QuizPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="mt-16"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Access Denied</div>;
  }
};

export default App;
