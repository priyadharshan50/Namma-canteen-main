import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { useApp } from '../context/AppContext';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      addNotification('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setEmailSent(true);
      addNotification(result.message || 'Reset link sent!', 'success');
    } else {
      addNotification(result.error || 'Failed to send reset link', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {!emailSent ? (
            <>
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900">Forgot Password?</h1>
                <p className="text-gray-600 text-sm mt-2">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl py-4 px-4 font-bold outline-none transition-all"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>Send Reset Link</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:
                <br />
                <span className="font-bold text-gray-900">{email}</span>
              </p>
              
              <Link
                to="/login"
                className="block w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg"
              >
                Back to Login
              </Link>

              <button
                onClick={() => setEmailSent(false)}
                className="mt-4 text-orange-600 font-bold text-sm hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Back Link */}
          {!emailSent && (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-gray-500 font-bold text-sm hover:text-gray-700">
                ← Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
