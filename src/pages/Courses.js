import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Avatar,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  PlayCircle as PlayIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');
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



  const grades = [
    'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي',
    'الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي',
    'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/approved');
      setCourses(response.data.courses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('فشل في تحميل الكورسات');
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !subjectFilter || course.subject === subjectFilter;
    const matchesGrade = !gradeFilter || course.grade === gradeFilter;
    const matchesDivision = !divisionFilter || course.division === divisionFilter;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesDivision;
  });

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
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
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
            الكورسات المتاحة
          </Typography>
          <Typography variant="body1" color="text.secondary">
            اكتشف مجموعة متنوعة من الكورسات التعليمية عالية الجودة
          </Typography>
        </Box>

        {/* Filter Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} md={3}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إجمالي الكورسات
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={3}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {courses.filter(course => course.isApproved).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  الكورسات المعتمدة
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={3}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {/* Assuming a totalStudents count or a placeholder */}
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إجمالي الطلاب
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={3}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {/* Assuming a totalEnrollments count or a placeholder */}
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  إجمالي التسجيلات
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="ابحث في الكورسات..."
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
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>الصف</InputLabel>
                <Select
                  value={gradeFilter}
                  label="الصف"
                  onChange={(e) => {
                    setGradeFilter(e.target.value);
                    setDivisionFilter(''); // Reset division when grade changes
                    setSubjectFilter(''); // Reset subject when grade changes
                  }}
                >
                  <MenuItem value="">جميع الصفوف</MenuItem>
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>القسم</InputLabel>
                <Select
                  value={divisionFilter}
                  label="القسم"
                  onChange={(e) => {
                    setDivisionFilter(e.target.value);
                    setSubjectFilter(''); // Reset subject when division changes
                  }}
                  disabled={!needsDivisionSelection(gradeFilter)}
                >
                  <MenuItem value="">جميع الأقسام</MenuItem>
                  {needsDivisionSelection(gradeFilter) && getAvailableDivisions(gradeFilter).map((division) => (
                    <MenuItem key={division} value={division}>
                      {division}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>المادة</InputLabel>
                <Select
                  value={subjectFilter}
                  label="المادة"
                  onChange={(e) => setSubjectFilter(e.target.value)}
                >
                  <MenuItem value="">جميع المواد</MenuItem>
                  {getAvailableSubjects(gradeFilter, divisionFilter).map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            تم العثور على {filteredCourses.length} كورس
          </Typography>
        </Box>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              لا توجد كورسات متاحة
            </Typography>
            <Typography variant="body2" color="text.secondary">
              جرب تغيير معايير البحث أو انتظر إضافة كورسات جديدة
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={course._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    elevation={8} 
                    sx={{ 
                      height: '400px', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.05)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
                      }
                    }}
                    onClick={() => handleCourseClick(course._id)}
                  >
                    {/* Top Section with Colored Background */}
                    <Box 
                      sx={{
                        height: '280px',
                        background: `linear-gradient(135deg, ${getCourseColor(course.subject)} 0%, ${getCourseColorDark(course.subject)} 100%)`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 3,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Badge */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip 
                          label={`#${index + 1}`}
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                      </Box>

                      {/* Course Title */}
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontSize: '1.8rem', 
                            color: 'white',
                            mb: 1,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                          }}
                        >
                          {course.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1rem',
                            fontWeight: 'medium'
                          }}
                        >
                          {course.subject}
                        </Typography>
                      </Box>

                      {/* Decorative Elements */}
                      <Box sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0, 
                        opacity: 0.1,
                        transform: 'rotate(15deg) scale(1.5)',
                        pointerEvents: 'none'
                      }}>
                        <SchoolIcon sx={{ fontSize: 120, color: 'white' }} />
                      </Box>
                    </Box>
                    
                    {/* Bottom Section with Stats */}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, bgcolor: '#1a1a2e' }}>
                      {/* Stats Row */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PlayIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            {course.videos?.length || 0} درس
        </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                            {course.enrollmentCount || 0} طالب
        </Typography>
      </Box>
                      </Box>

                      {/* Rating Section */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mr: 1 }}>
                            4.9
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[...Array(5)].map((_, i) => (
                              <Box
                                key={i}
                                component="span"
                                sx={{
                                  color: i < 4 ? '#FFD700' : 'rgba(255,255,255,0.3)',
                                  fontSize: '1.2rem'
                                }}
                              >
                                ★
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                          (25)
                        </Typography>
                      </Box>

                      {/* Action Button */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course._id);
                        }}
                        sx={{ 
                          fontSize: '1rem', 
                          py: 1.5,
                          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(45deg, #764ba2 0%, #667eea 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                          }
                        }}
                      >
                        عرض التفاصيل
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default Courses;
