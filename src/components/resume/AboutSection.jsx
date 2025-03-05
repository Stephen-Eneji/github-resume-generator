import React, { useState, useEffect } from 'react';
import useResumeStore from '../../store/resumeStore';
import { 
  FaEdit, 
  FaSave, 
  FaGithub, 
  FaEnvelope, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaTwitter, 
  FaLinkedin,
  FaLink,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

export default function AboutSection({ isEditing }) {
  const githubData = useResumeStore(state => state.githubData);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    email: '',
    website: '',
    twitter: '',
    linkedin: '',
    company: '',
    additionalLinks: []
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  useEffect(() => {
    if (githubData?.profile) {
      const { profile } = githubData;
      // Extract username from GitHub URL
      const twitterUsername = profile.twitter_username;
      
      setProfileData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        email: profile.email || '',
        website: profile.blog || '',
        twitter: twitterUsername ? `https://twitter.com/${twitterUsername}` : '',
        linkedin: '', // Initialize empty, user can add
        company: profile.company || '',
        additionalLinks: []
      });
    }
  }, [githubData]);

  const handleSaveProfile = () => {
    setIsEditingBio(false);
    setIsEditingLinks(false);
    // Here you would typically update the store or make an API call
  };

  const handleAddLink = () => {
    setProfileData(prev => ({
      ...prev,
      additionalLinks: [...prev.additionalLinks, { id: Date.now(), title: '', url: '' }]
    }));
  };

  const handleRemoveLink = (id) => {
    setProfileData(prev => ({
      ...prev,
      additionalLinks: prev.additionalLinks.filter(link => link.id !== id)
    }));
  };

  if (!githubData) return null;

  const { profile } = githubData;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start space-x-6">
          <div className="relative group">
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            {profile.hireable && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-3xl font-bold w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Your Name"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{profileData.name || profile.login}</h2>
                )}
                <div className="flex items-center text-gray-600 space-x-2">
                  <FaGithub className="text-gray-400" />
                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {profile.login}
                  </a>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <FaSave className="text-xl" />
                </button>
              )}
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isEditing ? (
                <>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Location"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaGlobe className="text-gray-400" />
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Website"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaLinkedin className="text-gray-400" />
                    <input
                      type="url"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </>
              ) : (
                <>
                  {profileData.location && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.email && (
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-gray-400" />
                      <a href={`mailto:${profileData.email}`} className="text-blue-600 hover:text-blue-800">
                        {profileData.email}
                      </a>
                    </div>
                  )}
                  {profileData.website && (
                    <div className="flex items-center space-x-2">
                      <FaGlobe className="text-gray-400" />
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {profileData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {profileData.linkedin && (
                    <div className="flex items-center space-x-2">
                      <FaLinkedin className="text-gray-400" />
                      <a
                        href={profileData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bio Section */}
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:border-blue-500 focus:outline-none min-h-[100px]"
                placeholder="Write a brief bio..."
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="text-2xl font-bold text-gray-900">{profile.public_repos}</div>
            <div className="text-sm text-gray-500">Repositories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="text-2xl font-bold text-gray-900">{profile.followers}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="text-2xl font-bold text-gray-900">{profile.following}</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>

        {/* Additional Links Section */}
        {isEditing && (
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">Additional Links</h3>
              <button
                onClick={handleAddLink}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaPlus />
              </button>
            </div>
            <div className="space-y-2">
              {profileData.additionalLinks.map(link => (
                <div key={link.id} className="flex items-center space-x-2">
                  <FaLink className="text-gray-400" />
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => {
                      const newLinks = profileData.additionalLinks.map(l =>
                        l.id === link.id ? { ...l, title: e.target.value } : l
                      );
                      setProfileData(prev => ({ ...prev, additionalLinks: newLinks }));
                    }}
                    placeholder="Link Title"
                    className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = profileData.additionalLinks.map(l =>
                        l.id === link.id ? { ...l, url: e.target.value } : l
                      );
                      setProfileData(prev => ({ ...prev, additionalLinks: newLinks }));
                    }}
                    placeholder="URL"
                    className="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 