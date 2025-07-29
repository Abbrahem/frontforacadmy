import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Set base URL for API - يمكن تغييره من متغيرات البيئة
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://e650d764-c4e9-42b9-91b6-5f59c4d0bc8b-00-184uinw57mbzk.worf.replit.dev';
axios.defaults.baseURL = API_BASE_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(userData);
        
        toast.success('تم تسجيل الدخول بنجاح!');
        return { success: true, user: userData };
      } else {
        toast.error(response.data.message || 'فشل في تسجيل الدخول');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'حدث خطأ في تسجيل الدخول';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, user: newUser } = response.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('userName', newUser.name);
        localStorage.setItem('userRole', newUser.role);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(newUser);
        
        toast.success('تم إنشاء الحساب بنجاح!');
        return { success: true, user: newUser };
      } else {
        toast.error(response.data.message || 'فشل في إنشاء الحساب');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'حدث خطأ في إنشاء الحساب';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    
    toast.success('تم تسجيل الخروج بنجاح!');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
