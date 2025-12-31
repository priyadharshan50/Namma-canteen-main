import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-orange-600 mb-4">404</h1>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
          >
            Go Home
          </Link>
          <Link
            to="/menu"
            className="inline-block bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
