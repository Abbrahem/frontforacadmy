import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    grade: '',
    childStudentId: '',
    experience: '',
    subject: '',
    qualifications: '',
    division: '' // New field for division (علمي/أدبي/عملي)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [studentVerification, setStudentVerification] = useState(null);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Function to get available subjects based on grade and division
  const getAvailableSubjects = (grade, division) => {
    if (!grade) return [];

    // For الثانوي (Secondary)
    if (grade === 'الأول الثانوي' || grade === 'الثاني الثانوي') {
      if (division === 'علمي') {
        return [
          'اللغة العربية', 'اللغة الإنجليزية', 'الفيزياء', 'الكيمياء', 
          'الأحياء', 'الرياضيات', 'الجيولوجيا', 'الفرنساوي'
        ];
      } else if (division === 'أدبي') {
        return [
          'اللغة العربية', 'اللغة الإنجليزية', 'الفرنساوي', 'التاريخ', 
          'الجغرافيا', 'الفلسفة'
        ];
      }
    }

    // For الثالث الثانوي (Third Secondary)
    if (grade === 'الثالث الثانوي') {
      if (division === 'علمي علوم') {
        return [
          'اللغة العربية', 'اللغة الإنجليزية', 'الأحياء', 'الكيمياء', 'الفيزياء'
        ];
      } else if (division === 'علمي رياضة') {
        return [
          'اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'الفيزياء', 'الجيولوجيا'
        ];
      } else if (division === 'أدبي') {
        return [
          'اللغة العربية', 'اللغة الإنجليزية', 'الفرنساوي', 'الفلسفة', 
          'التاريخ', 'الجغرافيا'
        ];
      }
    }

    // For other grades (Primary and Preparatory)
    return [
      'اللغة العربية', 'الرياضيات', 'التاريخ', 'الجغرافيا', 'العلوم', 
      'الكيمياء', 'الفيزياء', 'الأحياء', 'الفلسفة', 'الفرنساوي', 
      'التربية الدينية', 'الإنجليزية', 'جيولوجيا'
    ];
  };

  // Function to check if division selection is needed
  const needsDivisionSelection = (grade) => {
    return grade === 'الأول الثانوي' || grade === 'الثاني الثانوي' || grade === 'الثالث الثانوي';
  };

  // Function to get available divisions for a grade
  const getAvailableDivisions = (grade) => {
    if (grade === 'الأول الثانوي' || grade === 'الثاني الثانوي') {
      return ['علمي', 'أدبي'];
    } else if (grade === 'الثالث الثانوي') {
      return ['علمي علوم', 'علمي رياضة', 'أدبي'];
    }
    return [];
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset subject when grade or division changes
    if (name === 'grade' || name === 'division') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subject: '' // Reset subject selection
      }));
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const verifyStudent = useCallback(async () => {
    if (!formData.childStudentId) return;
    
    try {
      const response = await axios.get(`/api/auth/verify-student/${formData.childStudentId}`);
      if (response.data.success) {
        setStudentVerification(response.data.student);
      } else {
        setStudentVerification(null);
      }
    } catch (error) {
      setStudentVerification(null);
    }
  }, [formData.childStudentId]);

  useEffect(() => {
    if (role === 'parent' && formData.childStudentId) {
      const debounceTimer = setTimeout(verifyStudent, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [formData.childStudentId, role, verifyStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      phone: formData.phone
    };

    // Add role-specific fields
    if (role === 'student') {
      registrationData.grade = formData.grade;
      registrationData.division = formData.division;
      registrationData.subject = formData.subject;
    } else if (role === 'parent') {
      registrationData.childStudentId = formData.childStudentId;
    } else if (role === 'teacher') {
      registrationData.grade = formData.grade;
      registrationData.division = formData.division;
      registrationData.experience = formData.experience;
      registrationData.subject = formData.subject;
      registrationData.qualifications = formData.qualifications;
    }

    const result = await register(registrationData);
    if (result.success) {
      // Redirect based on role
      setTimeout(() => {
        switch (role) {
          case 'student':
            navigate('/courses');
            break;
          case 'parent':
            navigate('/parent/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/courses');
        }
      }, 1000);
    }
  };

  const roleOptions = [
    {
      value: 'student',
      title: 'Student',
      description: 'Access courses, watch videos, and take quizzes',
      icon: '🎓'
    },
    {
      value: 'parent',
      title: 'Parent',
      description: 'Monitor your child\'s progress and performance',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      value: 'teacher',
      title: 'Teacher',
      description: 'Create courses, upload videos, and manage students',
      icon: '👨‍🏫'
    }
  ];

  const grades = [
    'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي',
    'الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي',
    'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'
  ];

  // const subjects = [
  //   'اللغة العربية', 'الرياضيات', 'التاريخ', 'الجغرافيا', 'العلوم', 
  //   'الكيمياء', 'الفيزياء', 'الأحياء', 'الفلسفة', 'الفرنساوي', 
  //   'التربية الدينية', 'الإنجليزية', 'جيولوجيا'
  // ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Areeb</span>
            </Link>
            <h2 className="text-3xl font-bold text-white">
              Join Areeb
            </h2>
            <p className="mt-2 text-dark-300">
              Create your account to start learning
            </p>
          </div>
        </motion.div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white text-center mb-6">
              Choose your role
            </h3>
            {roleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleRoleSelect(option.value)}
                className="w-full p-4 bg-dark-800 border border-dark-700 rounded-lg hover:border-primary-500 hover:bg-dark-700 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{option.icon}</div>
                  <div>
                    <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors duration-200">
                      {option.title}
                    </h4>
                    <p className="text-dark-300 text-sm">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                ← Back to role selection
              </button>
              <span className="text-dark-300 text-sm">
                Step 2 of 2
              </span>
            </div>

            {role === 'parent' && (
              <div className="mb-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-blue-300 font-medium mb-1">How to get your child's Student ID:</h4>
                    <ol className="text-blue-200 text-sm space-y-1">
                      <li>1. Ask your child to log into their student account</li>
                      <li>2. Look for the "ID: [number]" displayed at the top of their dashboard</li>
                      <li>3. Copy that ID and paste it in the field below</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Common Fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="input-field"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Role-specific Fields */}
              {role === 'student' && (
                <>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-white mb-2">
                      الصف الدراسي
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    className="input-field"
                    value={formData.grade}
                    onChange={handleChange}
                  >
                      <option value="">اختر الصف الدراسي</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                  {/* Division Selection for Secondary Grades */}
                  {needsDivisionSelection(formData.grade) && (
                    <div>
                      <label htmlFor="division" className="block text-sm font-medium text-white mb-2">
                        القسم
                      </label>
                      <select
                        id="division"
                        name="division"
                        required
                        className="input-field"
                        value={formData.division}
                        onChange={handleChange}
                      >
                        <option value="">اختر القسم</option>
                        {getAvailableDivisions(formData.grade).map((division) => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Subject Selection */}
                  {formData.grade && (
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                        المادة المفضلة
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="input-field"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        <option value="">اختر المادة المفضلة (اختياري)</option>
                        {getAvailableSubjects(formData.grade, formData.division).map((subject) => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      <p className="text-dark-400 text-xs mt-1">
                        اختر المادة التي تفضلها للتعلم
                      </p>
                    </div>
                  )}
                </>
              )}

              {role === 'parent' && (
                <div>
                  <label htmlFor="childStudentId" className="block text-sm font-medium text-white mb-2">
                    Child's Student ID
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="childStudentId"
                      name="childStudentId"
                      type="text"
                      required
                      className="input-field flex-1"
                      placeholder="Enter your child's student ID"
                      value={formData.childStudentId}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={verifyStudent}
                      disabled={!formData.childStudentId}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify
                    </button>
                  </div>
                  {studentVerification && (
                    <div className="mt-2 p-3 bg-green-900 border border-green-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-300 text-sm">
                          Student found: {studentVerification.name} ({studentVerification.grade})
                        </span>
                      </div>
                    </div>
                  )}
                  {formData.childStudentId && !studentVerification && (
                    <div className="mt-2 p-3 bg-red-900 border border-red-700 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-red-300 text-sm">
                          Student ID not found. Please check the ID and try again.
                        </span>
                      </div>
                    </div>
                  )}
                  <p className="text-dark-400 text-xs mt-1">
                    Enter the student ID that appears in your child's dashboard
                  </p>
                </div>
              )}

              {role === 'teacher' && (
                <>
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-white mb-2">
                      الصف الدراسي
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      required
                      className="input-field"
                      value={formData.grade}
                      onChange={handleChange}
                    >
                      <option value="">اختر الصف الدراسي</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Division Selection for Secondary Grades */}
                  {needsDivisionSelection(formData.grade) && (
                    <div>
                      <label htmlFor="division" className="block text-sm font-medium text-white mb-2">
                        القسم
                      </label>
                      <select
                        id="division"
                        name="division"
                        required
                        className="input-field"
                        value={formData.division}
                        onChange={handleChange}
                      >
                        <option value="">اختر القسم</option>
                        {getAvailableDivisions(formData.grade).map((division) => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      المادة
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="input-field"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">اختر المادة</option>
                      {getAvailableSubjects(formData.grade, formData.division).map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-white mb-2">
                      سنوات الخبرة
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      required
                      className="input-field"
                      placeholder="أدخل سنوات الخبرة"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-white mb-2">
                      المؤهلات العلمية
                    </label>
                    <textarea
                      id="qualifications"
                      name="qualifications"
                      required
                      className="input-field"
                      rows="3"
                      placeholder="أدخل المؤهلات العلمية"
                      value={formData.qualifications}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pr-12"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {role === 'teacher' && (
                <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="text-yellow-300 font-medium text-sm">Approval Required</h4>
                      <p className="text-yellow-200 text-sm">
                        Teacher accounts require admin approval before you can create courses.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={false || (role === 'parent' && !studentVerification)}
                  className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {false ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-dark-300">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Register;
