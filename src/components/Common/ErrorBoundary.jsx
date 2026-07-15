import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-noor-bg flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white max-w-lg w-full rounded-noor p-8 shadow-noor-heavy border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-extrabold text-noor-dark mb-2">Oops! Terjadi Kesalahan.</h1>
            <p className="text-noor-textSecondary text-sm mb-6 leading-relaxed">
              Maaf, aplikasi mengalami masalah yang tidak terduga saat mencoba menampilkan halaman ini.
            </p>
            
            <div className="bg-red-50 p-4 rounded-xl text-left border border-red-100 overflow-x-auto mb-8">
              <p className="text-xs font-bold text-red-800 mb-2 font-mono">
                {this.state.error && this.state.error.toString()}
              </p>
              <details className="text-[10px] text-red-600 font-mono whitespace-pre-wrap cursor-pointer">
                <summary className="font-bold underline mb-1">Lihat Detail Stack Trace</summary>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-noor-gold text-white rounded-xl font-bold hover:bg-[#967135] transition-all shadow-md"
              >
                <RefreshCcw className="w-4 h-4" /> Muat Ulang Halaman
              </button>
              <a 
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-noor-dark border border-noor-divider rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                <Home className="w-4 h-4" /> Kembali ke Beranda
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
