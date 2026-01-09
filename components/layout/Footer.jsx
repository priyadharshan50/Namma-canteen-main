import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍛</span>
              </div>
              <h3 className="text-lg font-black text-white">Namma Canteen</h3>
            </div>
            <p className="text-sm text-dark-400 leading-relaxed">
              Smart campus dining with AI food pairing, real-time order tracking, and gamified rewards system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/kitchen" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                  Kitchen Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2">
              <li className="text-sm text-dark-400">🤖 AI Food Pairing</li>
              <li className="text-sm text-dark-400">📱 Phone OTP Verification</li>
              <li className="text-sm text-dark-400">💳 Namma Credit System</li>
              <li className="text-sm text-dark-400">🎯 Real-time Tracking</li>
              <li className="text-sm text-dark-400">🌿 Green Token Rewards</li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-3 mb-4">
              <li>
                <a href="mailto:info@nammacanteen.edu" className="text-sm text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span>📧</span>
                  <span>info@nammacanteen.edu</span>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="text-sm text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span>📞</span>
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2 font-bold">
                  <span>💬</span>
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <span className="text-sm">📘</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <span className="text-sm">🐦</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <span className="text-sm">📸</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-dark-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <span className="text-sm">💼</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-dark-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-dark-500">
              © {currentYear} Namma Canteen. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-xs text-dark-500 hover:text-primary-400 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
