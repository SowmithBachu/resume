import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get user info from cookie
    const cookies = request.cookies;
    const googleUserCookie = cookies.get('google_user');
    
    if (!googleUserCookie) {
      return NextResponse.json(
        { error: 'Please sign in to upgrade to Pro' },
        { status: 401 }
      );
    }

    let userInfo;
    try {
      userInfo = JSON.parse(googleUserCookie.value);
    } catch {
      return NextResponse.json(
        { error: 'Invalid user session' },
        { status: 401 }
      );
    }

    // Check required environment variables
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      console.error('DODO_PAYMENTS_API_KEY is not set');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'sandbox';
    const baseUrl = environment === 'production' 
      ? 'https://api.dodopayments.com'
      : 'https://api-sandbox.dodopayments.com';

    const returnUrl = process.env.DODO_PAYMENTS_RETURN_URL || `${request.nextUrl.origin}/pricing?success=true`;
    const cancelUrl = `${request.nextUrl.origin}/pricing?canceled=true`;

    // Get product ID from environment or use a default
    // You should set DODO_PRODUCT_ID in your .env file with the product ID from Dodo dashboard
    const productId = process.env.DODO_PRODUCT_ID;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID not configured. Please set DODO_PRODUCT_ID in environment variables.' },
        { status: 500 }
      );
    }

    // Create checkout session via Dodo Payments API
    const response = await fetch(`${baseUrl}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        customer_email: userInfo.email,
        customer_name: userInfo.name || userInfo.email,
        metadata: {
          user_id: userInfo.id,
          user_email: userInfo.email,
        },
        return_url: returnUrl,
        cancel_url: cancelUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Dodo Payments API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: response.status }
      );
    }

    const checkoutSession = await response.json();

    if (!checkoutSession || !checkoutSession.url) {
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

