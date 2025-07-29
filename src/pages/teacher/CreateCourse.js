import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardMedia
} from '@mui/material';
import { 
  School as SchoolIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    grade: '',
    division: ''
  });
  
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // const teacherName = localStorage.getItem('userName') || 'Teacher';

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

  // const subjects = [
  //   'اللغة العربية', 'الرياضيات', 'التاريخ', 'الجغرافيا', 'العلوم', 
  //   'الكيمياء', 'الفيزياء', 'الأحياء', 'الفلسفة', 'الفرنساوي', 
  //   'التربية الدينية', 'الإنجليزية', 'جيولوجيا'
  // ];

  const grades = [
    'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي',
    'الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي',
    'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم الكورس مطلوب';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'المادة مطلوبة';
    }

    if (!formData.grade) {
      newErrors.grade = 'الصف الدراسي مطلوب';
    }

    if (needsDivisionSelection(formData.grade) && !formData.division) {
      newErrors.division = 'القسم مطلوب';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف الكورس مطلوب';
    } else if (formData.description.length < 20) {
      newErrors.description = 'وصف الكورس يجب أن يكون 20 حرف على الأقل';
    }

    if (!coverImage) {
      newErrors.coverImage = 'صورة الغلاف مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset subject when grade or division changes
    if (name === 'grade' || name === 'division') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subject: '' // Reset subject selection
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة صحيح');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.coverImage) {
        setErrors(prev => ({
          ...prev,
          coverImage: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('grade', formData.grade);
      formDataToSend.append('division', formData.division);
      formDataToSend.append('coverImage', coverImage);

      const response = await axios.post(
        '/api/courses/request', 
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('تم إرسال طلب إنشاء الكورس بنجاح! سيتم مراجعته من قبل المدير');
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      console.error('Error creating course request:', error);
      const errorMessage = error.response?.data?.message || 'فشل في إرسال طلب إنشاء الكورس';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              إنشاء كورس جديد
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              سيتم إرسال طلب إنشاء الكورس للمدير للمراجعة والموافقة. 
              ستتلقى إشعاراً عند الموافقة على الكورس.
        </Typography>
          </Alert>
        
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid xs={12}>
          <TextField
                  fullWidth
            required
            id="name"
                  label="اسم الكورس"
            name="name"
            value={formData.name}
            onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="outlined"
                  size="large"
          />
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.grade}>
                  <InputLabel id="grade-label">الصف الدراسي</InputLabel>
                  <Select
                    labelId="grade-label"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    label="الصف الدراسي"
            onChange={handleChange}
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.grade && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.grade}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Division Selection for Secondary Grades */}
              {needsDivisionSelection(formData.grade) && (
                <Grid xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.division}>
                    <InputLabel id="division-label">القسم</InputLabel>
                    <Select
                      labelId="division-label"
                      id="division"
                      name="division"
                      value={formData.division}
                      label="القسم"
                      onChange={handleChange}
                    >
                      {getAvailableDivisions(formData.grade).map((division) => (
                        <MenuItem key={division} value={division}>
                          {division}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.division && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {errors.division}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              )}

              <Grid xs={12} md={6}>
                <FormControl fullWidth required error={!!errors.subject}>
                  <InputLabel id="subject-label">المادة</InputLabel>
                  <Select
                    labelId="subject-label"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    label="المادة"
                    onChange={handleChange}
                  >
                    {getAvailableSubjects(formData.grade, formData.division).map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subject && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {errors.subject}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    صورة الغلاف
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="cover-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="cover-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      اختيار صورة الغلاف
                    </Button>
                  </label>
                  {errors.coverImage && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                      {errors.coverImage}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    الحد الأقصى: 5 ميجابايت. الأنواع المدعومة: JPG, PNG, GIF
                  </Typography>
                </Box>

                {imagePreview && (
                  <Card sx={{ maxWidth: 300, mb: 2 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={imagePreview}
                      alt="صورة الغلاف"
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                )}
              </Grid>
              
              <Grid xs={12}>
          <TextField
                  fullWidth
            required
            multiline
            rows={4}
            id="description"
                  label="وصف الكورس"
            name="description"
            value={formData.description}
            onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description || 'اشرح محتوى الكورس والأهداف التعليمية'}
                  variant="outlined"
                  placeholder="اكتب وصفاً مفصلاً للكورس..."
          />
              </Grid>
            </Grid>
          
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="button"
              variant="outlined"
                startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
                disabled={loading}
            >
                رجوع
            </Button>
              
            <Button
              type="submit"
              variant="contained"
                size="large"
              disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{ minWidth: 200 }}
            >
                {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
          </Box>
        </Box>
      </Paper>
      </motion.div>
    </Container>
  );
};

export default CreateCourse;
