import React, { useState, useEffect } from 'react';
import useResumeStore from '../../store/resumeStore';
import { FaPlus, FaTrash, FaLink } from 'react-icons/fa';

const SKILL_CATEGORIES = {
  languages: 'Programming Languages',
  tools: 'Tools & Technologies',
  databases: 'Databases',
  cloud: 'Cloud Services',
  other: 'Other Skills'
};

const CERTIFICATIONS_TEMPLATE = {
  name: '',
  issuer: '',
  date: '',
  url: ''
};

const PUBLICATION_TEMPLATE = {
  title: '',
  url: '',
  date: '',
  description: '',
  type: 'publication' // or 'blog'
};

export default function SkillsSection({ isEditing }) {
  const githubData = useResumeStore(state => state.githubData);
  const [showTools, setShowTools] = useState(true);
  const [showContributions, setShowContributions] = useState(true);
  const [skillsByCategory, setSkillsByCategory] = useState({
    languages: [],
    tools: [],
    databases: [],
    cloud: [],
    other: []
  });
  const [certifications, setCertifications] = useState([]);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    if (githubData) {
      setSkillsByCategory(prev => ({
        ...prev,
        languages: Array.from(new Set(
          githubData.repositories
            .map(repo => repo.language)
            .filter(Boolean)
        ))
      }));
    }
  }, [githubData]);

  // Get top contributions from GitHub data
  const getTopContributions = () => {
    if (!githubData) return [];
    return githubData.repositories
      .filter(repo => !repo.fork && repo.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 2)  // Limit to 2 projects
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        technologies: repo.language || 'Not specified',
        stars: repo.stargazers_count,
        url: repo.html_url
      }));
  };

  const handleAddSkill = (category) => {
    setSkillsByCategory(prev => ({
      ...prev,
      [category]: [...prev[category], '']
    }));
  };

  const handleSkillChange = (category, index, value) => {
    setSkillsByCategory(prev => ({
      ...prev,
      [category]: prev[category].map((skill, i) => 
        i === index ? value : skill
      )
    }));
  };

  const handleRemoveSkill = (category, index) => {
    setSkillsByCategory(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    setCertifications(prev => [...prev, { ...CERTIFICATIONS_TEMPLATE }]);
  };

  const handleAddPublication = (type = 'publication') => {
    setPublications(prev => [...prev, { ...PUBLICATION_TEMPLATE, type }]);
  };

  return (
    <div className="space-y-8">
      {/* Technical Skills */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Technical Skills</h3>
        {Object.entries(SKILL_CATEGORIES).map(([category, title]) => {
          if (category === 'tools' && !showTools && !isEditing) return null;

          return (
            <div key={category} className="space-y-2">
              {(category === 'tools' && isEditing) && (
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showTools}
                      onChange={(e) => setShowTools(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Show Tools & Technologies section</span>
                  </label>
                </div>
              )}
              
              {(category !== 'tools' || showTools) && (
                <>
                  <h4 className="text-lg font-medium text-gray-700">{title}</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      {skillsByCategory[category].map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleSkillChange(category, index, e.target.value)}
                            className="flex-1 p-2 border rounded-md"
                            placeholder={`Enter ${title.toLowerCase()}...`}
                          />
                          <button
                            onClick={() => handleRemoveSkill(category, index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddSkill(category)}
                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <FaPlus /> <span>Add {title}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skillsByCategory[category].map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </section>

      {/* Publications & Blog Posts */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Publications & Blog Posts</h3>
        {isEditing ? (
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <select
                    value={pub.type}
                    onChange={(e) => {
                      const newPubs = [...publications];
                      newPubs[index] = { ...pub, type: e.target.value };
                      setPublications(newPubs);
                    }}
                    className="p-2 border rounded-md"
                  >
                    <option value="publication">Publication</option>
                    <option value="blog">Blog Post</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={pub.title}
                  onChange={(e) => {
                    const newPubs = [...publications];
                    newPubs[index] = { ...pub, title: e.target.value };
                    setPublications(newPubs);
                  }}
                  className="w-full p-2 border rounded-md"
                  placeholder="Title"
                />
                <input
                  type="url"
                  value={pub.url}
                  onChange={(e) => {
                    const newPubs = [...publications];
                    newPubs[index] = { ...pub, url: e.target.value };
                    setPublications(newPubs);
                  }}
                  className="w-full p-2 border rounded-md"
                  placeholder="URL"
                />
                <textarea
                  value={pub.description}
                  onChange={(e) => {
                    const newPubs = [...publications];
                    newPubs[index] = { ...pub, description: e.target.value };
                    setPublications(newPubs);
                  }}
                  className="w-full p-2 border rounded-md"
                  placeholder="Description"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <input
                    type="date"
                    value={pub.date}
                    onChange={(e) => {
                      const newPubs = [...publications];
                      newPubs[index] = { ...pub, date: e.target.value };
                      setPublications(newPubs);
                    }}
                    className="p-2 border rounded-md"
                  />
                  <button
                    onClick={() => {
                      setPublications(pubs => 
                        pubs.filter((_, i) => i !== index)
                      );
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex space-x-4">
              <button
                onClick={() => handleAddPublication('publication')}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
              >
                <FaPlus /> <span>Add Publication</span>
              </button>
              <button
                onClick={() => handleAddPublication('blog')}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
              >
                <FaLink /> <span>Add Blog Post</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                    {pub.type === 'blog' ? 'Blog Post' : 'Publication'}
                  </span>
                </div>
                <h4 className="font-medium mt-2">{pub.title}</h4>
                <p className="text-sm text-gray-500">{pub.date}</p>
                <p className="text-gray-600 mt-2">{pub.description}</p>
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-flex items-center space-x-1"
                  >
                    <FaLink className="text-xs" />
                    <span>View {pub.type === 'blog' ? 'Blog Post' : 'Publication'}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Optional Open Source Contributions */}
      {isEditing && (
        <div className="flex items-center space-x-2 mb-4">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showContributions}
              onChange={(e) => setShowContributions(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Open Source Contributions</span>
          </label>
        </div>
      )}

      {showContributions && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Open Source Contributions</h3>
          <div className="space-y-4">
            {getTopContributions().map((contrib, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg">{contrib.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Technologies: {contrib.technologies}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-4">⭐ {contrib.stars}</span>
                    <a
                      href={contrib.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      View Repository
                    </a>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{contrib.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 