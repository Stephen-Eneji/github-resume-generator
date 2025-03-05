import React, { useState, useCallback } from 'react';
import useResumeStore from '../store/resumeStore';
import AboutSection from './resume/AboutSection';
import SkillsSection from './resume/SkillsSection';
import ProjectsSection from './resume/ProjectsSection';
import LanguagesChart from './resume/LanguagesChart';
import { generatePDF } from '../utils/pdfGenerator';
import { IoArrowBack } from "react-icons/io5";
import { FaEdit, FaDownload } from 'react-icons/fa';
import CertificationsSection from './resume/CertificationsSection';
import GoalsSection from './resume/GoalsSection';

const THEMES = {
  classic: 'bg-white',
  modern: 'bg-gray-50',
  minimal: 'bg-white border-l-4 border-blue-600',
  professional: 'bg-white shadow-lg'
};

export default function ResumeBuilder() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const githubData = useResumeStore(state => state.githubData);
  const setGitHubData = useResumeStore(state => state.setGitHubData);

  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      await generatePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Could add a toast notification here
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleBack = useCallback(() => {
    if (window.confirm('Are you sure you want to go back? Your changes will be lost.')) {
      setGitHubData(null);
    }
  }, [setGitHubData]);

  const handleThemeChange = useCallback((e) => {
    setSelectedTheme(e.target.value);
  }, []);

  if (!githubData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Floating Action Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <IoArrowBack className="mr-2" />
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTheme}
              onChange={handleThemeChange}
              className="text-sm border rounded-md px-2 py-1"
            >
              <option value="classic">Classic Theme</option>
              <option value="modern">Modern Theme</option>
              <option value="minimal">Minimal Theme</option>
              <option value="professional">Professional Theme</option>
            </select>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <FaEdit className="mr-2" />
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            
            <button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload className="mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div id="resume" className={`${THEMES[selectedTheme]} rounded-lg overflow-hidden`}>
          <div className="p-8 space-y-8">
            <AboutSection isEditing={isEditing} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <LanguagesChart />
                <SkillsSection isEditing={isEditing} />
              </div>

              <div className="lg:col-span-2 space-y-8">
                <ProjectsSection isEditing={isEditing} />
                <CertificationsSection isEditing={isEditing} />
                <GoalsSection isEditing={isEditing} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 