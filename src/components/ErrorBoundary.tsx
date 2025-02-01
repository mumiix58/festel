import { Component, ErrorInfo, ReactNode } from 'react';
import { Container } from './ui/Container';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Etwas ist schiefgelaufen
              </h2>
              <p className="mt-2 text-gray-600">
                {this.state.error?.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
              </p>
              <button
                onClick={this.handleRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent-dark"
              >
                <RefreshCw className="h-4 w-4" />
                Erneut versuchen
              </button>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}