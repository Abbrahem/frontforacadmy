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
    price: 0
  });

  const fetchCourseData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/teacher');
        return;
      }

      const response = await axios.get(`/api/courses/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const courseData = response.data.course;
      setCourse(courseData);
      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
        subject: courseData.subject || '',
        grade: courseData.grade || '',
        price: courseData.price || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('فشل في تحميل بيانات الكورس');
      setLoading(false);
      
      if (error.response?.status === 401) {
        navigate('/teacher');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (fetchCourseData) {
        await fetchCourseData();
      }
    };
    loadData();
  }, [id, fetchCourseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/courses/${id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('تم تحديث الكورس بنجاح');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'فشل في تحديث الكورس');
    }
  };

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
            onClick={() => navigate('/teacher/dashboard')}
            sx={{ mb: 2 }}
          >
            العودة للوحة التحكم
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