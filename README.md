# Resume Parser

A Next.js application that parses PDF resumes using Google's Gemini AI with OCR capabilities. Upload a PDF resume and get a structured preview of the extracted information.

## Features

- 📄 PDF resume upload
- 🤖 AI-powered parsing using Gemini 1.5 Flash
- 🖼️ Automatic PDF to image conversion
- 📋 Structured resume preview with:
  - Personal information (name, email, phone, location)
  - Professional summary
  - Work experience
  - Education
  - Skills
  - Certifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Upload Resume (PDF)" and select a PDF file
2. Click "Parse Resume" to process the file
3. View the structured resume preview with all extracted information

## Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google Gemini AI** - Resume parsing
- **PDF.js** - PDF processing
- **Canvas** - PDF to image conversion

## Notes

- The application processes PDFs by converting them to images and sending them to Gemini for OCR and structured extraction
- Ensure your PDFs are clear and readable for best results
- The Gemini API key is required for the application to function
