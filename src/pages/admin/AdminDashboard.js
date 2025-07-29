import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Rating,
  // Tooltip
} from '@mui/material';
import { 
  People as PeopleIcon,
  School as SchoolIcon,
  Pending as PendingIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  // Speed as SpeedIcon,
  // Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      const [statsResponse, requestsResponse, enrollmentsResponse, performanceResponse] = await Promise.all([
        axios.get('/api/admin/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/admin/course-requests?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/admin/recent-enrollments?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/admin/performance-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data.stats);
      setRecentRequests(requestsResponse.data.requests || []);
      setRecentEnrollments(enrollmentsResponse.data.enrollments || []);
      setPerformanceStats(performanceResponse.data);
      setTopPerformers(performanceResponse.data?.topPerformers || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('فشل في تحميل بيانات لوحة التحكم');
      setLoading(false);
      
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (fetchDashboardData) {
        await fetchDashboardData();
      }
    };
    loadData();
  }, [fetchDashboardData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'تمت الموافقة';
      case 'rejected': return 'مرفوض';
      default: return 'غير معروف';
    }
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 90) return 'success';
    if (rating >= 75) return 'info';
    if (rating >= 60) return 'warning';
    return 'error';
  };

  const getPerformanceText = (rating) => {
    if (rating >= 90) return 'ممتاز';
    if (rating >= 75) return 'جيد جداً';
    if (rating >= 60) return 'جيد';
    if (rating >= 40) return 'مقبول';
    return 'يحتاج تحسين';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">خطأ:</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}>
            <DashboardIcon sx={{ 
              mr: 2, 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }} />
            لوحة تحكم المدير
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            نظرة عامة على منصة التعلم الإلكتروني
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid xs={6} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                    <PeopleIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
                  </Avatar>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {stats?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    إجمالي المستخدمين
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={6} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                    <SchoolIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
                  </Avatar>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {stats?.totalCourses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    إجمالي الكورسات
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={6} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                    <PendingIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
                  </Avatar>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {stats?.pendingRequests || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    طلبات في الانتظار
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={6} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
                    <TrendingUpIcon sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }} />
                  </Avatar>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
                    {stats?.totalEnrollments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    إجمالي التسجيلات
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Performance Evaluation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AnalyticsIcon sx={{ mr: 2, color: 'primary.main' }} />
              تقييم الأداء العام
            </Typography>

            <Grid container spacing={3}>
              {/* Overall Performance Metrics */}
              <Grid xs={12} md={6}>
                <Card elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1, color: 'info.main' }} />
                    مؤشرات الأداء العامة
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">معدل إكمال الكورسات</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {performanceStats?.overallCompletionRate || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={performanceStats?.overallCompletionRate || 0}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">معدل نجاح الاختبارات</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {performanceStats?.quizSuccessRate || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={performanceStats?.quizSuccessRate || 0}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">متوسط درجات الاختبارات</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {performanceStats?.averageQuizScore || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={performanceStats?.averageQuizScore || 0}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">معدل نشاط الطلاب</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {performanceStats?.studentActivityRate || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={performanceStats?.studentActivityRate || 0}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Performance Rating */}
              <Grid xs={12} md={6}>
                <Card elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                    تقييم الأداء العام
                  </Typography>
                  
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                      <Rating 
                        value={(performanceStats?.overallRating || 0) / 20} 
                        readOnly 
                        size="large"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {performanceStats?.overallRating || 0}/100
                      </Typography>
                    </Box>
                    
                    <Chip 
                      label={getPerformanceText(performanceStats?.overallRating || 0)}
                      color={getPerformanceColor(performanceStats?.overallRating || 0)}
                      size="large"
                      sx={{ fontSize: '1.1rem', py: 1 }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      تقييم شامل لأداء المنصة بناءً على معدلات الإكمال والنجاح
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Top Performers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrophyIcon sx={{ mr: 2, color: 'warning.main' }} />
              أفضل الطلاب أداءً
            </Typography>

            {topPerformers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TrophyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  لا توجد بيانات كافية لتقييم الأداء
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {topPerformers.slice(0, 6).map((performer, index) => (
                  <Grid xs={12} sm={6} md={4} key={performer._id}>
                    <Card elevation={2} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: index < 3 ? 'warning.main' : 'primary.main', mr: 2 }}>
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {performer.studentName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {performer.courseTitle}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">التقدم</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {performer.completionRate}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={performer.completionRate}
                          sx={{ mb: 1 }}
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">متوسط الدرجات</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {performer.averageScore}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Chip 
                        label={getPerformanceText(performer.overallRating)}
                        color={getPerformanceColor(performer.overallRating)}
                        size="small"
                        fullWidth
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </motion.div>

        {/* Recent Enrollments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              <AssignmentIcon sx={{ 
                mr: 1, 
                color: 'primary.main',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }} />
              آخر التسجيلات في الكورسات
            </Typography>
            
            {recentEnrollments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  لا توجد تسجيلات حديثة
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>ID الطالب</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>اسم الطالب</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>الكورس</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>تاريخ التسجيل</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>الحالة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEnrollments.map((enrollment) => (
                      <TableRow key={enrollment._id} hover>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip 
                            label={enrollment.student?._id?.slice(-6) || 'غير متوفر'} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 }, mr: 1 }}>
                              <PersonIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {enrollment.student?.name || 'غير متوفر'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {enrollment.course?.title || 'غير متوفر'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {new Date(enrollment.createdAt).toLocaleDateString('ar-EG')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip 
                            label="مسجل" 
                            size="small" 
                            color="success"
                            sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {recentEnrollments.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/enrollments')}
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  عرض جميع التسجيلات
                </Button>
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  <PendingIcon sx={{ 
                    mr: 1, 
                    color: 'warning.main',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }} />
                  إجراءات سريعة
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}
                    onClick={() => navigate('/admin/course-requests')}
                  >
                    مراجعة طلبات الكورس
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}
                    onClick={() => navigate('/admin/users')}
                  >
                    إدارة المستخدمين
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}
                    onClick={() => navigate('/admin/courses')}
                  >
                    إدارة الكورسات
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}
                    onClick={() => navigate('/admin/enrollments')}
                  >
                    إدارة التسجيلات
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    color="secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      py: { xs: 1.5, sm: 2 }
                    }}
                    onClick={() => navigate('/admin/performance')}
                  >
                    إدارة تقييم الأداء
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  <NotificationsIcon sx={{ 
                    mr: 1, 
                    color: 'info.main',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }} />
                  آخر الطلبات
                </Typography>
                {recentRequests.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    لا توجد طلبات حديثة
                  </Typography>
                ) : (
                  <List sx={{ mt: 1 }}>
                    {recentRequests.slice(0, 3).map((request, index) => (
                      <React.Fragment key={request._id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <SchoolIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={request.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {request.teacherName}
                                </Typography>
                                <Chip 
                                  label={getStatusText(request.status)} 
                                  color={getStatusColor(request.status)}
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < Math.min(2, recentRequests.length - 1) && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
                {recentRequests.length > 3 && (
                  <Button
                    variant="text"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate('/admin/course-requests')}
                  >
                    عرض جميع الطلبات
                  </Button>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard; 