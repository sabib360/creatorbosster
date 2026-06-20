/**
 * Error Boundary Component
 * Catches JavaScript errors and displays a user-friendly fallback.
 */

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo: errorInfo.componentStack || '' });

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      console.error('[ErrorBoundary]', error.message, error.stack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-sm text-white/50">
                An unexpected error occurred. Our team has been notified.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-left">
                <p className="text-xs font-mono text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/[0.06] border border-white/[0.1] text-white text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Home className="w-4 h-4" /> Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
