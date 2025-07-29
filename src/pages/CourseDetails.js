import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CardActions,
  IconButton,
  Tooltip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import { 
  School as SchoolIcon,
  Person as PersonIcon,
  PlayCircle as PlayIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  VideoLibrary as VideoLibraryIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';

const CourseDetails = () => {
  const { id } = useParams();
  const courseId = id;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}`);
      setCourse(response.data.course);
      setVideos(response.data.videos || []);
      
      // Fetch quizzes for this course
      try {
        const quizzesResponse = await axios.get(`/api/quizzes/course/${courseId}`);
        setQuizzes(quizzesResponse.data.quizzes || []);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('فشل في تحميل تفاصيل الكورس');
      setLoading(false);
    }
  }, [courseId]);

  const checkEnrollment = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'student') return;

      const response = await axios.get(`/api/enrollments/check/${courseId}`);
      setIsEnrolled(response.data.isEnrolled);
      setEnrollment(response.data.enrollment);
      
      if (response.data.isEnrolled && response.data.enrollment) {
        // Initialize progress if not exists
        const progress = response.data.enrollment.progress || {
          completedVideos: [],
          completedQuizzes: [],
          quizScores: {},
          quizzesTaken: []
        };
        setProgress(progress);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, [fetchCourseDetails, checkEnrollment]);

  // Update progress when enrollment changes
  useEffect(() => {
    if (enrollment && isEnrolled) {
      // Initialize progress if not exists
      const progress = enrollment.progress || {
        completedVideos: [],
        completedQuizzes: [],
        quizScores: {},
        quizzesTaken: []
      };
      setProgress(progress);
    }
  }, [enrollment, isEnrolled]);

  // Update active step based on progress
  useEffect(() => {
    if (progress) {
      const completedContent = (progress.completedVideos?.length || 0) + (progress.completedQuizzes?.length || 0);
      const totalContent = videos.length + quizzes.length;
      
      if (totalContent > 0) {
        const step = Math.floor((completedContent / totalContent) * 3); // 3 steps total
        setActiveStep(Math.min(step, 2));
      }
    }
  }, [progress, videos.length, quizzes.length]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'student') {
      toast.error('فقط الطلاب يمكنهم التسجيل في الكورسات');
      return;
    }

    setEnrolling(true);
    try {
      const response = await axios.post('/api/enrollments/enroll', {
        courseId: courseId
      });

      if (response.data.success) {
        setIsEnrolled(true);
        setEnrollment(response.data.enrollment);
        toast.success('تم التسجيل في الكورس بنجاح!');
        
        // Initialize progress
        setProgress({
          completedVideos: [],
          completedQuizzes: [],
          quizScores: {},
          quizzesTaken: []
        });
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(error.response?.data?.message || 'فشل في التسجيل في الكورس');
    } finally {
      setEnrolling(false);
    }
  };

  const handleVideoClick = (video) => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'student') {
      toast.error('فقط الطلاب يمكنهم مشاهدة الدروس');
      return;
    }
    
    if (!isEnrolled) {
      toast.info('يرجى التسجيل في الكورس أولاً');
      return;
    }
    navigate(`/video/${video._id}`);
  };

  const handleQuizClick = (quiz) => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'student') {
      toast.error('فقط الطلاب يمكنهم أداء الاختبارات');
      return;
    }
    
    if (!isEnrolled) {
      toast.info('يرجى التسجيل في الكورس أولاً');
      return;
    }
    navigate(`/quiz/${quiz._id}`);
  };

  const getQuizScore = (quizId) => {
    if (!progress || !progress.quizScores) return 0;
    return progress.quizScores[quizId] || 0;
  };

  const handleVideoProgress = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }

      const response = await axios.put('/api/enrollments/update-video-progress', {
        courseId: courseId,
        videoId: videoId
      });

      if (response.data.success) {
        toast.success('تم تحديث تقدم الفيديو بنجاح!');
        
        // Update local progress state
        if (progress) {
          const updatedProgress = { ...progress };
          if (!updatedProgress.completedVideos.includes(videoId)) {
            updatedProgress.completedVideos.push(videoId);
          }
          setProgress(updatedProgress);
        }

        // Update enrollment if available
        if (enrollment) {
          setEnrollment(response.data.enrollment);
        }
      }
    } catch (error) {
      console.error('Error updating video progress:', error);
      toast.error('فشل في تحديث تقدم الفيديو');
    }
  };

  const isVideoCompleted = (videoId) => {
    if (!progress || !progress.completedVideos) return false;
    return progress.completedVideos.includes(videoId);
  };

  const isQuizCompleted = (quizId) => {
    if (!progress || !progress.completedQuizzes) return false;
    return progress.completedQuizzes.includes(quizId);
  };

  const userRole = localStorage.getItem('userRole');
  const isStudent = userRole === 'student';
  const totalContent = videos.length + quizzes.length;
  const completedContent = (progress?.completedVideos?.length || 0) + (progress?.completedQuizzes?.length || 0);
  const progressPercentage = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">خطأ:</Typography>
          <Typography>{error || 'الكورس غير موجود'}</Typography>
        </Alert>
      </Container>
    );
  }

  const steps = [
    {
      label: 'التسجيل في الكورس',
      description: 'قم بالتسجيل في الكورس للبدء في التعلم',
      completed: isEnrolled,
      error: false
    },
    {
      label: 'مشاهدة الدروس',
      description: `شاهد ${videos.length} درس من الدروس المتاحة`,
      completed: progress && progress.completedVideos && progress.completedVideos.length > 0,
      error: false
    },
    {
      label: 'أداء الاختبارات',
      description: `أدِ ${quizzes.length} اختبار من الاختبارات المتاحة`,
      completed: progress && progress.completedQuizzes && progress.completedQuizzes.length > 0,
      error: false
    }
  ];

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main Content - Single Column */}
          <Box sx={{ width: '100%' }}>
          {/* Top Paper - Course Content */}
          <Paper elevation={8} sx={{ 
            borderRadius: 4, 
            background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            height: '100vh',
            overflow: 'hidden',
            width: '100%',
            position: 'relative',
            mb: 4
          }}>
            {/* Introduction - Top */}
            <Box sx={{ 
              p: 4,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)'
            }}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold', 
                color: '#64B5F6', 
                textTransform: 'uppercase',
                fontSize: '2.5rem',
                letterSpacing: '2px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: 2
              }}>
                introduction
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}>
                مرحباً بك في هذا الكورس التعليمي
              </Typography>
            </Box>

            {/* Content List - Below Introduction */}
            <Box sx={{ 
              height: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}>
              {videos.length === 0 && quizzes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    لا يوجد محتوى متاح حالياً
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {[...videos.map(v => ({ ...v, type: 'video' })), ...quizzes.map(q => ({ ...q, type: 'quiz' }))]
                    .sort((a, b) => {
                      if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                      }
                      return new Date(a.createdAt) - new Date(b.createdAt);
                    })
                    .map((item, index) => (
                      <Box
                        key={item._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                          py: 3,
                          px: 3,
                          cursor: isEnrolled ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          '&:hover': {
                            bgcolor: isEnrolled ? 'rgba(255,255,255,0.05)' : 'transparent'
                          }
                        }}
                        onClick={() => {
                          if (isEnrolled) {
                            item.type === 'video' ? handleVideoClick(item) : handleQuizClick(item);
                          }
                        }}
                      >
                        {/* Left side - Icon and timestamp */}
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100, mr: 3 }}>
                          {item.type === 'video' ? (
                            <PlayIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', mr: 1 }} />
                          ) : (
                            <QuizIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', mr: 1 }} />
                          )}
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '1rem',
                            fontWeight: 'medium'
                          }}>
                            {item.type === 'video' ? (item.duration || '00:00') : `${item.questions?.length || 0} أسئلة`}
                          </Typography>
                        </Box>

                        {/* Right side - Title */}
                        <Typography variant="body1" sx={{ 
                          color: 'white',
                          fontSize: '1.1rem',
                          lineHeight: 1.4,
                          flexGrow: 1
                        }}>
                          {item.title}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Bottom Paper - Course Info */}
          <Paper elevation={8} sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: 'fit-content'
          }}>
            {/* Course Info */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                {course.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  width: 50, 
                  height: 50, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mr: 2
                }}>
                  <PersonIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {course.teacher?.name || 'المعلم'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    معلم معتمد
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={course.subject} 
                  sx={{ 
                    mr: 1, 
                    mb: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip 
                  label={course.grade} 
                  sx={{ 
                    mr: 1, 
                    mb: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                {course.division && (
                  <Chip 
                    label={course.division} 
                    sx={{ 
                      mr: 1, 
                      mb: 1, 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                )}
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                {course.description}
              </Typography>
            </Box>

              {/* Progress Section for Enrolled Students */}
              {isEnrolled && progress && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                      تقدمك في الكورس
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      {progressPercentage}% مكتمل
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6, 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4CAF50'
                      }
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.9)' }}>
                      {completedContent} من {totalContent} درس
                    </Typography>
                  </Box>
              )}

              {/* Enrollment Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!isEnrolled ? (
                  isStudent ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      startIcon={enrolling ? <CircularProgress size={20} /> : <SchoolIcon />}
                      sx={{
                      bgcolor: '#4CAF50',
                        color: 'white',
                      py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': {
                        bgcolor: '#388E3C'
                        }
                      }}
                    >
                      {enrolling ? 'جاري التسجيل...' : 'سجل الآن مجاناً'}
                    </Button>
                  ) : (
                  <Alert severity="info" sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '& .MuiAlert-icon': { color: 'white' }
                  }}>
                      <Typography variant="h6" gutterBottom>
                        للطلاب فقط
                      </Typography>
                      <Typography>
                        فقط الطلاب يمكنهم التسجيل في الكورسات ومتابعة التقدم
                      </Typography>
                    </Alert>
                  )
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(`/course/${courseId}/learn`)}
                    startIcon={<PlayIcon />}
                    sx={{
                    bgcolor: '#4CAF50',
                      color: 'white',
                    py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      '&:hover': {
                      bgcolor: '#388E3C'
                      }
                    }}
                  >
                    استمر في التعلم
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(-1)}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                  py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  رجوع
                </Button>
              </Box>
          </Paper>
                  </Box>
      </motion.div>
    </Box>
  );
};

export default CourseDetails; 