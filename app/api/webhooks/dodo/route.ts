import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (you should implement this based on Dodo Payments docs)
    const signature = request.headers.get('x-dodo-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // TODO: Verify webhook signature using Dodo Payments secret
    // const isValid = verifyWebhookSignature(body, signature, process.env.DODO_WEBHOOK_SECRET);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const body = await request.json();
    
    // Handle different webhook event types
    if (body.event === 'payment.succeeded' || body.event === 'checkout.completed') {
      const { customer_email, metadata } = body.data || {};
      
      if (!customer_email || !metadata?.user_id) {
        return NextResponse.json(
          { error: 'Missing customer information' },
          { status: 400 }
        );
      }

      // Update user status to Pro in Supabase
      if (supabaseAdmin) {
        try {
          // First, find user by email or google_id
          const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, google_id, email')
            .or(`email.eq.${customer_email},google_id.eq.${metadata.user_id}`)
            .single();

          if (user) {
            // Update user to Pro status
            await supabaseAdmin
              .from('users')
              .update({
                is_pro: true,
                pro_purchased_at: new Date().toISOString(),
              })
              .eq('id', user.id);
          } else {
            // If user doesn't exist, create one (shouldn't happen, but handle it)
            console.warn('User not found for payment:', customer_email);
          }
        } catch (error) {
          console.error('Error updating user to Pro:', error);
          // Don't fail the webhook - log and continue
        }
      }

      return NextResponse.json({ received: true });
    }

    // Handle other event types if needed
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

