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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  // Alert,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const EnrollmentsManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const fetchEnrollments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus
      });

      const response = await axios.get(`/api/admin/enrollments?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setEnrollments(response.data.enrollments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      console.error('فشل في تحميل التسجيلات');
      setLoading(false);
      
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  }, [page, rowsPerPage, searchTerm, filterStatus, navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/enrollment-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (fetchEnrollments) {
        await fetchEnrollments();
      }
      if (fetchStats) {
        await fetchStats();
      }
    };
    loadData();
  }, [page, rowsPerPage, searchTerm, filterStatus, fetchEnrollments, fetchStats]);

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/enrollments/${enrollmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('تم حذف التسجيل بنجاح');
      fetchEnrollments();
      fetchStats();
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      toast.error('فشل في حذف التسجيل');
    }
  };

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDialogOpen(true);
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.student?._id?.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 2, color: 'primary.main' }} />
            إدارة التسجيلات
          </Typography>
          <Typography variant="body1" color="text.secondary">
            عرض وإدارة جميع تسجيلات الطلاب في الكورسات
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalEnrollments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    إجمالي التسجيلات
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
                    {stats.activeStudents || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    طلاب نشطين
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
                    {stats.totalCourses || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    الكورسات المسجلة
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.completedEnrollments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    تسجيلات مكتملة
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="ابحث في التسجيلات..."
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
                <InputLabel>حالة التسجيل</InputLabel>
                <Select
                  value={filterStatus}
                  label="حالة التسجيل"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">جميع الحالات</MenuItem>
                  <MenuItem value="active">نشط</MenuItem>
                  <MenuItem value="completed">مكتمل</MenuItem>
                  <MenuItem value="cancelled">ملغي</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                startIcon={<ClearIcon />}
              >
                مسح الفلاتر
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Enrollments Table */}
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID الطالب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>اسم الطالب</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>البريد الإلكتروني</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الكورس</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>تاريخ التسجيل</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التقدم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEnrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Box>
                        <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                          لا توجد تسجيلات
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment._id} hover>
                      <TableCell>
                        <Chip 
                          label={enrollment.student?._id?.slice(-6) || 'غير متوفر'} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                            <PersonIcon />
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                            {enrollment.student?.name || 'غير متوفر'}
                          </Typography>
                          {enrollment.student?._id && (
                            <Chip
                              label={`ID: ${enrollment.student._id}`}
                              size="small"
                              color="info"
                              sx={{ ml: 1, fontFamily: 'monospace' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {enrollment.student?.email || 'غير متوفر'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {enrollment.course?.title || 'غير متوفر'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {enrollment.course?.subject} - {enrollment.course?.grade}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(enrollment.createdAt).toLocaleDateString('ar-EG')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${enrollment.progress?.overallProgress || 0}%`}
                          size="small"
                          color={enrollment.progress?.overallProgress >= 100 ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={enrollment.status === 'active' ? 'نشط' : 'غير نشط'}
                          size="small"
                          color={enrollment.status === 'active' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="عرض التفاصيل">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(enrollment)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف التسجيل">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteEnrollment(enrollment._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredEnrollments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="صفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
          />
        </Paper>

        {/* Enrollment Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            تفاصيل التسجيل
          </DialogTitle>
          <DialogContent>
            {selectedEnrollment && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>معلومات الطالب</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">الاسم:</Typography>
                      <Typography variant="body1">{selectedEnrollment.student?.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">البريد الإلكتروني:</Typography>
                      <Typography variant="body1">{selectedEnrollment.student?.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">ID الطالب:</Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {selectedEnrollment.student?._id}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>معلومات الكورس</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">عنوان الكورس:</Typography>
                      <Typography variant="body1">{selectedEnrollment.course?.title}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">المادة:</Typography>
                      <Typography variant="body1">{selectedEnrollment.course?.subject}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">المرحلة:</Typography>
                      <Typography variant="body1">{selectedEnrollment.course?.grade}</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="h6" gutterBottom>معلومات التسجيل</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">تاريخ التسجيل:</Typography>
                      <Typography variant="body1">
                        {new Date(selectedEnrollment.createdAt).toLocaleString('ar-EG')}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">التقدم:</Typography>
                      <Typography variant="body1">
                        {selectedEnrollment.progress?.overallProgress || 0}%
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">الحالة:</Typography>
                      <Chip 
                        label={selectedEnrollment.status === 'active' ? 'نشط' : 'غير نشط'}
                        color={selectedEnrollment.status === 'active' ? 'success' : 'default'}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>إغلاق</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default EnrollmentsManagement; 