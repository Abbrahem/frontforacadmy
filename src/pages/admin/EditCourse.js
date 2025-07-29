import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    division: '',
    isApproved: false,
    isActive: false,
    price: 0
  });

  const subjects = [
    'الرياضيات',
    'العلوم',
    'اللغة العربية',
    'اللغة الإنجليزية',
    'الدراسات الاجتماعية',
    'الكمبيوتر',
    'الفيزياء',
    'الكيمياء',
    'الأحياء',
    'التاريخ',
    'الجغرافيا',
    'التربية الإسلامية',
    'التربية الفنية',
    'التربية الرياضية'
  ];

  const grades = [
    'الصف الأول الابتدائي',
    'الصف الثاني الابتدائي',
    'الصف الثالث الابتدائي',
    'الصف الرابع الابتدائي',
    'الصف الخامس الابتدائي',
    'الصف السادس الابتدائي',
    'الصف الأول الإعدادي',
    'الصف الثاني الإعدادي',
    'الصف الثالث الإعدادي',
    'الصف الأول الثانوي',
    'الصف الثاني الثانوي',
    'الصف الثالث الثانوي'
  ];


  const fetchCourseData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      const response = await axios.get(`/api/admin/courses/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const courseData = response.data.course;
      setCourse(courseData);
      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
        subject: courseData.subject || '',
        grade: courseData.grade || '',
        division: courseData.division || '',
        isApproved: courseData.isApproved || false,
        isActive: courseData.isActive || false,
        price: courseData.price || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('فشل في تحميل بيانات الكورس');
      setLoading(false);
      
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    const loadData = async () => {
      await fetchCourseData();
    };
    loadData();
  }, [id, fetchCourseData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/courses/${id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('تم تحديث الكورس بنجاح');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('فشل في تحديث الكورس');
    }
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/courses')}
            sx={{ mb: 2 }}
          >
            العودة للكورسات
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 2, color: 'primary.main' }} />
            تعديل الكورس
          </Typography>
          <Typography variant="body1" color="text.secondary">
            تحديث معلومات الكورس: {course?.title}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  معلومات الكورس
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">العنوان:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {course?.title || 'غير محدد'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">المادة:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {course?.subject || 'غير محدد'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">المرحلة:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {course?.grade || 'غير محدد'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">القسم:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {course?.division || 'غير محدد'}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">الحالة:</Typography>
                  <Chip 
                    label={course?.isApproved ? 'معتمد' : 'في انتظار الاعتماد'}
                    color={course?.isApproved ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">تاريخ الإنشاء:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {course?.createdAt ? new Date(course.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  تعديل الكورس
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        label="عنوان الكورس"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <TextField
                        fullWidth
                        label="وصف الكورس"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        required
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>المادة</InputLabel>
                        <Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          {subjects.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                              {subject}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>المرحلة</InputLabel>
                        <Select
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          required
                        >
                          {grades.map((grade) => (
                            <MenuItem key={grade} value={grade}>
                              {grade}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>القسم</InputLabel>
                        <Select
                          name="division"
                          value={formData.division}
                          onChange={handleInputChange}
                          required
                        >
                          {['علمي', 'أدبي'].map((division) => (
                            <MenuItem key={division} value={division}>
                              {division}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>حالة الاعتماد</InputLabel>
                        <Select
                          name="isApproved"
                          value={formData.isApproved}
                          onChange={handleInputChange}
                          required
                        >
                          <MenuItem value={true}>معتمد</MenuItem>
                          <MenuItem value={false}>غير معتمد</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                      >
                        {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default EditCourse; 