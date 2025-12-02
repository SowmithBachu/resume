'use client';

import { Sparkles, FileText, Edit, Eye, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted?: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const handleGetStarted = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onGetStarted) {
      e.preventDefault();
      onGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle
              cx="200"
              cy="150"
              r="180"
              fill="none"
              stroke="#FCEADB"
              className="dark:stroke-[#3D2F26]"
              strokeWidth="1"
              opacity="0.3"
            />
            <circle
              cx="1000"
              cy="600"
              r="220"
              fill="none"
              stroke="#DDE3FF"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>
        </div>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#EAF9FA] dark:bg-[#1E3A39] flex items-center justify-center">
                <Sparkles size={36} className="text-black dark:text-white" />
              </div>
            </div>
            {/* Main Headline */}
            <h1
              className="text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] font-extrabold text-black dark:text-white tracking-[-1px] mb-6"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Transform Your Resume
              <br />
              Into a{' '}
              <span className="relative inline-block">
                Beautiful Portfolio
                <svg
                  className="absolute left-0 w-full h-3 -bottom-2"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8c60-6 120-6 180 0s120 6 116-4"
                    stroke="#C9EAE6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            {/* Subheading */}
            <p
              className="text-[18px] md:text-[20px] text-[#60646C] dark:text-[#A0A0A0] leading-relaxed max-w-[600px] mx-auto mb-12"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Upload your PDF resume and we'll instantly create a stunning,
              editable portfolio website. No design skills needed.
            </p>
            {/* CTA Button */}
            <a
              href="/upload"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[18px] font-semibold hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Get Started
              <ArrowRight size={20} />
            </a>
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[800px] mx-auto mt-20">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#DDE3FF] dark:bg-[#2A2D4A] flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-black dark:text-white" />
                </div>
                <h3
                  className="text-[16px] font-semibold text-black dark:text-white mb-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Upload Resume
                </h3>
                <p
                  className="text-[14px] text-[#60646C] dark:text-[#A0A0A0]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Simply drag and drop your PDF resume
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#FCEADB] dark:bg-[#3D2F26] flex items-center justify-center mx-auto mb-4">
                  <Edit size={24} className="text-black dark:text-white" />
                </div>
                <h3
                  className="text-[16px] font-semibold text-black dark:text-white mb-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Customize
                </h3>
                <p
                  className="text-[14px] text-[#60646C] dark:text-[#A0A0A0]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Edit and personalize your portfolio
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#C9EAE6] dark:bg-[#1E3A39] flex items-center justify-center mx-auto mb-4">
                  <Eye size={24} className="text-black dark:text-white" />
                </div>
                <h3
                  className="text-[16px] font-semibold text-black dark:text-white mb-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Preview & Share
                </h3>
                <p
                  className="text-[14px] text-[#60646C] dark:text-[#A0A0A0]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Preview and share your beautiful portfolio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

