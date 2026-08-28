import { Component, type ErrorInfo, type ReactNode } from 'react';
import ErrorState from '../ui/ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <ErrorState
            title="Application Crash"
            description={this.state.error?.message || 'A critical rendering error occurred inside the viewport.'}
            retryLabel="Reload Application"
            onRetry={this.handleReload}
            className="max-w-md shadow-panel bg-surface border border-border"
          />
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
