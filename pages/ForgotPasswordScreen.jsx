import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

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
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Card */}
          <div className="card-glass p-8 rounded-3xl">
            {!emailSent ? (
              <>
                {/* Icon */}
                <div className="text-center mb-6 fade-in">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-full mb-4 animate-float">
                    <span className="text-4xl">🔐</span>
                  </div>
                  <h1 className="text-2xl font-black text-white">Forgot Password?</h1>
                  <p className="text-dark-400 text-sm mt-2">
                    No worries! Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="input-group">
                    <label className="input-group-label">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="student@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-glow"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-xl w-full btn-ripple"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="spinner"></div>
                        Sending...
                      </span>
                    ) : (
                      <>Send Reset Link</>
                    )}
                  </button>
                </form>

                {/* Back Link */}
                <div className="mt-6 text-center">
                  <Link to="/login" className="text-dark-400 font-bold text-sm hover:text-white transition-colors">
                    ← Back to Login
                  </Link>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 scale-in">
                  <span className="text-4xl">✅</span>
                </div>
                <h1 className="text-2xl font-black text-white mb-2">Check Your Email</h1>
                <p className="text-dark-400 mb-6">
                  We've sent a password reset link to:
                  <br />
                  <span className="font-bold text-white">{email}</span>
                </p>
                
                <Link
                  to="/login"
                  className="btn btn-primary btn-xl w-full"
                >
                  Back to Login
                </Link>

                <button
                  onClick={() => setEmailSent(false)}
                  className="mt-4 text-primary-400 font-bold text-sm hover:text-primary-300 transition-colors"
                >
                  Try a different email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordScreen;
