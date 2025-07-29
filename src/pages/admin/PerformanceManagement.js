import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Rating,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // TextField
} from '@mui/material';
import { 
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  // FilterList as FilterIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const PerformanceManagement = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const navigate = useNavigate();

  const fetchPerformanceData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      const [performanceResponse, coursePerformanceResponse] = await Promise.all([
        axios.get('/api/admin/performance-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/admin/course-performance', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setPerformanceData(performanceResponse.data);
      setTopPerformers(performanceResponse.data?.topPerformers || []);
      setCoursePerformance(coursePerformanceResponse.data?.coursePerformance || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('فشل في تحميل بيانات الأداء');
      setLoading(false);
      
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (fetchPerformanceData) {
        await fetchPerformanceData();
      }
    };
    loadData();
  }, [fetchPerformanceData]);

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredPerformers = topPerformers.filter(performer => {
    const courseMatch = filterCourse === 'all' || performer.courseTitle === filterCourse;
    const ratingMatch = filterRating === 'all' || 
      (filterRating === 'excellent' && performer.overallRating >= 90) ||
      (filterRating === 'good' && performer.overallRating >= 75 && performer.overallRating < 90) ||
      (filterRating === 'average' && performer.overallRating >= 60 && performer.overallRating < 75) ||
      (filterRating === 'poor' && performer.overallRating < 60);
    
    return courseMatch && ratingMatch;
  });

  const exportPerformanceData = () => {
    const dataStr = JSON.stringify(filteredPerformers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'performance-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير البيانات بنجاح');
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 2, color: 'primary.main' }} />
            إدارة تقييم الأداء
          </Typography>
          <Typography variant="body1" color="text.secondary">
            تحليل شامل لأداء الطلاب والكورسات
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {performanceData?.summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {performanceData.summary.averageScore || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    متوسط الدرجات
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {performanceData.summary.totalStudents || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي الطلاب
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {performanceData.summary.totalCourses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي الكورسات
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {performanceData.summary.totalQuizzes || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي الاختبارات
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="أفضل الطلاب أداءً" icon={<TrophyIcon />} />
            <Tab label="أداء الكورسات" icon={<SchoolIcon />} />
            <Tab label="تحليل مفصل" icon={<AnalyticsIcon />} />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Filters */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>تصفية حسب الكورس</InputLabel>
                    <Select
                      value={filterCourse}
                      label="تصفية حسب الكورس"
                      onChange={(e) => setFilterCourse(e.target.value)}
                    >
                      <MenuItem value="all">جميع الكورسات</MenuItem>
                      {Array.from(new Set(topPerformers.map(p => p.courseTitle))).map(course => (
                        <MenuItem key={course} value={course}>{course}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>تصفية حسب التقييم</InputLabel>
                    <Select
                      value={filterRating}
                      label="تصفية حسب التقييم"
                      onChange={(e) => setFilterRating(e.target.value)}
                    >
                      <MenuItem value="all">جميع التقييمات</MenuItem>
                      <MenuItem value="excellent">ممتاز (90+)</MenuItem>
                      <MenuItem value="good">جيد جداً (75-89)</MenuItem>
                      <MenuItem value="average">جيد (60-74)</MenuItem>
                      <MenuItem value="poor">يحتاج تحسين (أقل من 60)</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={exportPerformanceData}
                  >
                    تصدير البيانات
                  </Button>
                </Box>

                {/* Top Performers Table */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>الترتيب</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>اسم الطالب</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>الكورس</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>معدل الإكمال</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>متوسط الدرجات</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>التقييم العام</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPerformers.map((performer, index) => (
                        <TableRow key={performer._id} hover>
                          <TableCell>
                            <Avatar sx={{ 
                              bgcolor: index < 3 ? 'warning.main' : 'primary.main',
                              width: 32,
                              height: 32
                            }}>
                              {index + 1}
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                <PersonIcon />
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {performer.studentName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {performer.courseTitle}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={performer.completionRate}
                                  sx={{ height: 8, borderRadius: 5 }}
                                />
                              </Box>
                              <Typography variant="body2" sx={{ minWidth: 35 }}>
                                {performer.completionRate}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performer.averageScore}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating 
                                value={performer.overallRating / 20} 
                                readOnly 
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {performer.overallRating}/100
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getPerformanceText(performer.overallRating)}
                              color={getPerformanceColor(performer.overallRating)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {filteredPerformers.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TrophyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      لا توجد نتائج تطابق المعايير المحددة
                    </Typography>
                  </Box>
                )}
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" gutterBottom>
                  أداء الكورسات
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  تحليل أداء كل كورس بناءً على معدلات الإكمال والنجاح
                </Typography>

                {coursePerformance.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      لا توجد بيانات كافية لتحليل أداء الكورسات
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {coursePerformance.map((course) => (
                      <Grid xs={12} md={6} key={course._id}>
                        <Card elevation={2}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {course.subject} - {course.teacherName}
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">معدل الإكمال</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {course.completionRate}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.completionRate}
                                sx={{ mb: 2 }}
                              />
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">متوسط الدرجات</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {course.averageScore}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.averageScore}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Chip 
                                label={getPerformanceText(course.overallRating)}
                                color={getPerformanceColor(course.overallRating)}
                                size="small"
                              />
                              <Typography variant="body2" color="text.secondary">
                                {course.enrollmentCount} طالب مسجل
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" gutterBottom>
                  تحليل مفصل للأداء
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  إحصائيات مفصلة عن أداء الطلاب والكورسات
                </Typography>

                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          إحصائيات عامة
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">إجمالي التسجيلات</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.summary?.totalEnrollments || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">التسجيلات المكتملة</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.summary?.completedEnrollments || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">إجمالي الفيديوهات</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.summary?.totalVideos || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">إجمالي الاختبارات</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.summary?.totalQuizzes || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          معدلات النشاط
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">معدل نشاط الطلاب</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.studentActivityRate || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={performanceData?.studentActivityRate || 0}
                            sx={{ mb: 2 }}
                          />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">معدل مشاهدة الفيديوهات</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.summary?.totalVideos > 0 
                                ? Math.round((performanceData?.summary?.watchedVideos / performanceData?.summary?.totalVideos) * 100)
                                : 0}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={performanceData?.summary?.totalVideos > 0 
                              ? Math.round((performanceData?.summary?.watchedVideos / performanceData?.summary?.totalVideos) * 100)
                              : 0}
                            sx={{ mb: 2 }}
                          />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">معدل نجاح الاختبارات</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {performanceData?.summary?.totalQuizzes > 0 
                                ? Math.round((performanceData?.summary?.passedQuizzes / performanceData?.summary?.totalQuizzes) * 100)
                                : 0}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={performanceData?.summary?.totalQuizzes > 0 
                              ? Math.round((performanceData?.summary?.passedQuizzes / performanceData?.summary?.totalQuizzes) * 100)
                              : 0}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default PerformanceManagement; 