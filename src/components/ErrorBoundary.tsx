import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-red-500 font-mono text-sm">
          <div className="bg-slate-900 border-2 border-red-900 rounded-2xl p-6 max-w-4xl w-full shadow-2xl overflow-auto">
            <h1 className="text-xl font-bold mb-4 text-red-400">🚨 Application Crash (ErrorBoundary)</h1>
            <h2 className="text-white font-bold mb-2">{this.state.error && this.state.error.toString()}</h2>
            <pre className="text-xs text-red-300 bg-black/50 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
              {this.state.errorInfo?.componentStack}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-red-900/50 hover:bg-red-800 text-white px-6 py-2 rounded-xl transition"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
