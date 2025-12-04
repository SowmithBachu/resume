'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, X, Settings2, Share2, Check, Copy } from 'lucide-react';
import PortfolioPreview from '../../components/PortfolioPreview';
import { UIElementsPalette, renderCustomElement, UIElement } from '../../components/UIElements';
import { ElementEditor } from '../../components/ElementEditor';

interface ResumeData {
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

function CustomizePortfolioView({ initialData, portfolioId }: { initialData: ResumeData; portfolioId: string }) {
  const [portfolioData, setPortfolioData] = useState<ResumeData>(initialData);
  const [split, setSplit] = useState(30); // percentage width of the left panel
  const [draggedElement, setDraggedElement] = useState<UIElement | null>(null);
  const [dropZones, setDropZones] = useState<{ [key: string]: boolean }>({});
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPortfolioData(initialData);
  }, [initialData]);

  const handleDataChange = async (data: ResumeData) => {
    setPortfolioData(data);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioData', JSON.stringify(data));
      localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(data));
    }

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

  const handleDragStart = (element: UIElement) => {
    setDraggedElement(element);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedElement) {
      setDropZones({ [sectionId]: true });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !previewRef.current?.contains(relatedTarget)) {
      setDropZones({});
    }
  };

  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZones({});

    try {
      const data = e.dataTransfer.getData('application/json');
      const elementData = JSON.parse(data);
      
      const newElement = {
        id: `${elementData.type}-${Date.now()}`,
        type: elementData.type,
        props: {},
        section: sectionId,
      };

      const updatedData = {
        ...portfolioData,
        customElements: [...(portfolioData.customElements || []), newElement],
      };

      handleDataChange(updatedData);
    } catch (err) {
      console.error('Error handling drop:', err);
    }
    
    setDraggedElement(null);
  };

  const handleRemoveElement = (elementId: string) => {
    const updatedData = {
      ...portfolioData,
      customElements: (portfolioData.customElements || []).filter(el => el.id !== elementId),
    };
    handleDataChange(updatedData);
  };

  const handleEditElement = (elementId: string) => {
    setEditingElementId(elementId);
  };

  const handleSaveElement = (elementId: string, newProps: any) => {
    const updatedData = {
      ...portfolioData,
      customElements: (portfolioData.customElements || []).map(el => 
        el.id === elementId ? { ...el, props: newProps } : el
      ),
    };
    handleDataChange(updatedData);
    setEditingElementId(null);
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/portfolio/${portfolioId}` : '';

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
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setLinkCopied(false);
  };

  const handleSavePortfolio = () => {
    handleDataChange(portfolioData);
  };

  useEffect(() => {
    const handleRemoveElementEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      handleRemoveElement(customEvent.detail.id);
    };

    window.addEventListener('removeElement', handleRemoveElementEvent);
    return () => {
      window.removeEventListener('removeElement', handleRemoveElementEvent);
    };
  }, [portfolioData]);

  const handleDividerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const onMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const min = rect.width * 0.2;
      const max = rect.width * 0.7;
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

  const sections = [
    { id: 'hero', name: 'Hero Section', after: 'hero' },
    { id: 'about', name: 'About Section', after: 'about' },
    { id: 'experience', name: 'Experience Section', after: 'experience' },
    { id: 'projects', name: 'Projects Section', after: 'projects' },
    { id: 'skills', name: 'Skills Section', after: 'skills' },
    { id: 'education', name: 'Education Section', after: 'education' },
    { id: 'contact', name: 'Contact Section', after: 'contact' },
  ];

  return (
    <div className="h-screen bg-zinc-100 dark:bg-black flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 border-b-2 border-gray-200 dark:border-zinc-800 px-6 py-5 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EAF9FA] to-[#DDE3FF] dark:from-[#1E3A39] dark:to-[#2A2D4A] border-2 border-[#C9EAE6] dark:border-[#2A5A58] shadow-md">
              <span className="text-xl font-extrabold text-black dark:text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                ResuFolio
              </span>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-700"></div>
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Customize Portfolio
              </span>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-700"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Drag and drop UI elements onto your portfolio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/upload/${portfolioId}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </a>
            <button
              onClick={handleOpenShareModal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
            >
              ← Home
            </a>
          </div>
        </div>
      </div>

      {/* Workspace Container */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Elements Palette Side */}
        <div
          className="flex flex-col overflow-hidden bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
          style={{ width: `${split}%`, minWidth: '20%', maxWidth: '50%' }}
        >
          <div className="flex-1 overflow-y-auto">
            <UIElementsPalette onDragStart={handleDragStart} onSave={handleSavePortfolio} />
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
          ref={previewRef}
          className="overflow-hidden bg-zinc-50 dark:bg-black flex flex-col flex-1"
          style={{ width: `${100 - split}%`, minWidth: '30%', maxWidth: '80%' }}
        >
          <div className="flex-1 overflow-y-auto">
            <PortfolioPreview 
              data={portfolioData} 
              customElements={portfolioData.customElements} 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              isCustomizing={true}
              activeDropZone={Object.keys(dropZones)[0] || null}
              onEditElement={handleEditElement}
            />
          </div>
        </div>
      </div>

      {/* Global drag overlay */}
      {draggedElement && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-blue-500/5" />
      )}

      {/* Element Editor Modal */}
      {editingElementId && (() => {
        const element = portfolioData.customElements?.find(el => el.id === editingElementId);
        if (!element) return null;
        return (
          <ElementEditor
            element={element}
            onSave={(props) => handleSaveElement(editingElementId, props)}
            onClose={() => setEditingElementId(null)}
          />
        );
      })()}

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
                Share Portfolio
              </h3>
              <button
                onClick={handleCloseShareModal}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Copy this link to share your portfolio
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
    </div>
  );
}

export default function CustomizePortfolioPage() {
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
        const response = await fetch(`/api/portfolio?id=${portfolioId}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setData(result.data);
            localStorage.setItem('portfolioData', JSON.stringify(result.data));
            localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(result.data));
            setLoading(false);
            return;
          }
        }

        const storedById = localStorage.getItem(`portfolio_${portfolioId}`);
        const stored = storedById || localStorage.getItem('portfolioData');
        
        if (stored) {
          const parsed = JSON.parse(stored);
          setData(parsed);
          if (!storedById) {
            localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(parsed));
          }
        }
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
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
          <p className="text-sm">Loading customization workspace...</p>
        </div>
      </div>
    );
  }

  return <CustomizePortfolioView initialData={data} portfolioId={portfolioId} />;
}

