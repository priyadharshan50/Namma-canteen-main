import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

const SignupScreen = () => {
  const navigate = useNavigate();
  const { handleSignup, addNotification } = useApp();
  
  const [step, setStep] = useState(1);
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

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.displayName.trim()) {
        addNotification('Please enter your full name', 'error');
        return;
      }
      if (!formData.email.trim()) {
        addNotification('Please enter your email', 'error');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      navigate('/email-verification', { 
        state: { email: formData.email, emailSent: result.emailSent } 
      });
    } else {
      addNotification(result.error || 'Signup failed', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="text-3xl">🍛</span>
            </div>
            <h1 className="text-2xl font-black text-white">Create Account</h1>
            <p className="text-dark-400 text-sm">Join Namma Canteen today</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-dark-800 text-dark-500 border border-dark-700'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Signup Form */}
          <div className="card-glass p-6 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4 fade-in">
                  <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                  
                  <div className="input-group">
                    <label className="input-group-label">Full Name *</label>
                    <input
                      type="text"
                      name="displayName"
                      required
                      placeholder="John Doe"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="input input-glow"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-group-label">College Email *</label>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="input-group">
                      <label className="input-group-label">Phone</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                        className="input input-glow"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-group-label">Student ID</label>
                      <input
                        type="text"
                        name="studentId"
                        placeholder="CS2024001"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="input input-glow uppercase"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary btn-xl w-full"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2: Password */}
              {step === 2 && (
                <div className="space-y-4 fade-in">
                  <h3 className="text-lg font-bold text-white mb-4">Create Password</h3>
                  
                  <div className="input-group">
                    <label className="input-group-label">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        placeholder="Min. 6 characters"
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
                    
                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-dark-700'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p className={`text-xs font-bold ${
                          passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          Password Strength: {strengthLabels[passwordStrength]}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label className="input-group-label">Confirm Password *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`input ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'input-error'
                          : 'input-glow'
                      }`}
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="input-group-error">Passwords do not match</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary flex-1"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!formData.password || formData.password !== formData.confirmPassword}
                      className="btn btn-primary flex-1"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-4 fade-in">
                  <h3 className="text-lg font-bold text-white mb-4">Review & Confirm</h3>
                  
                  {/* Summary Card */}
                  <div className="bg-dark-800/50 rounded-xl p-4 space-y-3 border border-dark-700">
                    <div className="flex justify-between">
                      <span className="text-dark-400 text-sm">Name</span>
                      <span className="text-white font-bold text-sm">{formData.displayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400 text-sm">Email</span>
                      <span className="text-white font-bold text-sm">{formData.email}</span>
                    </div>
                    {formData.phoneNumber && (
                      <div className="flex justify-between">
                        <span className="text-dark-400 text-sm">Phone</span>
                        <span className="text-white font-bold text-sm">{formData.phoneNumber}</span>
                      </div>
                    )}
                    {formData.studentId && (
                      <div className="flex justify-between">
                        <span className="text-dark-400 text-sm">Student ID</span>
                        <span className="text-white font-bold text-sm">{formData.studentId}</span>
                      </div>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      agreedToTerms 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'border-dark-600 group-hover:border-dark-500'
                    }`}>
                      {agreedToTerms && <span className="text-white text-xs">✓</span>}
                    </div>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={() => setAgreedToTerms(!agreedToTerms)}
                      className="sr-only"
                    />
                    <span className="text-xs text-dark-400">
                      I agree to the <a href="#" className="text-primary-400 font-bold hover:text-primary-300">Terms of Service</a> and{' '}
                      <a href="#" className="text-primary-400 font-bold hover:text-primary-300">Privacy Policy</a>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn btn-secondary flex-1"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !agreedToTerms}
                      className="btn btn-primary flex-1 btn-ripple"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="spinner"></div>
                          Creating...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="divider-text my-5">or</div>

            {/* Login Link */}
            <p className="text-center text-dark-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
                Log In
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
    </PageTransition>
  );
};

export default SignupScreen;
