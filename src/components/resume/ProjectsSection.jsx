import React, { useState, useEffect } from 'react';
import { FaStar, FaCodeBranch, FaExclamationTriangle, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import useResumeStore from '../../store/resumeStore';

const DISPLAY_MODES = {
  PINNED: 'pinned',
  ALL: 'all'
};

const MAX_PINNED = 6; // Maximum number of pinned repositories to display

export default function ProjectsSection() {
  const [error, setError] = useState(null);
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.PINNED);
  const [isLoading, setIsLoading] = useState(true);
  const githubData = useResumeStore(state => state.githubData);

  useEffect(() => {
    try {
      if (githubData?.repositories) {
        setIsLoading(false);
      }
    } catch (err) {
      setError('Error loading repository data');
      setIsLoading(false);
    }
  }, [githubData]);

  // Error boundary for data processing
  const processRepositories = () => {
    try {
      if (!githubData?.repositories) {
        throw new Error('No repository data available');
      }

      // Get pinned repositories (those with highest stars or explicitly pinned)
      const pinnedRepos = githubData.repositories
        .filter(repo => !repo.fork) // Exclude forks from pinned
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, MAX_PINNED);

      // Get all repositories sorted by creation date
      const allRepos = [...githubData.repositories]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return {
        pinned: pinnedRepos,
        all: allRepos
      };
    } catch (err) {
      console.error('Error processing repositories:', err);
      setError('Error processing repository data');
      return { pinned: [], all: [] };
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { pinned, all } = processRepositories();
  const displayedRepos = displayMode === DISPLAY_MODES.PINNED ? pinned : all;

  const ProjectCard = ({ repo }) => {
    try {
      const createdDate = new Date(repo.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });

      return (
        <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
          {/* Top Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

          <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {repo.name}
              </h3>
              <div className="flex items-center space-x-2">
                {repo.language && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
              {repo.description || 'No description available'}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1" title="Stars">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm text-gray-600">{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1" title="Forks">
                  <FaCodeBranch className="text-gray-400" />
                  <span className="text-sm text-gray-600">{repo.forks_count}</span>
                </div>
                <span className="text-sm text-gray-500">{createdDate}</span>
              </div>

              {/* Links */}
              <div className="flex items-center space-x-3">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="View on GitHub"
                >
                  <FaGithub className="text-lg" />
                </a>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="View live demo"
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error(`Error rendering project card for ${repo?.name}:`, err);
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="text-red-500" />
            <p className="text-red-600 text-sm">Error displaying repository</p>
          </div>
        </div>
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Featured Projects</h2>
        
        <div className="flex items-center space-x-4">
          {/* Display Mode Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => {
                setDisplayMode(DISPLAY_MODES.PINNED);
                setError(null); // Clear any existing errors
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors
                ${displayMode === DISPLAY_MODES.PINNED 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pinned ({pinned.length})
            </button>
            <button
              onClick={() => {
                setDisplayMode(DISPLAY_MODES.ALL);
                setError(null); // Clear any existing errors
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors
                ${displayMode === DISPLAY_MODES.ALL 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              All ({all.length})
            </button>
          </div>

          <a
            href={`https://github.com/${githubData?.profile?.login}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all
          </a>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {displayedRepos.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {displayMode === DISPLAY_MODES.PINNED 
              ? 'No pinned repositories found' 
              : 'No repositories found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedRepos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
} 