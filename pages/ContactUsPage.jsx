import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

const ContactUsPage = () => {
  const { addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    addNotification('Thank you for contacting us! We\'ll get back to you soon. 📧', 'success');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Touch</span>
            </h1>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card-glass p-8 rounded-3xl">
              <h2 className="text-2xl font-black text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="input-group">
                  <label className="input-group-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-glow"
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label className="input-group-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-glow"
                  />
                </div>

                {/* Phone */}
                <div className="input-group">
                  <label className="input-group-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-glow"
                  />
                </div>

                {/* Subject */}
                <div className="input-group">
                  <label className="input-group-label">Subject</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="input input-glow"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="support">Technical Support</option>
                    <option value="credit">Credit System</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="input-group">
                  <label className="input-group-label">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    className="input input-glow resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-xl w-full btn-ripple"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3 justify-center">
                      <div className="spinner"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <span>Send Message</span>
                      <span>📨</span>
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details Card */}
              <div className="card-glass p-8 rounded-3xl">
                <h2 className="text-2xl font-black text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-dark-400 mb-1">Email</h3>
                      <a href="mailto:info@nammacanteen.edu" className="text-white hover:text-primary-400 transition-colors">
                        info@nammacanteen.edu
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-dark-400 mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-white hover:text-primary-400 transition-colors">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-dark-400 mb-1">Location</h3>
                      <p className="text-white">
                        Campus Canteen, Main Building<br />
                        College Campus, Chennai<br />
                        Tamil Nadu - 600001
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🕐</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-dark-400 mb-1">Operating Hours</h3>
                      <p className="text-white">
                        Monday - Friday: 8:00 AM - 8:00 PM<br />
                        Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="card-glass p-8 rounded-3xl">
                <h2 className="text-2xl font-black text-white mb-6">Follow Us</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-dark-800 hover:bg-primary-600 rounded-xl transition-all group"
                  >
                    <span className="text-2xl">📘</span>
                    <span className="text-white font-bold group-hover:text-white">Facebook</span>
                  </a>
                  
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-dark-800 hover:bg-primary-600 rounded-xl transition-all group"
                  >
                    <span className="text-2xl">🐦</span>
                    <span className="text-white font-bold group-hover:text-white">Twitter</span>
                  </a>
                  
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-dark-800 hover:bg-primary-600 rounded-xl transition-all group"
                  >
                    <span className="text-2xl">📸</span>
                    <span className="text-white font-bold group-hover:text-white">Instagram</span>
                  </a>
                  
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-dark-800 hover:bg-primary-600 rounded-xl transition-all group"
                  >
                    <span className="text-2xl">💼</span>
                    <span className="text-white font-bold group-hover:text-white">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="card-glass p-6 rounded-3xl bg-gradient-to-br from-primary-600/10 to-primary-500/5 border border-primary-500/20">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">❓</span>
                  <div>
                    <h3 className="text-white font-bold mb-1">Need Quick Answers?</h3>
                    <p className="text-sm text-dark-400">Check out our FAQ section for common questions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactUsPage;
