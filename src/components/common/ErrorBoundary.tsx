import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      localStorage.clear();
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-alert-200 rounded-2xl shadow-card text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-alert-100 text-alert-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {this.props.fallbackTitle || 'Component Render Issue Intercepted'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {this.state.error?.message || 'An unexpected state discrepancy occurred in the data stream.'}
          </p>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset State & Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
