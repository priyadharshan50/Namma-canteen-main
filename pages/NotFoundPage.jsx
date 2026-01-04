import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-black text-primary-500 mb-4">404</h1>
          <h2 className="text-3xl font-black text-white mb-4">Page Not Found</h2>
          <p className="text-dark-400 mb-8 max-w-md">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary btn-xl"
            >
              Go Home
            </Link>
            <Link
              to="/menu"
              className="btn btn-ghost btn-xl"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
