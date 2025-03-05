import { Octokit } from '@octokit/rest';

class GitHubAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'GitHubAPIError';
    this.statusCode = statusCode;
  }
}

const octokit = new Octokit();

export const fetchGitHubData = async (username) => {
  if (!username || typeof username !== 'string') {
    throw new GitHubAPIError('Invalid username provided', 400);
  }

  try {
    const [userResponse, reposResponse] = await Promise.all([
      octokit.rest.users.getByUsername({ username }),
      octokit.rest.repos.listForUser({ 
        username, 
        sort: 'stars',
        per_page: 100 // Fetch more repos for better data
      })
    ]);

    // Validate responses
    if (!userResponse.data || !reposResponse.data) {
      throw new GitHubAPIError('Invalid response from GitHub API', 500);
    }

    const languages = new Set();
    reposResponse.data.forEach(repo => {
      if (repo.language) languages.add(repo.language);
    });

    return {
      profile: userResponse.data,
      repositories: reposResponse.data,
      languages: Array.from(languages),
      topRepo: reposResponse.data[0] || null,
    };
  } catch (error) {
    if (error.status === 404) {
      throw new GitHubAPIError('GitHub user not found', 404);
    }
    if (error.status === 403) {
      throw new GitHubAPIError('GitHub API rate limit exceeded', 403);
    }
    throw new GitHubAPIError(
      error.message || 'Failed to fetch GitHub data',
      error.status || 500
    );
  }
}; 