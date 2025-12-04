'use client';

import { useState } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  Edit2,
} from 'lucide-react';

interface PortfolioData {
  name?: string;
  email?: string;
  location?: string;
  professionalTitle?: string;
  phone?: string;
  birthday?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  social?: {
    github?: string;
    twitter?: string;
    instagram?: string;
  };
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
  customElements?: Array<{
    id: string;
    type: string;
    props?: any;
    section?: string;
  }>;
}

interface PortfolioPreviewProps {
  data: PortfolioData;
  customElements?: Array<{
    id: string;
    type: string;
    props?: any;
    section?: string;
  }>;
  onDrop?: (e: React.DragEvent, sectionId: string) => void;
  onDragOver?: (e: React.DragEvent, sectionId: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  isCustomizing?: boolean;
  activeDropZone?: string | null;
  onEditElement?: (elementId: string) => void;
}

// Simple UI Components (replacing shadcn/ui)
function Button({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  asChild,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  asChild?: boolean;
  [key: string]: any;
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    default: 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90',
    outline: 'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10',
  };
  
  const Component = asChild ? 'span' : 'button';
  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

function Card({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>{children}</p>;
}

function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </span>
  );
}

function Avatar({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
}

function AvatarImage({ src, alt, className = '' }: { src?: string; alt?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} />
  );
}

function AvatarFallback({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}>{children}</div>;
}

export default function PortfolioPreview({ 
  data, 
  customElements = [],
  onDrop,
  onDragOver,
  onDragLeave,
  isCustomizing = false,
  activeDropZone = null,
  onEditElement
}: PortfolioPreviewProps) {
  const githubLink = (data.social?.github || data.githubUrl || '').trim();
  const linkedinLink = (data.linkedinUrl || '').trim();
  const twitterLink = (data.social?.twitter || '').trim();
  const instagramLink = (data.social?.instagram || '').trim();
  const avatarSrc = data.avatar;

  // Import renderCustomElement dynamically to avoid circular dependency
  const renderCustomElement = (element: { type: string; id: string; props?: any }) => {
    // Simple inline rendering for custom elements
    const { type, props = {} } = element;
    
    if (type === 'wizard') {
      return (
        <div className="w-full py-8 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {Array.from({ length: props.steps || 3 }).map((_, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === (props.currentStep || 1);
              const isCompleted = stepNum < (props.currentStep || 1);
              
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? 'bg-blue-600 dark:bg-blue-400 border-blue-600 dark:border-blue-400 text-white' 
                        : isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' 
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <span className="text-white text-sm">✓</span>
                      ) : (
                        <span className="text-sm font-semibold">{stepNum}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      isActive || isCompleted 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400'
                    }`}>
                      Step {stepNum}
                    </span>
                  </div>
                  {index < (props.steps || 3) - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      isCompleted 
                        ? 'bg-blue-600 dark:bg-blue-400' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (type === 'steps') {
      const items = props.items || ['Step 1', 'Step 2', 'Step 3'];
      return (
        <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <div className="space-y-4">
            {items.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (type === 'timeline') {
      const items = props.items || ['Event 1', 'Event 2', 'Event 3'];
      return (
        <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-6">
              {items.map((item: string, index: number) => (
                <div key={index} className="relative flex items-start gap-4">
                  <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-400 border-4 border-white dark:border-gray-950"></div>
                  <div className="flex-1 pt-1">
                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (type === 'stats') {
      const stats = props.stats || [
        { label: 'Projects', value: '50+' },
        { label: 'Clients', value: '30+' },
        { label: 'Experience', value: '5y' }
      ];
      return (
        <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat: { label: string; value: string }, index: number) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (type === 'achievements') {
      const items = props.items || ['Achievement 1', 'Achievement 2', 'Achievement 3'];
      return (
        <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <div className="space-y-3">
            {items.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🏆</span>
                <p className="text-base text-gray-900 dark:text-gray-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (type === 'progress') {
      const items = props.items || [
        { label: 'Skill 1', progress: 90 },
        { label: 'Skill 2', progress: 75 },
        { label: 'Skill 3', progress: 60 }
      ];
      return (
        <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <div className="space-y-4">
            {items.map((item: { label: string; progress: number }, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getCustomElementsForSection = (sectionId: string) => {
    return customElements.filter(el => el.section === sectionId);
  };

  return (
    <div className="min-h-full bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="container flex h-20 items-center justify-between max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight">{data.name || 'Portfolio'}</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#about" className="text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              About
            </a>
            <a href="#experience" className="text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Experience
            </a>
            <a href="#projects" className="text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Projects
            </a>
            <a href="#skills" className="text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Skills
            </a>
            <a href="#education" className="text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Education
            </a>
            <a href="#contact" className="text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="default" asChild className="hidden md:flex">
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-10 md:py-16 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section 
          id="hero"
          className={`py-16 md:py-20 lg:py-24 space-y-10 relative transition-all ${
            isCustomizing && activeDropZone === 'hero' 
              ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
              : ''
          }`}
          onDrop={isCustomizing ? (e) => onDrop?.(e, 'hero') : undefined}
          onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'hero') : undefined}
          onDragLeave={isCustomizing ? onDragLeave : undefined}
        >
          {isCustomizing && activeDropZone === 'hero' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
              </div>
            </div>
          )}
          {getCustomElementsForSection('hero').map((el) => (
            <div key={el.id} className="relative group">
              {isCustomizing && (
                <>
                  <button
                    onClick={() => onEditElement?.(el.id)}
                    className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                    title="Edit element"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                      }
                    }}
                    className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                    title="Remove element"
                  >
                    ×
                  </button>
                </>
              )}
              {renderCustomElement(el)}
            </div>
          ))}
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-2/3 space-y-7">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                Hi, I'm <span className="text-blue-600 dark:text-blue-400">{data.name || 'Your Name'}</span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-600 dark:text-gray-400">{data.professionalTitle || 'Professional'}</h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                {data.summary || 'A passionate professional with a drive to explore new technologies. I adapt quickly to new environments, allowing me to integrate seamlessly with diverse teams and projects.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
                  <a href="#contact">Get in Touch</a>
                </Button>
                <Button variant="outline" asChild className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <a href="#projects">View Projects</a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Avatar className="w-48 h-48 border-4 border-blue-600/20 dark:border-blue-400/20 shadow-lg transition-all duration-500 hover:border-blue-600/40 dark:hover:border-blue-400/40 hover:shadow-xl">
                {avatarSrc ? (
                  <AvatarImage src={avatarSrc} alt={data.name || 'Profile'} />
                ) : (
                  <AvatarFallback className="text-4xl">{(data.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-6">
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </a>
            )}
            {linkedinLink && (
              <a href={linkedinLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </a>
            )}
            {/* Email icon removed as requested */}
          </div>
        </section>

        {/* About Section */}
        <section 
          id="about" 
          className={`py-16 scroll-mt-20 relative transition-all ${
            isCustomizing && activeDropZone === 'about' 
              ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
              : ''
          }`}
          onDrop={isCustomizing ? (e) => onDrop?.(e, 'about') : undefined}
          onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'about') : undefined}
          onDragLeave={isCustomizing ? onDragLeave : undefined}
        >
          {isCustomizing && activeDropZone === 'about' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
              </div>
            </div>
          )}
          {getCustomElementsForSection('about').map((el) => (
            <div key={el.id} className="mb-6 relative group">
              {isCustomizing && (
                <>
                  <button
                    onClick={() => onEditElement?.(el.id)}
                    className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                    title="Edit element"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                      }
                    }}
                    className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                    title="Remove element"
                  >
                    ×
                  </button>
                </>
              )}
              {renderCustomElement(el)}
            </div>
          ))}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Me</h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <div className="w-full bg-white dark:bg-gray-950 rounded-xl p-8 md:p-10 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="space-y-7">
                <p className="text-2xl md:text-3xl font-semibold leading-relaxed">
                  I'm a passionate <span className="text-blue-600 dark:text-blue-400 font-bold">{data.professionalTitle || 'Professional'}</span> with specialized expertise in my field.
                </p>
                <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                  <p>{data.summary || 'Use the form on the left to add a short professional summary. This area will update in real time.'}</p>
                  {data.skills && data.skills.length > 0 && (
                    <div className="pt-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-4">What I'm good at</h3>
                      <div className="flex flex-wrap gap-3">
                        {data.skills.map((skill, index) => (
                          <Badge key={index} className="text-sm px-4 py-2">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md">
                    <a href="#projects" className="flex items-center gap-2">
                      <span>View My Work</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section 
            id="experience" 
            className={`py-16 scroll-mt-20 relative transition-all ${
              isCustomizing && activeDropZone === 'experience' 
                ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
                : ''
            }`}
            onDrop={isCustomizing ? (e) => onDrop?.(e, 'experience') : undefined}
            onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'experience') : undefined}
            onDragLeave={isCustomizing ? onDragLeave : undefined}
          >
            {isCustomizing && activeDropZone === 'experience' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
                </div>
              </div>
            )}
            {getCustomElementsForSection('experience').map((el) => (
              <div key={el.id} className="mb-6 relative group">
                {isCustomizing && (
                  <>
                    <button
                      onClick={() => onEditElement?.(el.id)}
                      className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                      title="Edit element"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                        }
                      }}
                      className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                      title="Remove element"
                    >
                      ×
                    </button>
                  </>
                )}
                {renderCustomElement(el)}
              </div>
            ))}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Work Experience</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="grid gap-6">
                {data.experience.map((exp, index) => (
                  <ExperienceCard
                    key={index}
                    title={exp.title || 'Role'}
                    company={exp.company}
                    period={exp.duration}
                    description={exp.description || ''}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section 
            id="projects" 
            className={`py-16 scroll-mt-20 relative transition-all ${
              isCustomizing && activeDropZone === 'projects' 
                ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
                : ''
            }`}
            onDrop={isCustomizing ? (e) => onDrop?.(e, 'projects') : undefined}
            onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'projects') : undefined}
            onDragLeave={isCustomizing ? onDragLeave : undefined}
          >
            {isCustomizing && activeDropZone === 'projects' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
                </div>
              </div>
            )}
            {getCustomElementsForSection('projects').map((el) => (
              <div key={el.id} className="mb-6 relative group">
                {isCustomizing && (
                  <>
                    <button
                      onClick={() => onEditElement?.(el.id)}
                      className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                      title="Edit element"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                        }
                      }}
                      className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                      title="Remove element"
                    >
                      ×
                    </button>
                  </>
                )}
                {renderCustomElement(el)}
              </div>
            ))}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Projects</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    title={project.title || 'Project'}
                    description={project.description || ''}
                    technologies={project.technologies ? project.technologies.split(',').map((t) => t.trim()) : []}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section 
            id="skills" 
            className={`py-16 scroll-mt-20 relative transition-all ${
              isCustomizing && activeDropZone === 'skills' 
                ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
                : ''
            }`}
            onDrop={isCustomizing ? (e) => onDrop?.(e, 'skills') : undefined}
            onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'skills') : undefined}
            onDragLeave={isCustomizing ? onDragLeave : undefined}
          >
            {isCustomizing && activeDropZone === 'skills' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
                </div>
              </div>
            )}
            {getCustomElementsForSection('skills').map((el) => (
              <div key={el.id} className="mb-6 relative group">
                {isCustomizing && (
                  <>
                    <button
                      onClick={() => onEditElement?.(el.id)}
                      className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                      title="Edit element"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                        }
                      }}
                      className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                      title="Remove element"
                    >
                      ×
                    </button>
                  </>
                )}
                {renderCustomElement(el)}
              </div>
            ))}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Technical Skills</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {data.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-5 py-4 text-center transition-all duration-300 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-md"
                    >
                      <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section 
            id="education" 
            className={`py-16 scroll-mt-20 relative transition-all ${
              isCustomizing && activeDropZone === 'education' 
                ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
                : ''
            }`}
            onDrop={isCustomizing ? (e) => onDrop?.(e, 'education') : undefined}
            onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'education') : undefined}
            onDragLeave={isCustomizing ? onDragLeave : undefined}
          >
            {isCustomizing && activeDropZone === 'education' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
                </div>
              </div>
            )}
            {getCustomElementsForSection('education').map((el) => (
              <div key={el.id} className="mb-6 relative group">
                {isCustomizing && (
                  <>
                    <button
                      onClick={() => onEditElement?.(el.id)}
                      className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                      title="Edit element"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                        }
                      }}
                      className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                      title="Remove element"
                    >
                      ×
                    </button>
                  </>
                )}
                {renderCustomElement(el)}
              </div>
            ))}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Education</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="grid gap-6">
                {data.education.map((edu, index) => (
                  <Card key={index} className="shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <CardTitle className="text-2xl md:text-3xl font-bold">{edu.institution || 'Institution'}</CardTitle>
                          <CardDescription className="text-lg md:text-xl font-semibold mt-2">{edu.degree || 'Degree'}</CardDescription>
                        </div>
                        {edu.year && <Badge className="w-fit mt-1 sm:mt-0 text-sm px-3 py-1.5">{edu.year}</Badge>}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section 
          id="contact" 
          className={`py-16 scroll-mt-20 relative transition-all ${
            isCustomizing && activeDropZone === 'contact' 
              ? 'ring-2 ring-blue-500 ring-dashed bg-blue-50/50 dark:bg-blue-950/20' 
              : ''
          }`}
          onDrop={isCustomizing ? (e) => onDrop?.(e, 'contact') : undefined}
          onDragOver={isCustomizing ? (e) => onDragOver?.(e, 'contact') : undefined}
          onDragLeave={isCustomizing ? onDragLeave : undefined}
        >
          {isCustomizing && activeDropZone === 'contact' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg px-8 py-4 backdrop-blur-sm">
                <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop element here</p>
              </div>
            </div>
          )}
          {getCustomElementsForSection('contact').map((el) => (
            <div key={el.id} className="mb-6 relative group">
              {isCustomizing && (
                <>
                  <button
                    onClick={() => onEditElement?.(el.id)}
                    className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 shadow-md"
                    title="Edit element"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('removeElement', { detail: { id: el.id } }));
                      }
                    }}
                    className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                    title="Remove element"
                  >
                    ×
                  </button>
                </>
              )}
              {renderCustomElement(el)}
            </div>
          ))}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Get In Touch</h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <Card className="shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1 w-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl md:text-4xl font-bold">Contact Information</CardTitle>
                <CardDescription className="text-lg md:text-xl mt-2">Feel free to reach out through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 pt-6">
                  {data.email && (
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" className="rounded-full text-blue-600 dark:text-blue-400 shrink-0 w-12 h-12">
                        <Mail className="h-6 w-6" />
                      </Button>
                      <div>
                        <p className="font-semibold text-lg md:text-xl">Email</p>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{data.email}</p>
                      </div>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" className="rounded-full text-blue-600 dark:text-blue-400 shrink-0 w-12 h-12">
                        <Phone className="h-6 w-6" />
                      </Button>
                      <div>
                        <p className="font-semibold text-lg md:text-xl">Phone</p>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{data.phone}</p>
                      </div>
                    </div>
                  )}
                  {data.location && (
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" className="rounded-full text-blue-600 dark:text-blue-400 shrink-0 w-12 h-12">
                        <MapPin className="h-6 w-6" />
                      </Button>
                      <div>
                        <p className="font-semibold text-lg md:text-xl">Location</p>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">{data.location}</p>
                      </div>
                    </div>
                  )}
                  {(githubLink || linkedinLink) && (
                    <div className="pt-6">
                      <p className="font-semibold text-lg md:text-xl mb-4">Social Profiles</p>
                      <div className="flex gap-3">
                        {githubLink && (
                          <a href={githubLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110">
                              <Github className="h-5 w-5" />
                              <span className="sr-only">GitHub</span>
                            </Button>
                          </a>
                        )}
                        {linkedinLink && (
                          <a href={linkedinLink} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110">
                              <Linkedin className="h-5 w-5" />
                              <span className="sr-only">LinkedIn</span>
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function ExperienceCard({ title, company, period, description }: { title: string; company: string; period: string; description: string }) {
  return (
    <Card className="shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-blue-600 dark:text-blue-400">{title}</span> at <span className="font-semibold">{company}</span>
            </CardTitle>
          </div>
          <Badge className="w-fit text-sm px-3 py-1.5">{period}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ title, description, technologies }: { title: string; description: string; technologies: string[] }) {
  return (
    <Card className="shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold">{title}</CardTitle>
        <CardDescription className="text-base md:text-lg mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-5">
            {technologies.map((tech, index) => (
              <Badge key={index} className="text-sm px-3 py-1.5">{tech}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

