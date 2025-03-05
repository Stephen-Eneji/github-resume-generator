import React, { useState, useEffect, useCallback } from 'react';
import { useGitHubData } from './hooks/useGitHubData';
import useResumeStore from './store/resumeStore';
import ResumeBuilder from './components/ResumeBuilder';
import LoadingAnimation from './components/LoadingAnimation';
import { FaGithub, FaBitcoin, FaEthereum, FaTwitter, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { BsFileEarmarkText } from 'react-icons/bs';
import { SiSolana } from 'react-icons/si';

function App() {
  const [username, setUsername] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { loading, error, fetchData, resetError } = useGitHubData();
  const githubData = useResumeStore(state => state.githubData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    try {
      setIsTransitioning(true);
      await fetchData(username);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    resetError(); // Reset any previous errors when user starts typing
  }, [resetError]);

  useEffect(() => {
    if (loading) {
      setIsTransitioning(true);
    } else {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {(loading || isTransitioning) && <LoadingAnimation />}

      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaGithub className="text-2xl sm:text-3xl" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">GitHub Resume Generator</h1>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="text-sm">Built By Stephen Eneji</span>
            <div className="flex items-center space-x-3">
              <a 
                href="https://x.com/heisenejii" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://facebook.com/heisenejii" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://wa.me/+2348166668759" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-600"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </header>

      {!githubData ? (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-8 sm:space-y-12 animate-fadeIn">
            <div className="flex justify-center">
              <BsFileEarmarkText 
                className="text-[#1D4ED8] text-5xl sm:text-7xl transform transition-all duration-300 hover:scale-110 animate-float" 
              />
            </div>
            <div className="space-y-3 sm:space-y-4 animate-slideUp">
              <h2 className="text-lg sm:text-2xl text-gray-600 font-medium">
                Transform your GitHub profile into a
              </h2>
              <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Professional Resume
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 sm:px-0 animate-slideUp delay-200">
              <div className="flex shadow-lg rounded-lg overflow-hidden">
                <span className="inline-flex items-center px-3 sm:px-4 bg-gray-50 border border-r-0 border-gray-300 text-gray-500 text-sm sm:text-base rounded-l-lg select-none">
                  github.com/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="username"
                  className="flex-1 block w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  aria-label="GitHub username"
                />
                <button
                  type="submit"
                  disabled={loading || !username.trim()}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#1D4ED8] text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2 rounded-r-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FaGithub className="text-lg sm:text-xl" />
                  <span className="hidden sm:inline">Generate Resume</span>
                  <span className="sm:hidden">Generate</span>
                </button>
              </div>
            </form>
            
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg mx-4 sm:mx-0 animate-shake">
                Error: {error}
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="animate-fadeIn">
          <ResumeBuilder />
        </div>
      )}

      <footer className="fixed bottom-0 w-full border-t bg-white/80 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end items-center space-x-4 text-gray-600">
          <span>Built By Stephen Eneji</span>
          <div className="flex items-center space-x-3">
            <a href="https://x.com/heisenejii" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaTwitter />
            </a>
            <a href="https://facebook.com/heisenejii" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaFacebook />
            </a>
            <a href="https://wa.me/+2348166668759" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 