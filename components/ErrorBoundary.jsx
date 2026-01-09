import React from 'react';
import { logError } from '../services/errorHandler';

/**
 * Error Boundary Component
 * Catches React rendering errors and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    logError(error, {
      componentStack: errorInfo.componentStack,
      boundaryName: this.props.name || 'ErrorBoundary',
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI from props
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: this.handleReset,
        });
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="card-glass p-8 rounded-3xl text-center space-y-6">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">😕</span>
              </div>

              {/* Error Message */}
              <div>
                <h1 className="text-2xl font-black text-white mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-dark-400 text-sm">
                  We're sorry for the inconvenience. The application encountered an unexpected error.
                </p>
              </div>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 text-left">
                  <p className="text-xs font-mono text-red-400 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="mt-2">
                      <summary className="text-xs text-dark-500 cursor-pointer hover:text-dark-400">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-dark-500 mt-2 overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="btn btn-primary btn-lg w-full"
                >
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="btn btn-secondary btn-lg w-full"
                >
                  Reload Page
                </button>

                <a
                  href="/"
                  className="block text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Go to Homepage
                </a>
              </div>

              {/* Support Link */}
              <p className="text-xs text-dark-500">
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Render children when there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
