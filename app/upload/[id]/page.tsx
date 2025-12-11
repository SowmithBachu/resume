'use client';

import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Share2, Check, Copy, X, Sparkles, Download } from 'lucide-react';
import ResumePreview from '../../components/ResumePreview';
import { checkProStatus } from '@/lib/check-pro';
import ProPaywallModal from '../../components/ProPaywallModal';

// Lazy load heavy portfolio preview components
const PortfolioPreview = lazy(() => import('../../components/PortfolioPreview'));
const PortfolioPreview1 = lazy(() => import('../../components/PortfolioPreview1'));
const PortfolioPreview3 = lazy(() => import('../../components/PortfolioPreview3'));

// Dynamic import for download function to reduce initial bundle
const handleDownload = async (portfolioData: ResumeData) => {
  const { downloadPortfolioHTML } = await import('../../utils/generatePortfolioHTML');
  downloadPortfolioHTML(portfolioData, portfolioData.customElements || [], portfolioData.template);
};

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
  customElements?: Array<{
    id: string;
    type: string;
    props?: any;
    section?: string;
  }>;
  template?: '1' | '2' | '3';
}

function EditPortfolioView({ initialData, portfolioId }: { initialData: ResumeData; portfolioId: string }) {
  const [portfolioData, setPortfolioData] = useState<ResumeData>({ ...initialData, template: initialData.template || '1' });
  const [split, setSplit] = useState(50); // percentage width of the left panel
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [checkingPro, setCheckingPro] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<'share' | 'download' | 'template'>('share');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Sync with initialData changes
  useEffect(() => {
    setPortfolioData(initialData);
  }, [initialData]);

  // Check Pro status on mount
  useEffect(() => {
    const checkPro = async () => {
      const proStatus = await checkProStatus();
      setIsPro(proStatus);
      setCheckingPro(false);
      
      // If user is not Pro and has a premium template, reset to template 1
      if (!proStatus && (portfolioData.template === '2' || portfolioData.template === '3')) {
        setPortfolioData({ ...portfolioData, template: '1' });
      }
    };
    checkPro();
  }, []);

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

  const shareUrl = useMemo(() => {
    const envBase = process.env.NEXT_PUBLIC_APP_BASE_URL?.replace(/\/$/, '');
    if (envBase) {
      return `${envBase}/portfolio/${portfolioId}`;
    }
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/portfolio/${portfolioId}`;
    }
    return '';
  }, [portfolioId]);

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOpenShareModal = () => {
    if (!isPro) {
      setPaywallFeature('share');
      setShowPaywall(true);
      return;
    }
    setShowShareModal(true);
  };

  const handleDownloadSource = () => {
    if (!isPro) {
      setPaywallFeature('download');
      setShowPaywall(true);
      return;
    }
    handleDownload(portfolioData);
  };

  const handleTemplateChange = async (newTemplate: '1' | '2' | '3') => {
    if ((newTemplate === '2' || newTemplate === '3') && !isPro) {
      setPaywallFeature('template');
      setShowPaywall(true);
      return;
    }
    await handleDataChange({ ...portfolioData, template: newTemplate });
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setLinkCopied(false);
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
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#EAF9FA] to-[#DDE3FF] dark:from-[#1E3A39] dark:to-[#2A2D4A] border border-[#C9EAE6] dark:border-[#2A5A58] transition-transform hover:scale-[1.01]"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <span className="text-lg font-extrabold text-black dark:text-white tracking-tight">
                ResuFolio
              </span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/customize/${portfolioId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <Sparkles className="w-4 h-4" />
              Customize UI
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDownloadSource();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <Download className="w-4 h-4" />
              Download Source
            </button>
            <button
              onClick={handleOpenShareModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm hover:shadow-md"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-black dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm hover:shadow-md"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Template:
                  </label>
                  <select
                    value={portfolioData.template || '1'}
                    onChange={(e) => {
                      const newTemplate = e.target.value as '1' | '2' | '3';
                      handleTemplateChange(newTemplate);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Template 1 (Minimal)</option>
                    <option value="2" disabled={!isPro}>
                      Template 2 (Bold) {!isPro && '🔒 Pro'}
                    </option>
                    <option value="3" disabled={!isPro}>
                      Template 3 (Modern) {!isPro && '🔒 Pro'}
                    </option>
                  </select>
                </div>
              </div>
              <ResumePreview data={portfolioData} onDataChange={handleDataChange} />
            </div>
          </div>
        </div>

        {/* Draggable divider */}
        <div
          className="relative w-8 cursor-col-resize flex items-stretch group"
          onMouseDown={handleDividerMouseDown}
        >
          <div className="mx-auto h-full flex items-center">
            <div className="w-1.5 h-40 rounded-full bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 shadow-sm group-hover:shadow-md group-hover:from-blue-200 group-hover:via-blue-400 group-hover:to-blue-200 dark:group-hover:from-blue-900 dark:group-hover:via-blue-600 dark:group-hover:to-blue-900 transition-all duration-200"></div>
          </div>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
            <div className="w-8 h-12 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col gap-0.5">
                <span className="w-3 h-0.5 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80"></span>
                <span className="w-3 h-0.5 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80"></span>
                <span className="w-3 h-0.5 rounded-full bg-zinc-400/80 dark:bg-zinc-500/80"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Preview Side */}
        <div
          className="overflow-hidden bg-zinc-50 dark:bg-black flex flex-col flex-1"
          style={{ width: `${100 - split}%`, minWidth: '20%', maxWidth: '80%' }}
        >
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-zinc-500">Loading preview...</div>}>
              {portfolioData.template === '3' ? (
                <PortfolioPreview3 data={portfolioData} />
              ) : portfolioData.template === '2' ? (
                <PortfolioPreview1 data={portfolioData} />
              ) : (
                <PortfolioPreview data={portfolioData} />
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={handleCloseShareModal}
        >
          <div 
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                Share ResuFolio
              </h3>
              <button
                onClick={handleCloseShareModal}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Copy this link to share your ResuFolio
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-black dark:text-zinc-50 focus:outline-none"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pro Paywall Modal */}
      <ProPaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
      />
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


