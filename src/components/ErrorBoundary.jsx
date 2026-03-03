import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Details</h3>
                <p className="text-red-600 mb-2">{this.state.error?.message || 'Unknown error'}</p>
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-red-500 hover:text-red-700">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto">
                    {JSON.stringify(this.state.error, null, 2)}
                  </pre>
                  <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto">
                    {JSON.stringify(this.state.errorInfo, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
