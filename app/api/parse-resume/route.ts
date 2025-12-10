import { NextRequest, NextResponse } from 'next/server';

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


async function parseResumeWithOpenRouter(imageData: string[]): Promise<ResumeData> {
  if (!process.env.OPENROUTER_KEY) {
    const err: any = new Error('OPENROUTER_KEY is not set in environment variables');
    err.status = 401;
    throw err;
  }

  const modelName =
    process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-11b-vision-instruct';

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
    const imageParts = imageData.map((img) => {
      const base64Data = img.includes(',') ? img.split(',')[1] : img;
      if (!base64Data || base64Data.length === 0) {
        throw new Error('Invalid image data format');
      }
      return {
        type: 'image_url' as const,
        image_url: {
          url: `data:image/png;base64,${base64Data}`,
        },
      };
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Resume Parser',
      },
      body: JSON.stringify({
        model: modelName,
        temperature: 0.1,
        max_tokens: 2000,
        messages: [
          {
            role: 'system',
            content:
              'You are a resume parser that returns ONLY valid JSON matching the requested schema. Do not include any markdown code fences (```), explanations, or text outside the JSON object. Return the JSON object directly without any wrapping.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              ...imageParts,
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      const err: any = new Error(
        `OpenRouter request failed: ${response.status} ${response.statusText} - ${errText}`
      );
      err.status = response.status;
      throw err;
    }

    const data = await response.json();

    // Check for API errors in response
    if (data.error) {
      throw new Error(`OpenRouter API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Unexpected API response structure:', JSON.stringify(data, null, 2));
      throw new Error('Unexpected response format from AI service');
    }

    const content = data?.choices?.[0]?.message?.content;
    const text =
      Array.isArray(content) && content.length > 0
        ? content.map((part: any) => part?.text || '').join('').trim()
        : (content || '').trim();
    if (!text) {
      throw new Error('Empty response from AI model');
    }

    // Log full response for debugging (truncated in production)
    console.log('AI Response received:', text.substring(0, 1000));

    let jsonText = text.trim();

    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/i, '').replace(/\n?```$/i, '');
    }

    // Remove any leading/trailing whitespace or newlines
    jsonText = jsonText.trim();

    const extractJson = (input: string) => {
      // First, try to find JSON object boundaries more accurately
      // Look for the first { and match it with the last }
      const firstBrace = input.indexOf('{');
      if (firstBrace === -1) {
        return input;
      }

      // Use stack-based matching to find the matching closing brace
      let depth = 0;
      let lastBrace = -1;
      for (let i = firstBrace; i < input.length; i++) {
        const ch = input[i];
        if (ch === '{') {
          depth++;
        } else if (ch === '}') {
          depth--;
          if (depth === 0) {
            lastBrace = i;
            break;
          }
        }
      }

      if (lastBrace !== -1) {
        return input.slice(firstBrace, lastBrace + 1);
      }

      // Fallback: try regex match
      const simple = input.match(/\{[\s\S]*\}/);
      if (simple) return simple[0];

      return input;
    };

    jsonText = extractJson(jsonText);
    jsonText = jsonText.trim();

    // Try to fix common JSON issues
    // Remove any trailing commas before closing braces/brackets
    jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped quotes in strings (basic attempt)
    // This is tricky, so we'll be conservative

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Raw response (first 1000 chars):', text.substring(0, 1000));
      console.error('Extracted JSON candidate (first 1000 chars):', jsonText.substring(0, 1000));
      console.error('Full extracted JSON:', jsonText);
      
      // Try one more time with more aggressive cleaning
      try {
        // Remove any text before first { and after last }
        const cleaned = jsonText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
        if (cleaned !== jsonText) {
          parsedData = JSON.parse(cleaned);
          console.log('Successfully parsed after aggressive cleaning');
        } else {
          throw parseError;
        }
      } catch (retryError) {
        throw new Error('Failed to parse AI response. Please retry with a clearer PDF or try again in a moment.');
      }
    }

    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Invalid response format from AI');
    }

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
    console.error('Error parsing resume with OpenRouter:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      status: error.status,
      statusText: error.statusText,
    });

    const message = String(error?.message || '').toLowerCase();
    if (message.includes('api key') || message.includes('unauthorized') || message.includes('openrouter')) {
      const err: any = new Error('Invalid or missing OPENROUTER_KEY. Please check your .env.local file.');
      err.status = 401;
      throw err;
    }
    if (message.includes('rate limit') || message.includes('quota') || error.status === 429) {
      const err: any = new Error('OpenRouter API rate limit exceeded. Please try again later.');
      err.status = 429;
      throw err;
    }
    if (message.includes('json') || message.includes('parse')) {
      // Log the actual error for debugging
      console.error('Parse error details:', {
        error: error.message,
        stack: error.stack,
      });
      throw new Error('Failed to parse AI response. The resume format might be too complex. Please try with a clearer PDF.');
    }

    throw new Error(error.message || 'Failed to parse resume. Please ensure the PDF is clear and readable.');
  }
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

    const resumeData = await parseResumeWithOpenRouter(images);

    return NextResponse.json({ success: true, data: resumeData });
  } catch (error: any) {
    console.error('Error processing resume:', error);
    const message = String(error?.message || '').toLowerCase();
    let status = (error as any)?.status || 500;
    if (message.includes('rate limit') || message.includes('quota')) {
      status = 429;
    } else if (message.includes('api key')) {
      status = status === 500 ? 401 : status;
    }
    return NextResponse.json(
      { error: error.message || 'Failed to process resume' },
      { status }
    );
  }
}


