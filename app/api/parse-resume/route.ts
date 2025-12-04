import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { redis } from '@/lib/redis-client';

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
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string;
  }>;
}


async function parseResumeWithGemini(imageData: string[], apiKey: string): Promise<ResumeData> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Use gemini-1.5-pro which supports vision/image inputs
  // If this fails, fallback logic will try other models
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-pro',
  });

  const prompt = `You are an expert at extracting portfolio-relevant information from resumes. Extract ONLY the most important information suitable for a portfolio website:

1. NAME - Full name (from header)
2. EMAIL - Email address (from header)
3. LOCATION - City, State/Country (from header, optional)
4. SUMMARY - Professional summary or objective (2-3 sentences max, make it concise)
5. EXPERIENCE - Only the TOP 2-3 most recent/relevant positions with:
   - Job title
   - Company name
   - Duration (Start Date - End Date)
   - Brief description (2-3 key achievements or responsibilities, keep it concise)
6. EDUCATION - Only the highest/most relevant degree:
   - Degree name
   - Institution name
   - Year (optional)
7. SKILLS - Only the most important/relevant skills (top 8-12 skills, prioritize technical and relevant skills)
8. PROJECTS - Only the TOP 2-4 most relevant projects with:
   - Project title
   - Short description (1–3 sentences, concise)
   - Key technologies used (as a single string, e.g. "React, Node.js, PostgreSQL")

EXCLUDE: Phone numbers, certifications, and less relevant experience/education. Focus on what would be displayed on a professional portfolio website.

Return ONLY valid JSON without any markdown formatting, code blocks, or explanations. The JSON structure must be:
{
  "name": "Full Name",
  "email": "email@example.com",
  "location": "City, State/Country",
  "summary": "Concise professional summary (2-3 sentences)",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "description": "Brief description with 2-3 key points"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {
      "title": "Project Title",
      "description": "Short description of the project.",
      "technologies": "React, Node.js, PostgreSQL"
    }
  ]
}

IMPORTANT: Keep all text concise and portfolio-focused. Limit experience to top 2-3 positions, education to highest degree, skills to 8-12 most relevant, and projects to the 2-4 strongest ones. If a field is not present, use null for strings or empty arrays []. Return ONLY the JSON object, nothing else.`;

  try {
    // Validate and prepare image data
    const parts = imageData.map((img) => {
      const base64Data = img.includes(',') ? img.split(',')[1] : img;
      if (!base64Data || base64Data.length === 0) {
        throw new Error('Invalid image data format');
      }
      return {
        inlineData: {
          data: base64Data,
          mimeType: 'image/png',
        },
      };
    });

    // Generate content with structured output
    const result = await model.generateContent([prompt, ...parts]);
    const response = await result.response;
    let text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }

    // Clean the response - remove markdown code blocks if present
    let jsonText = text.trim();
    
    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/i, '').replace(/\n?```$/i, '');
    }
    
    // Try to extract JSON object if there's extra text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response (first 500 chars):', text.substring(0, 500));
      throw new Error(`Failed to parse JSON response. The AI may have returned invalid JSON. Please try again.`);
    }
    
    // Validate response structure
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Invalid response format from AI');
    }
    
    // Ensure all fields exist with proper defaults
    return {
      name: parsedData.name || null,
      email: parsedData.email || null,
      location: parsedData.location || null,
      summary: parsedData.summary || null,
      experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
      education: Array.isArray(parsedData.education) ? parsedData.education : [],
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      projects: Array.isArray(parsedData.projects) ? parsedData.projects : [],
    } as ResumeData;
  } catch (error: any) {
    console.error('Error parsing resume with Gemini:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
    });
    
    // If model not found, try alternative models that support vision
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      console.log('Trying alternative model names...');
      const alternativeModels = ['gemini-2.5-pro'];
      
      for (const modelName of alternativeModels) {
        try {
          console.log(`Trying model: ${modelName}`);
          const altModel = genAI.getGenerativeModel({ model: modelName });
          const parts = imageData.map((img) => {
            const base64Data = img.includes(',') ? img.split(',')[1] : img;
            return {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png',
              },
            };
          });
          
          const result = await altModel.generateContent([prompt, ...parts]);
          const response = await result.response;
          let text = response.text();
          
          if (!text || text.trim().length === 0) {
            continue;
          }
          
          let jsonText = text.trim();
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');
          } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\n?/i, '').replace(/\n?```$/i, '');
          }
          
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
          }
          
          const parsedData = JSON.parse(jsonText);
          
          if (parsedData && typeof parsedData === 'object') {
            return {
              name: parsedData.name || null,
              email: parsedData.email || null,
              phone: parsedData.phone || null,
              location: parsedData.location || null,
              summary: parsedData.summary || null,
              experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
              education: Array.isArray(parsedData.education) ? parsedData.education : [],
              skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
              certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
            } as ResumeData;
          }
        } catch (altError) {
          console.log(`Model ${modelName} also failed, trying next...`);
          continue;
        }
      }
      
      throw new Error('No available Gemini model found. Please check your API key and available models.');
    }
    
    // Provide more specific error messages
    if (error.message?.includes('API key') || error.message?.includes('GEMINI_API_KEY')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env.local file.');
    }
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      throw new Error('Failed to parse AI response. The resume format might be too complex. Please try with a clearer PDF.');
    }
    
    throw new Error(error.message || 'Failed to parse resume. Please ensure the PDF is clear and readable.');
  }
}

// Rotate between multiple Gemini API keys, optionally using Redis to persist index across requests
async function parseWithRotatingGeminiKeys(imageData: string[]): Promise<ResumeData> {
  const rawKeys =
    process.env.GEMINI_API_KEYS ||
    process.env.GEMINI_API_KEY ||
    '';

  const keys = rawKeys
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  if (keys.length === 0) {
    throw new Error('No Gemini API keys configured. Please set GEMINI_API_KEYS or GEMINI_API_KEY in your environment.');
  }

  const maxKeys = Math.min(3, keys.length);
  const redisIndexKey = 'gemini:currentIndex';

  // Determine starting index (from Redis when available)
  let startIndex = 0;
  if (redis) {
    try {
      const stored = await redis.get<number>(redisIndexKey);
      if (typeof stored === 'number' && stored >= 0 && stored < maxKeys) {
        startIndex = stored;
      }
    } catch {
      // Ignore Redis errors and just fall back to 0
    }
  }

  let lastError: any;

  for (let offset = 0; offset < maxKeys; offset++) {
    const index = (startIndex + offset) % maxKeys;
    const apiKey = keys[index];

    try {
      const result = await parseResumeWithGemini(imageData, apiKey);

      // On success, advance the index for the next request (round‑robin)
      if (redis) {
        try {
          const nextIndex = (index + 1) % maxKeys;
          await redis.set(redisIndexKey, nextIndex);
        } catch {
          // Non‑fatal if Redis set fails
        }
      }

      return result;
    } catch (error: any) {
      lastError = error;
      const message = String(error?.message || '').toLowerCase();
      const status = (error as any)?.status || (error as any)?.statusCode;
      const shouldRotate =
        status === 429 ||
        message.includes('rate limit') ||
        message.includes('quota') ||
        message.includes('resource_exhausted') ||
        // Also rotate on invalid / missing API key so the next key can be tried
        message.includes('invalid or missing gemini api key') ||
        message.includes('api key');

      // Only stop immediately if this is some other kind of error
      if (!shouldRotate) {
        throw error;
      }

      // Otherwise, try the next key (loop continues)
      console.warn(`Gemini API rate-limited for key index ${index}, rotating to next key...`);
    }
  }

  throw lastError || new Error('All configured Gemini API keys are exhausted. Please try again later.');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Parse with Gemini using rotating API keys (Redis-backed when configured)
    const resumeData = await parseWithRotatingGeminiKeys(images);

    return NextResponse.json({ success: true, data: resumeData });
  } catch (error: any) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process resume' },
      { status: 500 }
    );
  }
}

