'use client';

import { useState } from 'react';

interface ResumeData {
  name?: string;
  email?: string;
  location?: string;
  professionalTitle?: string;
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills?: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
  images: string[];
}

export default function ResumePreview({ data, images }: ResumePreviewProps) {
  const [formData, setFormData] = useState<ResumeData>(data);

  const handleChange = (field: keyof ResumeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const experiences = [...(prev.experience || [])];
      experiences[index] = { ...experiences[index], [field]: value };
      return { ...prev, experience: experiences };
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const education = [...(prev.education || [])];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education: education };
    });
  };

  const handleSkillsChange = (index: number, value: string) => {
    setFormData((prev) => {
      const skills = [...(prev.skills || [])];
      skills[index] = value;
      return { ...prev, skills };
    });
  };

  const handleGeneratePortfolio = () => {
    try {
      // Store data in localStorage as backup
      localStorage.setItem('portfolioData', JSON.stringify(formData));
      
      // Try to encode the data
      const jsonString = JSON.stringify(formData);
      const dataString = encodeURIComponent(jsonString);
      
      // Navigate to portfolio page
      window.location.href = `/portfolio?data=${dataString}`;
    } catch (error) {
      console.error('Error generating portfolio:', error);
      // Fallback: just navigate and use localStorage
      window.location.href = '/portfolio';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">
        Portfolio Preview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Resume Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">
            Original Resume
          </h3>
          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800"
              >
                <img
                  src={img}
                  alt={`Resume page ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Extracted Portfolio Data - Editable Form */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
              Extracted Portfolio Data
            </h3>
            <button
              onClick={handleGeneratePortfolio}
              className="px-6 py-2 bg-black dark:bg-zinc-50 text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Generate Portfolio
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basics Section */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-zinc-50">Basics</h3>
                  <span className="text-green-500">✓</span>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Professional Title */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.professionalTitle || formData.summary?.split('.')[0] || ''}
                    onChange={(e) => handleChange('professionalTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    placeholder="Enter professional title"
                  />
                </div>

                {/* Contact Information - Two Columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  {/* Phone - hidden for portfolio */}
                  <div className="hidden">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>

                {/* Add Custom Field */}
                <button className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg py-3 px-4 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add a custom field
                </button>
              </div>
            </div>

            {/* Summary Section */}
            {formData.summary && (
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50">Summary</h3>
                    <span className="text-green-500">✓</span>
                  </div>
                </div>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 resize-none"
                  placeholder="Enter professional summary"
                />
              </div>
            )}

            {/* Experience Section */}
            {formData.experience && formData.experience.length > 0 && (
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">💼</span>
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50">Experience</h3>
                    <span className="text-green-500">✓</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="space-y-3 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                      <input
                        type="text"
                        value={exp.title || ''}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 font-semibold border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                        placeholder="Job Title"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={exp.duration || ''}
                          onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                          placeholder="Duration"
                        />
                      </div>
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 resize-none"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {formData.education && formData.education.length > 0 && (
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">🎓</span>
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50">Education</h3>
                    <span className="text-green-500">✓</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="space-y-3 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 font-semibold border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                        placeholder="Degree"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                          placeholder="Institution"
                        />
                        <input
                          type="text"
                          value={edu.year || ''}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                          placeholder="Year"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {formData.skills && formData.skills.length > 0 && (
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <span className="text-xl">⚡</span>
                    </div>
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50">Skills</h3>
                    <span className="text-green-500">✓</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <input
                      key={index}
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillsChange(index, e.target.value)}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

