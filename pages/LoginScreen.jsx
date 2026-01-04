import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

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
        navigate('/email-verification', { state: { email: result.email } });
      } else {
        addNotification(result.error || 'Login failed', 'error');
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left Side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-900">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-dark-900 to-dark-950"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
            <div className="text-center space-y-8 stagger-children">
              {/* Logo */}
              <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto animate-float">
                <span className="text-6xl">🍛</span>
              </div>
              
              <div>
                <h2 className="text-4xl font-black text-white mb-3">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">Namma Canteen</span>
                </h2>
                <p className="text-dark-400 text-lg max-w-md">
                  Smart campus dining with AI food pairing, real-time tracking, and gamified rewards.
                </p>
              </div>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-full text-sm text-dark-300">
                  🤖 AI Suggestions
                </span>
                <span className="px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-full text-sm text-dark-300">
                  📱 OTP Verification
                </span>
                <span className="px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-full text-sm text-dark-300">
                  💳 Namma Credit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-dark-950">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
                <span className="text-3xl">🍛</span>
              </div>
            </div>
            
            {/* Header */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-black text-white mb-2">Welcome Back!</h1>
              <p className="text-dark-400">Log in to your Namma Canteen account</p>
            </div>

            {/* Login Form */}
            <div className="card-glass p-8 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="input-group">
                  <label className="input-group-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-glow"
                  />
                </div>

                {/* Password Input */}
                <div className="input-group">
                  <label className="input-group-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="input input-glow pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-400 font-bold hover:text-primary-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-xl w-full btn-ripple"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <div className="spinner"></div>
                      Logging In...
                    </span>
                  ) : 'Log In'}
                </button>
              </form>

              {/* Divider */}
              <div className="divider-text my-6">or</div>

              {/* Signup Link */}
              <p className="text-center text-dark-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Skip for Demo */}
            <div className="text-center">
              <Link to="/" className="text-dark-500 text-sm font-medium hover:text-dark-300 transition-colors">
                Skip for now (Demo Mode) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginScreen;
