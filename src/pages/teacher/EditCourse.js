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
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    price: 0
  });

  useEffect(() => {
    const loadData = async () => {
      if (fetchCourseData) {
        await fetchCourseData();
      }
    };
    loadData();
  }, [id, fetchCourseData]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
    } finally {
      setSaving(false);
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
          {/* Course Info Card */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                  معلومات الكورس
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {course?.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course?.subject}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                      <CategoryIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {course?.grade}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        الصف الدراسي
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Chip 
                      label={course?.isApproved ? 'تمت الموافقة' : 'في الانتظار'}
                      color={course?.isApproved ? 'success' : 'warning'}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      label={course?.isActive ? 'نشط' : 'غير نشط'}
                      color={course?.isActive ? 'success' : 'default'}
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      icon={<VisibilityIcon />}
                      label={`${course?.enrollmentCount || 0} طالب مسجل`}
                      color="info"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Edit Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                تعديل معلومات الكورس
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="عنوان الكورس"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="وصف الكورس"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>المادة الدراسية</InputLabel>
                      <Select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        label="المادة الدراسية"
                      >
                        {subjects.map((subject) => (
                          <MenuItem key={subject} value={subject}>
                            {subject}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>الصف الدراسي</InputLabel>
                      <Select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        label="الصف الدراسي"
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="السعر"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        endAdornment: <Typography variant="body2">جنيه</Typography>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/teacher/dashboard')}
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={saving}
                      >
                        {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default EditCourse; 