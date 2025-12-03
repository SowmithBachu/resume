'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Check, Copy } from 'lucide-react';
import ResumePreview from '../../components/ResumePreview';
import PortfolioPreview from '../../components/PortfolioPreview';

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

function EditPortfolioView({ initialData, portfolioId }: { initialData: ResumeData; portfolioId: string }) {
  const [portfolioData, setPortfolioData] = useState<ResumeData>(initialData);
  const [split, setSplit] = useState(50); // percentage width of the left panel
  const [linkCopied, setLinkCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Sync with initialData changes
  useEffect(() => {
    setPortfolioData(initialData);
  }, [initialData]);

  const handleDataChange = async (data: ResumeData) => {
    setPortfolioData(data);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioData', JSON.stringify(data));
      localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(data));
    }

    // Save to Supabase if user is logged in
    const cookies = document.cookie.split(';');
    const googleUserCookie = cookies.find(c => c.trim().startsWith('google_user='));
    let googleId: string | null = null;
    
    if (googleUserCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(googleUserCookie.split('=')[1]));
        googleId = userData.id || null;
      } catch (e) {
        console.error('Error parsing user cookie:', e);
      }
    }

    if (googleId) {
      try {
        await fetch('/api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            googleId,
            portfolioId,
            data,
          }),
        });
      } catch (err) {
        console.error('Error saving to database:', err);
      }
    }
  };

  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/portfolio/${portfolioId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };


  const handleDividerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const onMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const min = rect.width * 0.2;
      const max = rect.width * 0.8;
      const clamped = Math.min(Math.max(relativeX, min), max);
      const percent = (clamped / rect.width) * 100;
      setSplit(percent);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="h-screen bg-zinc-100 dark:bg-black flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
              Portfolio Builder
            </h1>
            <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-700"></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Edit your portfolio and see it live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share Link
                </>
              )}
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Workspace Container with resizable divider */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Edit Form Side */}
        <div
          className="flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
          style={{ width: `${split}%`, minWidth: '20%', maxWidth: '80%' }}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
                  Edit Portfolio
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Make changes to your portfolio information. Updates appear instantly on the right.
                </p>
              </div>
              <ResumePreview data={portfolioData} onDataChange={handleDataChange} />
            </div>
          </div>
        </div>

        {/* Draggable divider */}
        <div
          className="relative w-1 cursor-col-resize bg-zinc-200 dark:bg-zinc-800 flex items-stretch"
          onMouseDown={handleDividerMouseDown}
        >
          <div className="w-px bg-zinc-300 dark:bg-zinc-700 mx-auto h-full" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
            <div className="w-7 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-sm flex items-center justify-center">
              <div className="w-0.5 h-5 bg-zinc-400 rounded-full mx-0.5" />
              <div className="w-0.5 h-5 bg-zinc-400 rounded-full mx-0.5" />
            </div>
          </div>
        </div>

        {/* Portfolio Preview Side */}
        <div
          className="overflow-hidden bg-zinc-50 dark:bg-black flex flex-col flex-1"
          style={{ width: `${100 - split}%`, minWidth: '20%', maxWidth: '80%' }}
        >
          <div className="flex-1 overflow-y-auto">
            <PortfolioPreview data={portfolioData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadWorkspacePage() {
  const params = useParams();
  const portfolioId = (params?.id as string) || '';
  const [data, setData] = useState<ResumeData | null>(null);
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
            // Also store in localStorage for offline access
            localStorage.setItem('portfolioData', JSON.stringify(result.data));
            localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(result.data));
            setLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const storedById = localStorage.getItem(`portfolio_${portfolioId}`);
        const stored = storedById || localStorage.getItem('portfolioData');
        
        if (stored) {
          const parsed = JSON.parse(stored);
          setData(parsed);
          // Also store with ID for sharing
          if (!storedById) {
            localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(parsed));
          }
        }
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
        // Fallback to localStorage on error
        try {
          const storedById = localStorage.getItem(`portfolio_${portfolioId}`);
          const stored = storedById || localStorage.getItem('portfolioData');
          
          if (stored) {
            const parsed = JSON.parse(stored);
            setData(parsed);
            if (!storedById) {
              localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(parsed));
            }
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

  if (loading || !data || !portfolioId) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-black flex items-center justify-center">
        <div className="text-center text-zinc-600 dark:text-zinc-300">
          <p className="text-sm">Loading your portfolio workspace...</p>
        </div>
      </div>
    );
  }

  return <EditPortfolioView initialData={data} portfolioId={portfolioId} />;
}


