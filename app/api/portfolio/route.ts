import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

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

// GET - Fetch portfolio by ID
export async function GET(req: NextRequest) {
  const portfolioId = req.nextUrl.searchParams.get('id');

  if (!supabaseAdmin || !portfolioId) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      data: data.data || {}, 
      portfolioId: data.id 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

// POST - Create or update portfolio
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { googleId, portfolioId, data: resumeData } = await req.json();

    if (!googleId || !resumeData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('google_id', googleId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const portfolioPayload = {
      user_id: user.id,
      data: resumeData,
    };

    let result;
    if (portfolioId) {
      const { data, error } = await supabaseAdmin
        .from('portfolios')
        .update(portfolioPayload)
        .eq('id', portfolioId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('portfolios')
        .insert(portfolioPayload)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, portfolioId: result.id });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
}

