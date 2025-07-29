import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Quiz as QuizIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await axios.get(`/api/quizzes/${id}`);
      const quizData = response.data.quiz;
      
      if (!quizData) {
        setError('الاختبار غير موجود');
        setLoading(false);
        return;
      }
      
      setQuiz(quizData);
      setTimeLeft((quizData.timeLimit || 60) * 60); // Default 1 hour
      setCurrentQuestionIndex(0); // Ensure we start with the first question
      setLoading(false);
      
      // Debug: Log the quiz data
      console.log('Quiz Data:', quizData);
      console.log('First Question:', quizData.questions?.[0]);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('فشل في تحميل الاختبار');
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      toast.warning('يرجى الإجابة على جميع الأسئلة قبل التقديم');
      return;
    }

    setSubmitting(true);
    try {
      // Convert selectedAnswers object to array
      const answersArray = quiz.questions.map((question, index) => {
        const questionId = question._doc?._id || question._id;
        return selectedAnswers[questionId] || 0; // Default to 0 if not answered
      });

      const timeTaken = (quiz.timeLimit * 60) - timeLeft; // Calculate time taken

      const response = await axios.post(`/api/quizzes/${id}/submit`, {
        answers: answersArray,
        timeTaken: Math.floor(timeTaken)
      });

      setResults(response.data);
      setShowResults(true);
      toast.success('تم تقديم الاختبار بنجاح!');
      
      // Debug: Log the response
      console.log('Quiz submission response:', response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(error.response?.data?.message || 'فشل في تقديم الاختبار');
    } finally {
      setSubmitting(false);
    }
  }, [id, selectedAnswers, quiz, timeLeft]);

  useEffect(() => {
    const loadQuiz = async () => {
      if (fetchQuiz) {
        await fetchQuiz();
      }
    };
    loadQuiz();
  }, [id, fetchQuiz]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      const submitQuiz = async () => {
        if (handleSubmit) {
          await handleSubmit();
        }
      };
      submitQuiz();
    }
  }, [timeLeft, handleSubmit]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    const question = quiz.questions[index];
    const questionId = question._doc?._id || question._id;
    return selectedAnswers[questionId] !== undefined ? 'answered' : 'unanswered';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !quiz) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">خطأ:</Typography>
          <Typography>{error || 'الاختبار غير موجود'}</Typography>
        </Alert>
      </Container>
    );
  }

  if (showResults && results) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={8} sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <Box sx={{ mb: 4 }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                mx: 'auto',
                mb: 2
              }}>
                <TrophyIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                نتائج الاختبار
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {quiz.title}
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              mb: 4 
            }}>
              <Box sx={{ 
                position: 'relative', 
                display: 'inline-flex',
                mr: 3
              }}>
                <CircularProgress
                  variant="determinate"
                  value={results.score}
                  size={120}
                  thickness={8}
                  sx={{
                    color: results.score >= 70 ? '#4CAF50' : results.score >= 50 ? '#FF9800' : '#F44336',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {results.score}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  الإجابات الصحيحة: {results.correctAnswers} من {quiz.questions.length}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  الوقت المستغرق: {formatTime(results.timeTaken)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              {results.score >= 70 ? (
                <Chip 
                  label="ممتاز! لقد نجحت في الاختبار" 
                  sx={{ 
                    bgcolor: '#4CAF50', 
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1
                  }} 
                />
              ) : results.score >= 50 ? (
                <Chip 
                  label="جيد! يمكنك التحسن أكثر" 
                  sx={{ 
                    bgcolor: '#FF9800', 
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1
                  }} 
                />
              ) : (
                <Chip 
                  label="يحتاج إلى تحسين" 
                  sx={{ 
                    bgcolor: '#F44336', 
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1
                  }} 
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBackIcon />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                العودة للكورس
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.reload()}
                startIcon={<SchoolIcon />}
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#388E3C'
                  }
                }}
              >
                إعادة الاختبار
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex] || quiz.questions[0];

  // Debug: Log current question
  console.log('Current Question Index:', currentQuestionIndex);
  console.log('Current Question:', currentQuestion);
  console.log('Current Question Keys:', Object.keys(currentQuestion || {}));
  console.log('Quiz Questions:', quiz.questions);

  // Ensure we have a valid question to display
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography>لا توجد أسئلة متاحة في هذا الاختبار</Typography>
        </Alert>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography>خطأ في عرض السؤال الحالي</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Quiz Header */}
        <Paper elevation={8} sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4, 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: 'rgba(255, 152, 0, 0.2)', 
                mr: 2 
              }}>
                <QuizIcon sx={{ fontSize: 28, color: '#FF9800' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {quiz.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {quiz.questions.length} سؤال
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimerIcon sx={{ mr: 1, color: '#FF9800' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

        {/* Progress Bar */}
          <LinearProgress 
            variant="determinate" 
            value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#FF9800'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              السؤال {currentQuestionIndex + 1} من {quiz.questions.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {Object.keys(selectedAnswers).length} إجابة
            </Typography>
          </Box>
        </Paper>

        {/* Question Navigation */}
        <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            أسئلة الاختبار:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {quiz.questions.map((question, index) => (
              <Button
                key={question._id}
                variant={index === currentQuestionIndex ? "contained" : "outlined"}
                size="small"
                onClick={() => setCurrentQuestionIndex(index)}
                sx={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: index === currentQuestionIndex ? 'primary.main' : 'transparent',
                  color: index === currentQuestionIndex ? 'white' : 
                         getQuestionStatus(index) === 'answered' ? 'success.main' : 'text.primary',
                  border: getQuestionStatus(index) === 'answered' ? '2px solid #4CAF50' : '1px solid #ddd',
                  '&:hover': {
                    bgcolor: index === currentQuestionIndex ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Current Question */}
        <Paper elevation={8} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              color: '#1a1a2e',
              lineHeight: 1.6
            }}>
              السؤال {currentQuestionIndex + 1}: {currentQuestion._doc?.question || currentQuestion.question || currentQuestion.text || 'لا يوجد نص للسؤال'}
            </Typography>
          </Box>

          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedAnswers[currentQuestion._doc?._id || currentQuestion._id] || ''}
              onChange={(e) => handleAnswerSelect(currentQuestion._doc?._id || currentQuestion._id, parseInt(e.target.value))}
            >
              {(currentQuestion._doc?.options || currentQuestion.options || []).map((option, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedAnswers[currentQuestion._doc?._id || currentQuestion._id] === index ? 
                      '2px solid #2196F3' : '1px solid #e0e0e0',
                    bgcolor: selectedAnswers[currentQuestion._doc?._id || currentQuestion._id] === index ? 
                      'rgba(33, 150, 243, 0.1)' : 'white',
                    '&:hover': {
                      border: '2px solid #2196F3',
                      bgcolor: 'rgba(33, 150, 243, 0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => handleAnswerSelect(currentQuestion._doc?._id || currentQuestion._id, index)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <FormControlLabel
                      value={index}
                      control={<Radio sx={{ color: '#2196F3' }} />}
                      label={
                        <Typography variant="body1" sx={{ 
                          fontWeight: 'medium',
                          color: '#1a1a2e',
                          fontSize: '1.1rem'
                        }}>
                          {option}
                        </Typography>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            startIcon={<ArrowBackIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              borderColor: '#2196F3',
              color: '#2196F3',
              '&:hover': {
                borderColor: '#1976D2',
                bgcolor: 'rgba(33, 150, 243, 0.05)'
              }
            }}
          >
            السابق
          </Button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                bgcolor: '#2196F3',
                '&:hover': {
                  bgcolor: '#1976D2'
                }
              }}
            >
              التالي
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(selectedAnswers).length < quiz.questions.length}
              startIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                bgcolor: '#4CAF50',
                '&:hover': {
                  bgcolor: '#388E3C'
                },
                '&:disabled': {
                  bgcolor: '#ccc'
                }
              }}
            >
              {submitting ? 'جاري التقديم...' : 'إنهاء الاختبار'}
            </Button>
          )}
        </Box>
        </motion.div>
    </Container>
  );
};

export default QuizPage;
