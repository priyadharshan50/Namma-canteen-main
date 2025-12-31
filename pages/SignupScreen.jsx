import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SignupScreen = () => {
  const navigate = useNavigate();
  const { handleSignup, addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: '',
    studentId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.displayName.trim()) {
      addNotification('Please enter your full name', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addNotification('Passwords do not match!', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addNotification('Password must be at least 6 characters', 'error');
      return;
    }

    if (!agreedToTerms) {
      addNotification('Please agree to the terms and conditions', 'error');
      return;
    }

    setIsLoading(true);
    const result = await handleSignup(formData.email, formData.password, {
      displayName: formData.displayName,
      phoneNumber: formData.phoneNumber,
      studentId: formData.studentId,
    });
    setIsLoading(false);

    if (result.success) {
      addNotification(result.message || 'Account created! Please verify your email.', 'success');
      
      // Show email verification message
      navigate('/email-verification', { 
        state: { email: formData.email, emailSent: result.emailSent } 
      });
    } else {
      addNotification(result.error || 'Signup failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl mb-3">
            <span className="text-3xl">🍛</span>
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-orange-100 font-medium text-sm">Join Namma Canteen today</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="displayName"
                required
                placeholder="John Doe"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                College Email *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="student@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none transition-all"
              />
            </div>

            {/* Two columns for Phone & Student ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  maxLength={10}
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="CS2024001"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none transition-all uppercase"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-3 px-4 font-bold outline-none transition-all pr-12"
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

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 font-bold outline-none transition-all ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500'
                    : 'border-transparent focus:border-orange-500'
                }`}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs font-bold mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-0.5"
              />
              <span className="text-xs text-gray-600">
                I agree to the <a href="#" className="text-orange-600 font-bold">Terms of Service</a> and{' '}
                <a href="#" className="text-orange-600 font-bold">Privacy Policy</a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword || !agreedToTerms}
              className="w-full bg-orange-600 text-white font-black py-3.5 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>

        {/* Skip for Demo */}
        <div className="text-center mt-4">
          <Link to="/" className="text-white/80 text-sm font-medium hover:text-white underline">
            Skip for now (Demo Mode)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
