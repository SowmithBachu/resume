'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface PortfolioData {
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

function PortfolioContent() {
  const searchParams = useSearchParams();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        // Try to decode the URI component, handle errors gracefully
        let decodedData;
        try {
          decodedData = decodeURIComponent(data);
        } catch (decodeError) {
          // If decodeURIComponent fails, try using the data directly
          console.warn('URI decode failed, trying direct parse:', decodeError);
          decodedData = data;
        }
        
        // Parse the JSON data
        const parsed = JSON.parse(decodedData);
        setPortfolioData(parsed);
      } catch (error) {
        console.error('Error parsing portfolio data:', error);
        // Try to get data from localStorage as fallback
        const storedData = localStorage.getItem('portfolioData');
        if (storedData) {
          try {
            setPortfolioData(JSON.parse(storedData));
          } catch (e) {
            console.error('Error parsing stored data:', e);
          }
        }
      }
    } else {
      // Try to get data from localStorage if no URL param
      const storedData = localStorage.getItem('portfolioData');
      if (storedData) {
        try {
          setPortfolioData(JSON.parse(storedData));
        } catch (e) {
          console.error('Error parsing stored data:', e);
        }
      }
    }
  }, [searchParams]);

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-cyan-400 mb-4">Loading Portfolio</h1>
          <p className="text-zinc-400">Please wait while we prepare your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-cyan-500/20">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {portfolioData.name || 'Portfolio'}
              </h1>
            </div>
            {portfolioData.email && (
              <a
                href={`mailto:${portfolioData.email}`}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Contact
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-5xl font-bold">
                {portfolioData.name?.charAt(0).toUpperCase() || 'P'}
              </span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            {portfolioData.name || 'Your Name'}
          </h1>
          
          {portfolioData.professionalTitle && (
            <p className="text-2xl md:text-3xl text-cyan-300/80 mb-4 font-light">
              {portfolioData.professionalTitle}
            </p>
          )}
          
          {portfolioData.location && (
            <p className="text-zinc-400 mb-8 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {portfolioData.location}
            </p>
          )}
          
          {portfolioData.email && (
            <a
              href={`mailto:${portfolioData.email}`}
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
            >
              Get in Touch
            </a>
          )}
        </div>
      </section>

      {/* Content Container */}
      <main className="relative container mx-auto px-6 max-w-5xl pb-20">
        {/* About Section */}
        {portfolioData.summary && (
          <section className="mb-20">
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                About
              </h2>
              <p className="text-xl leading-relaxed text-zinc-300">
                {portfolioData.summary}
              </p>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {portfolioData.experience && portfolioData.experience.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Experience
            </h2>
            <div className="space-y-6">
              {portfolioData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="group backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-purple-300 mb-2">
                        {exp.company}
                        {exp.duration && (
                          <span className="text-zinc-400 ml-2">• {exp.duration}</span>
                        )}
                      </p>
                      {exp.description && (
                        <p className="text-zinc-300 leading-relaxed mt-4">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {portfolioData.education && portfolioData.education.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Education
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioData.education.map((edu, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-purple-400 mb-2">
                    {edu.degree}
                  </h3>
                  <p className="text-cyan-300 mb-1">
                    {edu.institution}
                  </p>
                  {edu.year && (
                    <p className="text-zinc-400 text-sm">
                      {edu.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {portfolioData.skills && portfolioData.skills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {portfolioData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="group px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 hover:scale-110 transition-all duration-300 cursor-default"
                >
                  <span className="text-cyan-300 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-cyan-500/20">
          <div className="text-center">
            {portfolioData.email && (
              <a
                href={`mailto:${portfolioData.email}`}
                className="inline-block mb-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {portfolioData.email}
              </a>
            )}
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} {portfolioData.name || 'Portfolio'}. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading portfolio...</p>
        </div>
      </div>
    }>
      <PortfolioContent />
    </Suspense>
  );
}
