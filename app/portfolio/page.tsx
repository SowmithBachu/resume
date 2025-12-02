'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Mail, Loader } from 'lucide-react';

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

function MinimalCyberpunk({ data }: { data: ResumeData }) {
  const experiences = data.experience ?? [];
  const education = data.education ?? [];
  const skills = data.skills ?? [];

  return (
    <div className="min-h-screen bg-[#05070b] text-white relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,255,255,0.08) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      <header className="sticky top-0 z-20 border-b border-cyan-500/30 bg-[#05070b]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {data.email ? (
            <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-sm text-cyan-300">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
                <Mail size={16} />
              </span>
              {data.email}
            </a>
          ) : (
            <div />
          )}
          <a
            href="/?edit=true"
            className="rounded-lg border border-cyan-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-200 hover:bg-cyan-500/10"
          >
            Edit Portfolio
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 lg:flex-row">
        <section className="w-full space-y-6 lg:w-1/2">
          <div className="rounded-2xl border border-cyan-500/40 bg-black/40 p-8">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/40 text-3xl font-bold text-cyan-300">
              {(data.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h1 className="text-4xl font-black text-white">{data.name || 'Your Name'}</h1>
            {data.professionalTitle && <p className="mt-2 text-lg text-cyan-200">{data.professionalTitle}</p>}
            {data.location && <p className="mt-2 text-sm text-cyan-100/70">{data.location}</p>}
            {data.summary && <p className="mt-6 text-sm leading-relaxed text-cyan-100/80">{data.summary}</p>}
          </div>

          {skills.length > 0 && (
            <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span key={index} className="rounded-full border border-cyan-500/30 px-4 py-1 text-xs text-cyan-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="w-full space-y-8 lg:w-1/2">
          {experiences.length > 0 && (
            <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Experience</h2>
              <div className="space-y-5">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-cyan-500/40 pl-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{exp.duration}</p>
                    <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                    <p className="text-sm text-cyan-100/80">{exp.company}</p>
                    {exp.description && <p className="mt-2 text-sm text-cyan-100/70">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-6">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Education</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-cyan-500/40 pl-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{edu.year}</p>
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                    <p className="text-sm text-cyan-100/80">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function PortfolioContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const encoded = searchParams.get('data');
    if (encoded) {
      try {
        const decoded = decodeURIComponent(encoded);
        setData(JSON.parse(decoded));
        return;
      } catch (error) {
        console.error('Failed to parse portfolio data:', error);
      }
    }

    const stored = localStorage.getItem('portfolioData');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }
  }, [searchParams]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return <MinimalCyberpunk data={data} />;
}

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <Loader className="animate-spin" size={48} />
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}

