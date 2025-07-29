import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'parent':
        return '/parent/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {isAuthenticated && (
              <span className="text-xl font-bold text-gradient">Areeb</span>
            )}
          </Link>

          {/* Center Platform Name for Non-Authenticated Users */}
          {!isAuthenticated && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="text-xl font-bold text-gradient">Areeb</span>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
                >
                  Courses
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-dark-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
                >
                  Courses
                </Link>
                
                {/* Dashboard Link - Outside Dropdown */}
                <Link
                  to={getDashboardLink()}
                  className={`nav-link ${isActive(getDashboardLink()) ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-dark-300 hover:text-white transition-colors duration-200">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm">{user?.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-dark-700">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark-300 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-dark-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Center Platform Name for Mobile - Only for non-authenticated users */}
              {!isAuthenticated && (
                <div className="text-center py-2 border-b border-dark-700 mb-2">
                  <span className="text-xl font-bold text-gradient">Areeb</span>
                </div>
              )}
              
              <Link
                to="/"
                className={`block px-3 py-2 text-base font-medium nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`block px-3 py-2 text-base font-medium nav-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className={`block px-3 py-2 text-base font-medium nav-link ${isActive(getDashboardLink()) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="border-t border-dark-700 pt-4">
                    <div className="flex items-center px-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">{user?.name}</div>
                        <div className="text-sm font-medium text-dark-400 capitalize">{user?.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-3 block px-3 py-2 text-base font-medium text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-dark-700 pt-4 space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-dark-300 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium bg-primary-600 text-white rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
