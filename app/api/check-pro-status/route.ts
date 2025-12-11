import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId && !email) {
      return NextResponse.json({ isPro: false }, { status: 200 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ isPro: false }, { status: 200 });
    }

    // Check if user is Pro
    let query = supabaseAdmin.from('users').select('is_pro').limit(1);

    if (userId) {
      query = query.eq('google_id', userId);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json({ isPro: false }, { status: 200 });
    }

    return NextResponse.json({ isPro: data.is_pro === true });
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return NextResponse.json({ isPro: false }, { status: 200 });
  }
}

