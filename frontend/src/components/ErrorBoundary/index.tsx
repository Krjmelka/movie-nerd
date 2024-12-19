import React, { Component, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import './style.scss';

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isImageLoaded: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isImageLoaded: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidMount(): void {
    this.preloadImage();
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  preloadImage() {
    const img = new Image();
    img.src = '/error.gif';

    img.onload = () => {
      this.setState({ isImageLoaded: true });
    };

    img.onerror = () => {
      console.error(`Failed to preload image`);
    };
  }

  render() {
    const { children, t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="error-container">
          {this.state.isImageLoaded && <img src="/error.gif" alt="error" />}
          <span>{t('Whoops, something went wrong...')}</span>
        </div>
      );
    }

    return children;
  }
}

const ErrorBoundaryWithTranslation = withTranslation()(ErrorBoundary);

export default ErrorBoundaryWithTranslation;
