'use client';

import { useState } from 'react';
import ResumePreview from './components/ResumePreview';

interface ResumeData {
  name?: string;
  email?: string;
  location?: string;
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

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeImages, setResumeImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const pdfToImages = async (file: File): Promise<string[]> => {
    try {
      // Dynamically import pdfjs only in browser
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
        }).promise;

        const imageData = canvas.toDataURL('image/png');
        images.push(imageData);
      }

      return images;
    } catch (error: any) {
      console.error('Error converting PDF to images:', error);
      throw new Error('Failed to process PDF. Please ensure the file is a valid PDF.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Convert PDF to images on client side
      const images = await pdfToImages(file);
      
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
      setResumeImages(images);
    } catch (err: any) {
      console.error('Error processing resume:', err);
      setError(err.message || 'An error occurred while processing your resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4 text-black dark:text-zinc-50">
            Resume Parser
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Upload your PDF resume and get a structured preview
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="resume-upload"
                className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
              >
                Upload Resume (PDF)
              </label>
              <input
                id="resume-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-zinc-600 dark:text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-zinc-100 file:text-zinc-700
                  hover:file:bg-zinc-200
                  dark:file:bg-zinc-800 dark:file:text-zinc-300
                  dark:hover:file:bg-zinc-700
                  cursor-pointer"
                disabled={loading}
              />
              {file && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3 px-6 bg-black dark:bg-zinc-50 text-white dark:text-black rounded-lg font-medium
                hover:bg-zinc-800 dark:hover:bg-zinc-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Processing Resume...' : 'Parse Resume'}
            </button>
          </form>
        </div>

        {resumeData && <ResumePreview data={resumeData} images={resumeImages} />}
      </div>
    </div>
  );
}
