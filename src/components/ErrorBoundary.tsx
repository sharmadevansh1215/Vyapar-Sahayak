import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Rural Advisory UI:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleResetState = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear local storage:', e);
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4">
          <div className="bg-white border border-[#c3c6d5] rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            
            <h2 className="text-xl font-bold text-[#191c1e]">
              पोर्टल पुनः लोड करें (Application Needs Recovery)
            </h2>
            
            <p className="text-xs md:text-sm text-[#434653] leading-relaxed">
              We encountered a temporary rendering issue. Your cached business data is safe.
            </p>

            {this.state.error && (
              <div className="p-3 bg-[#f2f4f7] rounded-xl text-left font-mono text-[11px] text-[#ba1a1a] max-h-28 overflow-y-auto border border-[#c3c6d5]">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-[#003c90] hover:bg-[#002d6c] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                ताज़ा करें (Reload Portal)
              </button>
              <button
                onClick={this.handleResetState}
                className="px-5 py-2.5 bg-white border border-[#c3c6d5] hover:bg-[#f2f4f7] text-[#434653] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                रीसेट करें (Reset Cache)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
