import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  
  // Initialize 8 questions with empty data
  const [questions, setQuestions] = useState(
    Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0 // Index of correct answer (0-3)
    }))
  );

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

  const updateQuestion = (questionIndex, field, value) => {
    setQuestions(prev => 
      prev.map((q, index) => 
        index === questionIndex 
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions(prev => 
      prev.map((q, index) => 
        index === questionIndex 
          ? { 
              ...q, 
              options: q.options.map((opt, oIndex) => 
                oIndex === optionIndex ? value : opt
              )
            }
          : q
      )
    );
  };

  const setCorrectAnswer = (questionIndex, optionIndex) => {
    setQuestions(prev => 
      prev.map((q, index) => 
        index === questionIndex 
          ? { ...q, correctAnswer: optionIndex }
          : q
      )
    );
  };

  const validateQuiz = () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return false;
    }

    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return false;
    }

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.question.trim()) {
        toast.error(`Please enter question ${i + 1}`);
        return false;
      }

      // Check if all options are filled
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].trim()) {
          toast.error(`Please fill all options for question ${i + 1}`);
          return false;
        }
      }

      // Check if correct answer is marked
      if (question.correctAnswer === undefined || question.correctAnswer === null) {
        toast.error(`Please mark the correct answer for question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateQuiz()) {
      return;
    }

    setLoading(true);

    try {
      const quizData = {
        title: quizTitle,
        description: quizDescription,
        courseId: selectedCourse,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };

      await axios.post('/api/quizzes/create', quizData);
      toast.success('تم إنشاء الاختبار بنجاح!');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Quiz</h1>
          <p className="text-dark-300">
            Create a quiz with 8 questions for your course
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Approved Courses</h3>
              <p className="text-dark-300 mb-6">
                You need to have at least one approved course before you can create quizzes.
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
            className="space-y-8"
          >
            {/* Quiz Info */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">Quiz Information</h2>
              
              <div className="space-y-6">
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
                </div>

                {/* Quiz Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="input-field"
                    placeholder="Enter quiz title"
                    required
                  />
                </div>

                {/* Quiz Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Quiz Description
                  </label>
                  <textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Describe what this quiz covers"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Questions (8 Required)</h2>
              
              {questions.map((question, questionIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: questionIndex * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Question {question.id}
                    </h3>
                    <span className="text-sm text-dark-400">
                      {question.question.trim() && question.options.every(opt => opt.trim()) ? '✅' : '⏳'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                      rows={2}
                      className="input-field resize-none"
                      placeholder={`Enter question ${question.id}...`}
                      required
                    />
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white mb-2">
                      Answer Options * (Click to mark correct answer)
                    </label>
                    
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(questionIndex, optionIndex)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            question.correctAnswer === optionIndex
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'border-dark-500 hover:border-green-500'
                          }`}
                        >
                          {question.correctAnswer === optionIndex && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            className={`input-field ${
                              question.correctAnswer === optionIndex 
                                ? 'border-green-500 focus:border-green-400' 
                                : ''
                            }`}
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            required
                          />
                        </div>
                        
                        <span className="text-xs text-dark-400 w-8">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                      </div>
                    ))}
                    
                    {question.correctAnswer !== null && question.correctAnswer !== undefined && (
                      <p className="text-green-400 text-sm mt-2">
                        ✅ Correct answer: Option {String.fromCharCode(65 + question.correctAnswer)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

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
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Quiz...</span>
                  </div>
                ) : (
                  'Create Quiz'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-300 font-medium mb-1">Quiz Creation Guidelines</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Each quiz must have exactly 8 questions</li>
                <li>• Each question must have 4 answer options</li>
                <li>• Click the circle next to an option to mark it as correct</li>
                <li>• Quizzes will be available to students immediately after creation</li>
                <li>• Students can take each quiz multiple times</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuiz;
