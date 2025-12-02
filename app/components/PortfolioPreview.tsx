
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  BookOpen,
  ExternalLink,
  Eye,
  Phone,
  Calendar,
  Github,
  Twitter,
  Instagram,
  Linkedin,
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
}

interface PortfolioPreviewProps {
  data: PortfolioData;
}

type Section = 'about' | 'resume' | 'portfolio' | 'contact';

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const [activeSection, setActiveSection] = useState<Section>('about');

  return (
    <div className="min-h-full bg-white dark:bg-[#121212] text-black dark:text-white p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          <ProfileSidebar data={data} />
          <main className="flex-1 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-[#333333] overflow-hidden">
            {/* Tabs */}
            <nav className="flex gap-2 sm:gap-3 md:gap-5 p-4 sm:p-5 md:p-6 border-b border-[#E5E7EB] dark:border-[#333333] overflow-x-auto scrollbar-hide">
              {['about', 'resume', 'portfolio', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section as Section)}
                  className={`px-4 sm:px-5 py-2.5 rounded-lg text-sm sm:text-base font-medium capitalize transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeSection === section
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-[#60646C] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#1F1F1F]'
                  }`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {section}
                </button>
              ))}
            </nav>

            <div className="p-5 sm:p-6 md:p-8 lg:p-10">
              {activeSection === 'about' && <AboutSection data={data} />}
              {activeSection === 'resume' && <ResumeSection data={data} />}
              {activeSection === 'portfolio' && <PortfolioSection data={data} />}
              {activeSection === 'contact' && <ContactSection data={data} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* Sidebar */

function ProfileSidebar({ data }: { data: PortfolioData }) {
  const avatarSrc = data.avatar || '/placeholder.svg';
  const githubLink = (data.social?.github || data.githubUrl || '').trim();
  const linkedinLink = (data.linkedinUrl || '').trim();
  const twitterLink = (data.social?.twitter || '').trim();
  const instagramLink = (data.social?.instagram || '').trim();

  const hasSocial =
    githubLink !== '' || linkedinLink !== '' || twitterLink !== '' || instagramLink !== '';

  return (
    <aside className="w-full lg:w-96 xl:w-[420px] bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E5E7EB] dark:border-[#333333] p-5 md:p-7 h-fit flex-shrink-0">
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 md:mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C9EAE6] via-[#EAF9FA] to-transparent dark:from-[#1E3A39] dark:via-[#111827] animate-pulse-slow" />
          <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-[#111827] overflow-hidden flex items-center justify-center">
            {/* Avatar image or fallback initial */}
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={data.name || 'Profile avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-black dark:text-white">
                {(data.name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <h1
          className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-center"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {data.name || 'Your Name'}
        </h1>
        {data.professionalTitle && (
          <p className="text-sm md:text-base text-[#60646C] dark:text-[#A0A0A0] bg-[#F3F4F6] dark:bg-[#1F2933] px-4 py-1.5 rounded-lg">
            {data.professionalTitle}
          </p>
        )}
      </div>

      <div className="h-px bg-[#E5E7EB] dark:bg-[#333333] my-4 md:my-5" />

      {/* Contact details */}
      <div className="space-y-4 text-sm md:text-base">
        {data.email && (
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email">
            <a href={`mailto:${data.email}`} className="hover:underline">
              {data.email}
            </a>
          </InfoRow>
        )}
        {data.phone && (
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone">
            <a href={`tel:${data.phone.replace(/\s/g, '')}`} className="hover:underline">
              {data.phone}
            </a>
          </InfoRow>
        )}
        {data.birthday && (
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Birthday">
            <span>{data.birthday}</span>
          </InfoRow>
        )}
        {data.location && (
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location">
            {data.location}
          </InfoRow>
        )}
      </div>

      {/* Social links */}
      {hasSocial && (
        <>
          <div className="h-px bg-[#E5E7EB] dark:bg-[#333333] my-4 md:my-5" />
          <div className="flex items-center justify-center gap-4">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#1F2933] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#1F2933] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {twitterLink && (
              <a
                href={twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#1F2933] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {instagramLink && (
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#1F2933] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] dark:bg-[#1F2933] flex items-center justify-center flex-shrink-0 text-[#111827] dark:text-[#E5E5E5]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] md:text-xs text-[#9CA3AF] dark:text-[#6B7280] uppercase mb-1">{label}</p>
        <div className="text-sm md:text-base text-[#111827] dark:text-[#E5E5E5] truncate">
          {children}
        </div>
      </div>
    </div>
  );
}

/* Sections */

function AboutSection({ data }: { data: PortfolioData }) {
  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          About Me
        </h2>
        <div className="w-10 h-1 bg-[#C9EAE6] dark:bg-[#1E3A39] rounded-full mb-4" />
        <p className="text-base md:text-lg text-[#60646C] dark:text-[#A0A0A0] leading-relaxed">
          {data.summary ||
            'Use the form on the left to add a short professional summary. This area will update in real time.'}
        </p>
      </div>
      {data.skills && data.skills.length > 0 && (
        <div>
          <h3
            className="text-base md:text-lg font-semibold text-black dark:text-white mb-3"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            What I’m good at
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 rounded-lg bg-[#F3F4F6] dark:bg-[#1F2933] text-sm md:text-base text-[#111827] dark:text-[#E5E5E5]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResumeSection({ data }: { data: PortfolioData }) {
  const experience = data.experience ?? [];
  const education = data.education ?? [];

  return (
    <div className="space-y-10">
      {education.length > 0 && (
        <section>
          <div className="flex items-center gap-2 md:gap-3 mb-4">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#1E3A39]" />
            <h2
              className="text-2xl md:text-3xl font-bold text-black dark:text-white"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Education
            </h2>
          </div>
          <div className="w-10 h-1 bg-[#C9EAE6] dark:bg-[#1E3A39] rounded-full mb-4" />
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="relative pl-5 md:pl-6 pb-4 border-l-2 border-[#E5E7EB] dark:border-[#333333] last:pb-0"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#C9EAE6] dark:bg-[#1E3A39]" />
                <h4
                  className="text-base md:text-lg font-semibold text-black dark:text-white mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {edu.degree || 'Degree'}
                </h4>
                {edu.year && (
                  <p className="text-sm md:text-base text-[#1E3A39] dark:text-[#C9EAE6] mb-1">
                    {edu.year}
                  </p>
                )}
                <p className="text-sm md:text-base text-[#60646C] dark:text-[#A0A0A0] leading-relaxed">
                  {edu.institution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <div className="flex items-center gap-2 md:gap-3 mb-4">
            <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-[#1E3A39]" />
            <h3
              className="text-2xl md:text-3xl font-bold text-black dark:text-white"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Experience
            </h3>
          </div>
          <div className="w-10 h-1 bg-[#C9EAE6] dark:bg-[#1E3A39] rounded-full mb-4" />
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-5 md:pl-6 pb-4 border-l-2 border-[#E5E7EB] dark:border-[#333333] last:pb-0"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1E3A39]" />
                <h4
                  className="text-base md:text-lg font-semibold text-black dark:text-white mb-1"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {exp.title || 'Role'}
                </h4>
                {exp.duration && (
                  <p className="text-sm md:text-base text-[#1E3A39] dark:text-[#C9EAE6] mb-1">
                    {exp.duration}
                  </p>
                )}
                <p className="text-sm md:text-base text-[#60646C] dark:text-[#A0A0A0] leading-relaxed">
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="mt-1 text-sm md:text-base text-[#60646C] dark:text-[#A0A0A0] leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical skills grid */}
      <SkillsSection skills={data.skills} />
    </div>
  );
}

function PortfolioSection({ data }: { data: PortfolioData }) {
  return (
    <div className="space-y-5">
      <h2
        className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Portfolio
      </h2>
      <div className="w-10 h-1 bg-[#C9EAE6] dark:bg-[#1E3A39] rounded-full mb-4" />
      <p className="text-base md:text-lg text-[#60646C] dark:text-[#A0A0A0] mb-4">
        These sample projects show how your real work could be presented on your final portfolio
        website.
      </p>
      <ProjectsSection />
    </div>
  );
}

function ContactSection({ data }: { data: PortfolioData }) {
  return (
    <div className="space-y-5">
      <h2
        className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Contact
      </h2>
      <div className="w-10 h-1 bg-[#C9EAE6] dark:bg-[#1E3A39] rounded-full mb-4" />
      <p className="text-base md:text-lg text-[#60646C] dark:text-[#A0A0A0] mb-3">
        This is how people will reach you from your portfolio.
      </p>
      <div className="space-y-2 text-base md:text-lg">
        {data.email && (
          <p>
            <span className="font-medium">Email:</span>{' '}
            <a href={`mailto:${data.email}`} className="text-[#111827] dark:text-white underline">
              {data.email}
            </a>
          </p>
        )}
        {data.location && (
          <p>
            <span className="font-medium">Location:</span> {data.location}
          </p>
        )}
      </div>
    </div>
  );
}

/* Extra sections based on provided templates */

function SkillsSection({ skills }: { skills?: string[] }) {
  const fallbackSkills = {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS', 'JavaScript'],
    backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
    tools: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD', 'Testing'],
  };

  const hasDynamic = skills && skills.length > 0;
  const allSkills = hasDynamic ? skills! : [...fallbackSkills.frontend, ...fallbackSkills.backend, ...fallbackSkills.tools];
  const perCol = Math.ceil(allSkills.length / 3) || 1;
  const col1 = allSkills.slice(0, perCol);
  const col2 = allSkills.slice(perCol, perCol * 2);
  const col3 = allSkills.slice(perCol * 2);

  return (
    <section className="mt-8 rounded-2xl border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#1A1A1A] p-6 md:p-7">
      <h2
        className="mb-5 text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Technical Skills
      </h2>
      <div className="grid gap-6 md:grid-cols-3 text-sm md:text-base">
        <SkillColumn title="Frontend Development" items={col1} />
        <SkillColumn title="Backend Development" items={col2} />
        <SkillColumn title="Tools & Technologies" items={col3} />
      </div>
    </section>
  );
}

function SkillColumn({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="mb-3 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#9CA3AF] dark:text-[#6B7280]">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((skill) => (
          <li key={skill} className="text-sm md:text-base text-[#111827] dark:text-[#E5E5E5]">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

const demoProjects = [
  {
    title: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce solution with payments, inventory management, and an admin dashboard.',
    tags: ['Next.js', 'PostgreSQL', 'Stripe', 'Tailwind'],
    image: '/modern-ecommerce-dashboard.png',
  },
  {
    title: 'Task Management App',
    description:
      'Collaborative task management tool with real-time updates, team workspaces, and progress tracking.',
    tags: ['React', 'Node.js', 'MongoDB', 'WebSocket'],
    image: '/task-management-interface.png',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Data visualization dashboard with interactive charts, KPIs, and exportable reports.',
    tags: ['TypeScript', 'Express', 'Chart.js', 'PostgreSQL'],
    image: '/analytics-dashboard-charts.png',
  },
  {
    title: 'Social Media API',
    description:
      'RESTful API for social networking with authentication, posts, and real-time notifications.',
    tags: ['Node.js', 'Express', 'JWT', 'Redis'],
    image: '/api-documentation-interface.png',
  },
  {
    title: 'Blog Platform',
    description:
      'Content platform with markdown support, SEO optimizations, and comment moderation tools.',
    tags: ['Next.js', 'MDX', 'Supabase', 'TypeScript'],
    image: '/modern-blog-interface.jpg',
  },
  {
    title: 'Weather Forecast App',
    description:
      'Real-time weather app with geolocation, interactive maps, and 7-day forecasts.',
    tags: ['React', 'OpenWeather API', 'Mapbox', 'Tailwind'],
    image: '/weather-app-interface.png',
  },
];

function ProjectsSection() {
  return (
    <section className="mt-2">
      <div className="grid gap-4 md:grid-cols-2">
        {demoProjects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
}

function ProjectCard({ title, description, tags, image }: ProjectCardProps) {
  return (
    <article className="group cursor-pointer bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E7EB] dark:border-[#333333] overflow-hidden hover:border-[#C9EAE6] dark:hover:border-[#1E3A39] transition-all duration-300">
      <div className="mb-3 overflow-hidden bg-[#F3F4F6] dark:bg-[#111827]">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          width={600}
          height={400}
          className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-4 pb-4">
        <h3
          className="mb-2 text-sm md:text-base font-semibold tracking-tight text-black dark:text-white group-hover:text-[#374151] dark:group-hover:text-[#D1D5DB] transition-colors"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          {title}
        </h3>
        <p className="mb-3 text-xs md:text-sm text-[#60646C] dark:text-[#A0A0A0] leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] dark:border-[#333333] bg-[#F9FAFB] dark:bg-[#111827] px-2 py-0.5 text-[10px] text-[#4B5563] dark:text-[#D1D5DB]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9EAE6] dark:bg-[#1E3A39]" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
