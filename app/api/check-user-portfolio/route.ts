import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { googleId } = body;

    if (!googleId) {
      return NextResponse.json({ hasPortfolio: false, portfolioId: null, isPro: false });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ hasPortfolio: false, portfolioId: null, isPro: false });
    }

    // Get user info including Pro status
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, is_pro')
      .eq('google_id', googleId)
      .single();

    if (!user) {
      return NextResponse.json({ hasPortfolio: false, portfolioId: null, isPro: false });
    }

    const isPro = user.is_pro === true;

    // Check if user has any portfolios
    const { data: portfolios, error } = await supabaseAdmin
      .from('portfolios')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !portfolios || portfolios.length === 0) {
      return NextResponse.json({ 
        hasPortfolio: false, 
        portfolioId: null, 
        isPro 
      });
    }

    return NextResponse.json({ 
      hasPortfolio: true, 
      portfolioId: portfolios[0].id,
      isPro 
    });
  } catch (error: any) {
    console.error('Error checking user portfolio:', error);
    return NextResponse.json({ hasPortfolio: false, portfolioId: null, isPro: false });
  }
}

