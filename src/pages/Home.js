import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const [latestCourses, setLatestCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchLatestCourses();
  }, []);

  const fetchLatestCourses = async () => {
    try {
      const response = await axios.get('/api/courses/approved');
      if (response.data.success) {
        // Get latest 6 courses
        const latest = response.data.courses.slice(0, 6);
        setLatestCourses(latest);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest courses:', error);
      setLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const { name, phone, message } = contactForm;
    const whatsappMessage = `Hello! I'm ${name}. Phone: ${phone}. Message: ${message}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    setContactForm({ name: '', phone: '', message: '' });
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const getHeroButtons = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link to="/courses" className="btn-primary text-lg px-8 py-4">
            Explore Courses
          </Link>
          <Link to="/register" className="btn-outline text-lg px-8 py-4">
            Join Now
          </Link>
        </>
      );
    }

    // User is logged in, show role-specific buttons
    switch (user?.role) {
      case 'student':
        return (
          <Link to="/courses" className="btn-primary text-lg px-8 py-4">
            Explore Courses
          </Link>
        );
      case 'teacher':
        return (
          <Link to="/teacher/dashboard" className="btn-primary text-lg px-8 py-4">
            Go to Dashboard
          </Link>
        );
      case 'parent':
        return (
          <Link to="/parent/dashboard" className="btn-primary text-lg px-8 py-4">
            View Child Progress
          </Link>
        );
      case 'admin':
        return (
          <Link to="/admin/dashboard" className="btn-primary text-lg px-8 py-4">
            Admin Dashboard
          </Link>
        );
      default:
        return (
          <Link to="/courses" className="btn-primary text-lg px-8 py-4">
            Explore Courses
          </Link>
        );
    }
  };

  // Helper function to get a color based on subject
  const getCourseColor = (subject) => {
    switch (subject) {
      case 'اللغة العربية':
        return '#4CAF50'; // Green
      case 'اللغة الإنجليزية':
        return '#2196F3'; // Blue
      case 'الرياضيات':
        return '#FF9800'; // Orange
      case 'الفيزياء':
        return '#F44336'; // Red
      case 'الكيمياء':
        return '#9C27B0'; // Purple
      case 'الأحياء':
        return '#00BCD4'; // Cyan
      case 'الجيولوجيا':
        return '#795548'; // Brown
      case 'الفرنساوي':
        return '#E91E63'; // Pink
      case 'التاريخ':
        return '#673AB7'; // Indigo
      case 'الجغرافيا':
        return '#4CAF50'; // Green
      case 'الفلسفة':
        return '#FFC107'; // Amber
      default:
        return '#9E9E9E'; // Grey
    }
  };

  // Helper function to get a darker shade of the color
  const getCourseColorDark = (subject) => {
    switch (subject) {
      case 'اللغة العربية':
        return '#388E3C'; // Darker Green
      case 'اللغة الإنجليزية':
        return '#1976D2'; // Darker Blue
      case 'الرياضيات':
        return '#FBC02D'; // Darker Orange
      case 'الفيزياء':
        return '#D32F2F'; // Darker Red
      case 'الكيمياء':
        return '#7B1FA2'; // Darker Purple
      case 'الأحياء':
        return '#0097A7'; // Darker Cyan
      case 'الجيولوجيا':
        return '#5D4037'; // Darker Brown
      case 'الفرنساوي':
        return '#C62828'; // Darker Pink
      case 'التاريخ':
        return '#512DA8'; // Darker Indigo
      case 'الجغرافيا':
        return '#388E3C'; // Darker Green
      case 'الفلسفة':
        return '#F57C00'; // Darker Amber
      default:
        return '#607D8B'; // Darker Grey
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 text-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to{' '}
            <span className="text-gradient">Areeb</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-dark-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering students, teachers, and parents through innovative online learning experiences
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {getHeroButtons()}
          </motion.div>
        </div>
      </section>

      {/* Latest Courses Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Latest <span className="text-gradient">Courses</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-dark-300 max-w-2xl mx-auto px-4">
              Discover our newest educational content designed to help you succeed
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-32 bg-dark-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {latestCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Top Section with Colored Background */}
                  <div 
                    className="h-48 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden"
                      style={{
                      background: `linear-gradient(135deg, ${getCourseColor(course.subject)} 0%, ${getCourseColorDark(course.subject)} 100%)`
                    }}
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Course Title */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium">
                        {course.subject}
                      </p>
                    </div>

                    {/* Decorative Icon */}
                    <div className="absolute bottom-4 right-4 opacity-10 transform rotate-12 scale-150">
                      <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Bottom Section with Stats */}
                  <div className="bg-dark-800 p-3 sm:p-4">
                    {/* Stats Row */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white/80 text-xs sm:text-sm">
                          {course.videos?.length || 0} درس
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span className="text-white/80 text-xs sm:text-sm">
                          {course.enrollmentCount || 0} طالب
                        </span>
                      </div>
                    </div>

                    {/* Rating Section */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center">
                        <span className="text-white font-bold text-base sm:text-lg mr-2">4.9</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm sm:text-lg ${i < 4 ? 'text-yellow-400' : 'text-white/30'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-white/60 text-xs sm:text-sm">(25)</span>
                  </div>
                  
                    {/* Action Button */}
                  <Link
                    to={`/courses/${course._id}`}
                      className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-center py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                  >
                      عرض الكورس
                  </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/courses" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              See More Courses
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                About <span className="text-gradient">Areeb</span>
              </h2>
              <p className="text-base sm:text-lg text-dark-300 mb-4 sm:mb-6">
                Areeb is a comprehensive online learning platform that connects students, teachers, and parents 
                in a unified educational ecosystem. We believe in making quality education accessible to everyone.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-300">Interactive video lessons</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-300">Auto-graded quizzes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-300">Progress tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-dark-300">Parent monitoring</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 rounded-xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-primary-200 text-sm">Happy Students</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-dark-300">
              Have questions? We'd love to hear from you. Send us a message!
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleContactSubmit}
            className="card max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="input-field"
                  placeholder="Your message"
                ></textarea>
              </div>
              
              <button type="submit" className="w-full btn-primary text-lg py-4">
                Send Now
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Affiliation Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-dark-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-400 mb-2">
              You're connected with Areeb
            </h3>
            <p className="text-sm sm:text-base text-dark-300">
              Join thousands of students, teachers, and parents who trust Areeb for their educational journey
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
