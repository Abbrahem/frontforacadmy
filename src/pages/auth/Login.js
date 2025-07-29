import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();

  // const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      const role = user.role;
      let redirectPath = '/courses';
      
      switch (role) {
        case 'student':
          redirectPath = '/courses';
          break;
        case 'teacher':
          redirectPath = '/teacher/dashboard';
          break;
        case 'parent':
          redirectPath = '/parent/dashboard';
          break;
        case 'admin':
          redirectPath = '/admin/dashboard';
          break;
        default:
          redirectPath = '/courses';
      }
      
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Navigation will be handled by useEffect when user state updates
      console.log('Login successful, redirecting...');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Areeb</span>
            </Link>
            <h2 className="text-3xl font-bold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-dark-300">
              Sign in to your account to continue learning
            </p>
          </div>
        </motion.div>

        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button type="button" className="font-medium text-primary-400 hover:text-primary-300">
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-dark-300">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300">
                Sign up
              </Link>
            </p>
          </div>
        </motion.form>

        {/* Demo Accounts */}
        <motion.div
          className="mt-8 p-4 bg-dark-800 rounded-lg border border-dark-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-white mb-3">Demo Accounts</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-dark-300">Student:</span>
              <span className="text-primary-400">student@demo.com / password</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Teacher:</span>
              <span className="text-primary-400">teacher@demo.com / password</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Parent:</span>
              <span className="text-primary-400">parent@demo.com / password</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Admin:</span>
              <span className="text-primary-400">admin@demo.com / password</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
