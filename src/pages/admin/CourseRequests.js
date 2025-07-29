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
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material';

const CourseRequests = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchPendingCourses = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin');
          return;
        }

      const response = await axios.get('/api/admin/pending-courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setPendingCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pending courses:', error);
      setError('فشل في تحميل طلبات الكورس');
        setLoading(false);
        
        if (error.response?.status === 401) {
          navigate('/admin');
        }
      }
  }, [navigate]);

  useEffect(() => {
    fetchPendingCourses();
  }, [fetchPendingCourses]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleApproveReject = async (approved) => {
    if (!selectedRequest) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      const response = await axios.put(
        `/api/admin/approve-course/${selectedRequest.requestId}`,
        { 
          approved,
          adminNotes: adminNotes.trim() || undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`تم ${approved ? 'الموافقة على' : 'رفض'} طلب الكورس بنجاح`);
        setDialogOpen(false);
        setSelectedRequest(null);
        setAdminNotes('');
        // Remove the processed request from the list
        setPendingCourses(prev => prev.filter(req => req.requestId !== selectedRequest.requestId));
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error(`فشل في ${approved ? 'الموافقة على' : 'رفض'} طلب الكورس`);
    } finally {
      setProcessing(false);
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
            طلبات إنشاء الكورس
          </Typography>
          <Typography variant="body1" color="text.secondary">
            مراجعة وموافقة على طلبات إنشاء الكورس الجديدة
          </Typography>
        </Box>
      
      {pendingCourses.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              لا توجد طلبات كورس في الانتظار
            </Typography>
            <Typography variant="body2" color="text.secondary">
              جميع الطلبات تمت معالجتها أو لا توجد طلبات جديدة
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {pendingCourses.map((request, index) => (
              <Grid xs={12} md={6} lg={4} key={request.requestId}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {request.coverImage && (
                      <Box sx={{ height: 200, overflow: 'hidden' }}>
                        <img 
                          src={request.coverImage} 
                          alt="صورة الغلاف"
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3" noWrap>
                            {request.teacherName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {request.teacherEmail}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {request.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {request.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={request.subject} 
                          color="primary" 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip 
                          label={request.grade} 
                          color="secondary" 
                          size="small" 
                          sx={{ mb: 1 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                        <DateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {new Date(request.createdAt).toLocaleDateString('ar-SA')}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(request)}
                          sx={{ flex: 1 }}
                        >
                          التفاصيل
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<ApproveIcon />}
                          onClick={() => {
                            setSelectedRequest(request);
                            setDialogOpen(true);
                          }}
                          sx={{ flex: 1 }}
                        >
                          موافقة
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<RejectIcon />}
                          onClick={() => {
                            setSelectedRequest(request);
                            setDialogOpen(true);
                          }}
                          sx={{ flex: 1 }}
                        >
                          رفض
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
            </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Details Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} />
              تفاصيل طلب الكورس
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>معلومات الكورس</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>اسم الكورس:</strong> {selectedRequest.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>المادة:</strong> {selectedRequest.subject}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>الصف الدراسي:</strong> {selectedRequest.grade}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <strong>الوصف:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      {selectedRequest.description}
                    </Typography>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>صورة الغلاف</Typography>
                    {selectedRequest.coverImage ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <img 
                          src={selectedRequest.coverImage} 
                          alt="صورة الغلاف"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px', 
                            borderRadius: '8px',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        لا توجد صورة غلاف
                      </Typography>
                    )}
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>معلومات المعلم</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {selectedRequest.teacherName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedRequest.teacherEmail}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>تاريخ الطلب:</strong> {new Date(selectedRequest.createdAt).toLocaleString('ar-SA')}
                    </Typography>
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="ملاحظات المدير (اختياري)"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  sx={{ mt: 3 }}
                  placeholder="اكتب ملاحظاتك حول هذا الطلب..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setDialogOpen(false)}
              disabled={processing}
            >
              إلغاء
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={processing ? <CircularProgress size={20} /> : <RejectIcon />}
              onClick={() => handleApproveReject(false)}
              disabled={processing}
            >
              رفض
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={processing ? <CircularProgress size={20} /> : <ApproveIcon />}
              onClick={() => handleApproveReject(true)}
              disabled={processing}
            >
              موافقة
            </Button>
          </DialogActions>
        </Dialog>
    </motion.div>
    </Container>
  );
};

export default CourseRequests;
