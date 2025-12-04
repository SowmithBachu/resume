'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import PortfolioPreview from '../../components/PortfolioPreview';
import { Loader, Download } from 'lucide-react';
import { downloadPortfolioHTML } from '../../utils/generatePortfolioHTML';

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

function PortfolioContent() {
  const params = useParams();
  const portfolioId = params?.id as string;
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!portfolioId || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const loadPortfolio = async () => {
      try {
        // First try to load from Supabase
        const response = await fetch(`/api/portfolio?id=${portfolioId}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setData(result.data);
            setLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const stored = localStorage.getItem(`portfolio_${portfolioId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setData(parsed);
        } else {
          // Fallback: try to get from URL params (for direct sharing)
          const urlParams = new URLSearchParams(window.location.search);
          const encodedData = urlParams.get('data');
          if (encodedData) {
            try {
              const decoded = decodeURIComponent(encodedData);
              setData(JSON.parse(decoded));
            } catch (e) {
              console.error('Failed to parse URL data:', e);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
        // Fallback to localStorage on error
        try {
          const stored = localStorage.getItem(`portfolio_${portfolioId}`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setData(parsed);
          }
        } catch (localError) {
          console.error('Failed to load from localStorage:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-black dark:text-white" size={48} />
          <p className="text-zinc-600 dark:text-zinc-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Portfolio Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            This portfolio link may have expired or doesn't exist. Please check the link and try again.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortfolioPreview data={data} customElements={data.customElements} />
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => downloadPortfolioHTML(data, data.customElements || [])}
          className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Download className="w-5 h-5" />
          Download Source
        </button>
      </div>
    </div>
  );
}

export default function ShareablePortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
          <Loader className="animate-spin text-black dark:text-white" size={48} />
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}

