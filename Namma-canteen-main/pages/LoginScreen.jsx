import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for verification redirect
  const verified = new URLSearchParams(location.search).get('verified');
  
  React.useEffect(() => {
    if (verified === 'true') {
      addNotification('Email verified successfully! You can now log in.', 'success');
    }
  }, [verified, addNotification]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await handleLogin(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      addNotification('Welcome back! 👋', 'success');
      
      // Check verification status and redirect accordingly
      if (!result.user.emailVerified) {
        navigate('/email-verification', { state: { email: result.user.email } });
      } else if (!result.user.isPhoneVerified) {
        navigate('/verify-phone');
      } else if (!result.user.profileCompleted) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } else {
      if (result.needsVerification) {
        addNotification(result.error, 'error');
        // Navigate to email verification screen
        navigate('/email-verification', { state: { email: result.email } });
      } else {
        addNotification(result.error || 'Login failed', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <span className="text-4xl">🍛</span>
          </div>
          <h1 className="text-3xl font-black text-white">Welcome Back!</h1>
          <p className="text-orange-100 font-medium">Log in to Namma Canteen</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-4 px-4 font-bold outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-4 px-4 font-bold outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 font-bold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging In...
                </>
              ) : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Skip for Demo */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white/80 text-sm font-medium hover:text-white underline">
            Skip for now (Demo Mode)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
