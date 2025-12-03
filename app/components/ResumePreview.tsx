'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';

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
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string;
  }>;
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
  const skipNextUpdateRef = useRef(false);
  const dataStringRef = useRef<string>(JSON.stringify(data));

  // Update formData when data prop changes (only if actually different)
  useEffect(() => {
    const currentDataString = JSON.stringify(data);
    if (currentDataString !== dataStringRef.current) {
      skipNextUpdateRef.current = true;
      setFormData(data);
      dataStringRef.current = currentDataString;
    }
  }, [data]);

  // Notify parent of data changes (skip if update came from parent)
  useEffect(() => {
    if (skipNextUpdateRef.current) {
      skipNextUpdateRef.current = false;
      return;
    }
    
    if (onDataChange) {
      const currentFormDataString = JSON.stringify(formData);
      if (currentFormDataString !== dataStringRef.current) {
        onDataChange(formData);
        dataStringRef.current = currentFormDataString;
      }
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

  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const projects = [...(prev.projects || [])];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { title: '', company: '', duration: '', description: '' }],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => {
      const experiences = [...(prev.experience || [])];
      experiences.splice(index, 1);
      return { ...prev, experience: experiences.length > 0 ? experiences : undefined };
    });
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), { title: '', description: '', technologies: '' }],
    }));
  };

  const removeProject = (index: number) => {
    setFormData((prev) => {
      const projects = [...(prev.projects || [])];
      projects.splice(index, 1);
      return { ...prev, projects: projects.length > 0 ? projects : undefined };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', institution: '', year: '' }],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => {
      const education = [...(prev.education || [])];
      education.splice(index, 1);
      return { ...prev, education: education.length > 0 ? education : undefined };
    });
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ''],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => {
      const skills = [...(prev.skills || [])];
      skills.splice(index, 1);
      return { ...prev, skills: skills.length > 0 ? skills : undefined };
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
      <CollapsibleSection title="Summary" icon="📄" defaultOpen={!!formData.summary}>
        <textarea
          value={formData.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          placeholder="Enter professional summary"
        />
      </CollapsibleSection>

      {/* Experience Section */}
      <CollapsibleSection title="Experience" icon="💼" defaultOpen={!!(formData.experience && formData.experience.length > 0)}>
        <div className="space-y-3">
          {formData.experience && formData.experience.length > 0 && formData.experience.map((exp, index) => (
            <div key={index} className="space-y-2 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 relative">
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Remove this experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
          <button
            type="button"
            onClick={addExperience}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Experience</span>
          </button>
        </div>
      </CollapsibleSection>

      {/* Projects Section */}
      <CollapsibleSection title="Projects" icon="📁" defaultOpen={!!(formData.projects && formData.projects.length > 0)}>
        <div className="space-y-3">
          {formData.projects && formData.projects.length > 0 && formData.projects.map((project, index) => (
            <div
              key={index}
              className="space-y-2 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 relative"
            >
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Remove this project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                className="w-full px-3 py-2 font-semibold border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Project Title"
              />
              <input
                type="text"
                value={project.technologies || ''}
                onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Technologies (e.g., React, Node.js, PostgreSQL)"
              />
              <textarea
                value={project.description || ''}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                placeholder="Short project description"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Project</span>
          </button>
        </div>
      </CollapsibleSection>

      {/* Skills Section */}
      <CollapsibleSection title="Skills" icon="⚡" defaultOpen={!!(formData.skills && formData.skills.length > 0)}>
        <div className="flex flex-wrap gap-2">
          {formData.skills && formData.skills.length > 0 && formData.skills.map((skill, index) => (
            <div key={index} className="relative group">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillsChange(index, e.target.value)}
                className="px-4 py-2 pr-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Skill name"
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                title="Remove skill"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSkill}
          className="mt-3 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add New Skill</span>
        </button>
      </CollapsibleSection>

      {/* Education Section */}
      <CollapsibleSection title="Education" icon="🎓" defaultOpen={!!(formData.education && formData.education.length > 0)}>
        <div className="space-y-3">
          {formData.education && formData.education.length > 0 && formData.education.map((edu, index) => (
            <div key={index} className="space-y-2 p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 relative">
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Remove this education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
          <button
            type="button"
            onClick={addEducation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Education</span>
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}
