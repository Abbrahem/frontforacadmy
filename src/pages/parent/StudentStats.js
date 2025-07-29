import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Person as PersonIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  PlayCircle as PlayIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as TrophyIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const StudentStats = () => {
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchStudentData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'parent') {
        toast.error('هذه الصفحة متاحة لولي الأمر فقط');
        navigate('/dashboard');
        return;
      }

      // Get student ID from parent's profile or query parameter
      const studentId = localStorage.getItem('studentId') || new URLSearchParams(window.location.search).get('studentId');
      
      if (!studentId) {
        setError('لم يتم العثور على معرف الطالب');
        setLoading(false);
        return;
      }

      const [studentResponse, enrollmentsResponse] = await Promise.all([
        axios.get(`/api/users/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`/api/enrollments/student/${studentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setStudent(studentResponse.data.user);
      setEnrollments(enrollmentsResponse.data.enrollments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('فشل في تحميل بيانات الطالب');
      setLoading(false);
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (fetchStudentData) {
        await fetchStudentData();
      }
    };
    loadData();
  }, [fetchStudentData]);

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course?.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progress?.overallProgress >= 100).length;
  const averageProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress?.overallProgress || 0), 0) / enrollments.length)
    : 0;

  const totalVideos = enrollments.reduce((sum, e) => sum + (e.progress?.completedVideos?.length || 0), 0);
  const totalQuizzes = enrollments.reduce((sum, e) => sum + (e.progress?.completedQuizzes?.length || 0), 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">خطأ:</Typography>
          <Typography>{error || 'لم يتم العثور على بيانات الطالب'}</Typography>
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/parent/dashboard')}
        >
          العودة للوحة التحكم
        </Button>
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/parent/dashboard')}
            sx={{ mb: 2 }}
          >
            العودة للوحة التحكم
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
            إحصائيات الطالب
          </Typography>
        </Box>

        {/* Student Info Card */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Grid>
            <Grid xs>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {student.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                {student.email}
              </Typography>
              <Chip 
                label={`ID: ${student._id.slice(-6)}`}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Grid>
            <Grid>
              <Chip 
                label="طالب"
                sx={{ 
                  bgcolor: 'success.main', 
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {totalCourses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي الكورسات
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                    <CheckIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {completedCourses}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الكورسات المكتملة
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {averageProgress}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    متوسط التقدم
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                    <TrophyIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {totalVideos + totalQuizzes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الدروس المكتملة
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Search */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="البحث في الكورسات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Enrollments List */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
            الكورسات المسجل فيها
          </Typography>
          
          {filteredEnrollments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                لا توجد كورسات مسجل فيها
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredEnrollments.map((enrollment, index) => (
                <React.Fragment key={enrollment._id}>
                  <ListItem sx={{ 
                    borderRadius: 2, 
                    mb: 1,
                    bgcolor: enrollment.progress?.overallProgress >= 100 ? 'success.light' : 'transparent',
                    '&:hover': {
                      bgcolor: enrollment.progress?.overallProgress >= 100 ? 'success.light' : 'action.hover'
                    }
                  }}>
                    <ListItemIcon>
                      {enrollment.progress?.overallProgress >= 100 ? (
                        <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                          <CheckIcon />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          <SchoolIcon />
                        </Avatar>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {enrollment.course?.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip 
                              label={enrollment.course?.subject} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                            <Chip 
                              label={enrollment.course?.grade} 
                              size="small" 
                              color="secondary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                              التقدم العام:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {enrollment.progress?.overallProgress || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={enrollment.progress?.overallProgress || 0}
                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                          />
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlayIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {enrollment.progress?.completedVideos?.length || 0} فيديو
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AssignmentIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {enrollment.progress?.completedQuizzes?.length || 0} اختبار
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            تاريخ التسجيل: {new Date(enrollment.createdAt).toLocaleDateString('ar-EG')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredEnrollments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default StudentStats; 