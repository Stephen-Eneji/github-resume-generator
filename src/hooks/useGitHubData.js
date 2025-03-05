import { useState, useCallback } from 'react';
import { fetchGitHubData } from '../utils/api';
import useResumeStore from '../store/resumeStore';

export const useGitHubData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setGitHubData = useResumeStore(state => state.setGitHubData);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const fetchData = useCallback(async (username) => {
    try {
      if (!username?.trim()) {
        throw new Error('Username is required');
      }

      setLoading(true);
      setError(null);
      
      const data = await fetchGitHubData(username);
      
      if (!data.profile || !data.repositories) {
        throw new Error('Invalid data received from GitHub');
      }

      setGitHubData(data);
    } catch (err) {
      setError(err.message);
      setGitHubData(null);
    } finally {
      setLoading(false);
    }
  }, [setGitHubData]);

  return { 
    loading, 
    error, 
    fetchData,
    resetError 
  };
}; 