import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="flex items-center justify-center min-h-[400px] w-full p-6">
          <GlassCard className="max-w-md w-full p-8 text-center border-red-500/20" hover={false}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-red-500/10 text-red-500">
                <AlertTriangle className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Algo deu errado</h2>
            <p className="text-secondary mb-8">
              Ocorreu um erro inesperado ao carregar este componente. Por favor, tente novamente.
            </p>
            <GradientButton 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Tentar Novamente
            </GradientButton>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
