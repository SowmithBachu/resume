'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import PortfolioPreview from '../components/PortfolioPreview';

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

function EditPortfolioView({ initialData, onDataChange }: { initialData: ResumeData; onDataChange: (data: ResumeData) => void }) {
  const [portfolioData, setPortfolioData] = useState<ResumeData>(initialData);
  const [split, setSplit] = useState(50); // percentage width of the left panel
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Sync with initialData changes
  useEffect(() => {
    setPortfolioData(initialData);
  }, [initialData]);

  const handleDataChange = (data: ResumeData) => {
    setPortfolioData(data);
    onDataChange(data);
    // Update localStorage
    localStorage.setItem('portfolioData', JSON.stringify(data));
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
    <div className="min-h-screen bg-zinc-100 dark:bg-black flex flex-col">
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
          <a
            href="/"
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>

      {/* Workspace Container with resizable divider */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Edit Form Side */}
        <div
          className="overflow-y-auto bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800"
          style={{ width: `${split}%`, minWidth: '20%', maxWidth: '80%' }}
        >
          <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
                Edit Portfolio
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Make changes to your portfolio information. Updates appear instantly on the right.
              </p>
            </div>
            <ResumePreview 
              data={initialData} 
              onDataChange={handleDataChange}
            />
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
          <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 z-10">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <PortfolioPreview data={portfolioData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const pdfToImages = async (file: File): Promise<string[]> => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('PDF processing must run in the browser');
      }

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
      });
      const pdf = await loadingTask.promise;
      const images: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        await page.render({
          canvasContext: context,
          viewport: viewport,
        } as any).promise;

        const imageData = canvas.toDataURL('image/png');
        images.push(imageData);
      }

      return images;
    } catch (error: any) {
      console.error('Error converting PDF to images:', error);
      throw new Error('Failed to process PDF. Please ensure the file is a valid PDF.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
        setResumeData(null);
      } else {
        setError('Please upload a PDF file');
        setFile(null);
      }
    }
  };

  const processFile = async (selectedFile: File) => {
    setLoading(true);
    setUploading(true);
    setProcessing(false);
    setError(null);

    try {
      // Small delay to show uploading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploading(false);
      setProcessing(true);

      // Convert PDF to images on client side
      const images = await pdfToImages(selectedFile);
      
      if (!images || images.length === 0) {
        throw new Error('Failed to convert PDF to images');
      }

      // Send images to API
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse resume');
      }

      if (!result.data) {
        throw new Error('No data received from server');
      }

      setResumeData(result.data);
      
      // Get user info from cookie
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

      // Save to Supabase if user is logged in
      let portfolioId: string | null = null;
      if (googleId) {
        try {
          const saveResponse = await fetch('/api/portfolio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleId,
              data: result.data,
            }),
          });

          if (saveResponse.ok) {
            const saveResult = await saveResponse.json();
            portfolioId = saveResult.portfolioId;
          }
        } catch (err) {
          console.error('Error saving to database:', err);
          // Continue with localStorage fallback
        }
      }

      // Fallback to localStorage if no database save or no user
      if (!portfolioId) {
        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);
        
        localStorage.setItem('portfolioData', JSON.stringify(result.data));
        localStorage.setItem(`portfolio_${id}`, JSON.stringify(result.data));
        portfolioId = id;
      } else {
        // Still store in localStorage for immediate access
        localStorage.setItem('portfolioData', JSON.stringify(result.data));
      }
      
      router.push(`/upload/${portfolioId}`);
    } catch (err: any) {
      console.error('Error processing resume:', err);
      setError(err.message || 'An error occurred while processing your resume');
    } finally {
      setLoading(false);
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
        setResumeData(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleProceed = async () => {
    if (!file || uploading || processing) return;
    await processFile(file);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] dark:border-[#333333]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <a
            href="/"
            className="flex items-center gap-2 text-[#60646C] dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Back to Home
            </span>
          </a>
        </div>
      </header>

      {/* Upload Section */}
      <section className="flex items-center justify-center px-6 py-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-[700px] w-full">
          <div className="text-center mb-12">
            <h1
              className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] font-extrabold text-black dark:text-white tracking-[-1px] mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Upload Your Resume
            </h1>
            <p
              className="text-[16px] md:text-[18px] text-[#60646C] dark:text-[#A0A0A0] leading-relaxed"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Drop your PDF resume below and we'll automatically extract all the
              information to create your portfolio
            </p>
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-2xl p-16 transition-all duration-200
              ${
                isDragging
                  ? 'border-black dark:border-white bg-gray-50 dark:bg-[#1E1E1E] scale-[1.02]'
                  : 'border-[#E5E7EB] dark:border-[#333333] hover:border-[#C9EAE6] dark:hover:border-[#2A5A58]'
              }
              ${uploading || processing ? 'pointer-events-none opacity-60' : ''}
            `}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || processing}
            />
            <div className="text-center">
              {uploading || processing ? (
                <>
                  <Loader
                    size={64}
                    className="mx-auto mb-6 text-black dark:text-white animate-spin"
                  />
                  <p
                    className="text-[20px] font-semibold text-black dark:text-white mb-2"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {uploading
                      ? 'Uploading your resume...'
                      : 'Analyzing your resume...'}
                  </p>
                  <p
                    className="text-[14px] text-[#60646C] dark:text-[#A0A0A0]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    This may take a few moments
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#EAF9FA] dark:bg-[#1E3A39] flex items-center justify-center mx-auto mb-6">
                    <Upload size={40} className="text-black dark:text-white" />
                  </div>
                  <p
                    className="text-[20px] font-semibold text-black dark:text-white mb-2"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Drop your resume here or click to browse
                  </p>
                  <p
                    className="text-[14px] text-[#60646C] dark:text-[#A0A0A0] mb-6"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    PDF files only • Max 10MB
                  </p>
                  {file && (
                    <p className="mb-4 text-sm text-[#60646C] dark:text-[#A0A0A0]">
                      Selected file:{' '}
                      <span className="font-medium text-black dark:text-white">
                        {file.name}
                      </span>
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium">
                    Choose File
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Selected file + Proceed button (outside the box) */}
          {file && !uploading && !processing && (
            <div className="mt-6 flex flex-col items-center gap-3">
              
              <button
                type="button"
                onClick={handleProceed}
                disabled={uploading || processing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Proceed</>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

