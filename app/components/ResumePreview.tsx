'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ResumeData {
  name?: string;
  email?: string;
  location?: string;
  professionalTitle?: string;
    githubUrl?: string;
    linkedinUrl?: string;
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
  onDataChange?: (data: ResumeData) => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-zinc-50 dark:bg-zinc-900/60"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
            {icon}
          </div>
          <span className="text-base font-semibold text-black dark:text-zinc-50">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-zinc-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <div className="px-4 py-4 space-y-4">{children}</div>}
    </div>
  );
}

export default function ResumePreview({ data, onDataChange }: ResumePreviewProps) {
  const [formData, setFormData] = useState<ResumeData>(data);

  // Update formData when data prop changes
  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

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

  return (
    <div className="space-y-4">
      {/* Basics Section */}
      <CollapsibleSection title="Personal Information" icon="👤" defaultOpen>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              value={formData.professionalTitle || ''}
              onChange={(e) => handleChange('professionalTitle', e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="City, State/Country"
              />
            </div>
          </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    placeholder="https://github.com/username"
                  />
                </div>
                {/* LinkedIn URL */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
        </div>
      </CollapsibleSection>

      {/* Summary Section */}
      {formData.summary && (
        <CollapsibleSection title="Summary" icon="📄">
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            placeholder="Enter professional summary"
          />
        </CollapsibleSection>
      )}

      {/* Experience Section */}
      {formData.experience && formData.experience.length > 0 && (
        <CollapsibleSection title="Experience" icon="💼">
          <div className="space-y-3">
            {formData.experience.map((exp, index) => (
              <div key={index} className="space-y-2 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 font-semibold border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Job Title"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={exp.duration || ''}
                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Duration"
                  />
                </div>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Education Section */}
      {formData.education && formData.education.length > 0 && (
        <CollapsibleSection title="Education" icon="🎓">
          <div className="space-y-3">
            {formData.education.map((edu, index) => (
              <div key={index} className="space-y-2 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 font-semibold border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Degree"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Institution"
                  />
                  <input
                    type="text"
                    value={edu.year || ''}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Year"
                  />
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Skills Section */}
      {formData.skills && formData.skills.length > 0 && (
        <CollapsibleSection title="Skills" icon="⚡">
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleSkillsChange(index, e.target.value)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
