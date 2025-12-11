'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Check, CheckCircle2, XCircle } from 'lucide-react';

function PricingContent() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'canceled'>('idle');
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setStatus('success');
    } else if (canceled === 'true') {
      setStatus('canceled');
    }
  }, [searchParams]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Dodo checkout page
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-green-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for upgrading to Pro. Your account has been upgraded.
                </p>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'canceled') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 border-orange-500">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Canceled</h2>
                <p className="text-muted-foreground mb-6">
                  Your payment was canceled. You can try again anytime.
                </p>
                <Button
                  onClick={() => {
                    setStatus('idle');
                    window.history.replaceState({}, '', '/pricing');
                  }}
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upgrade to Pro</h1>
          <p className="text-muted-foreground">
            Unlock advanced features and premium templates
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">ResuFolio Pro</CardTitle>
            <CardDescription className="text-lg">
              <span className="text-3xl font-bold">₹129</span>
              <span className="text-muted-foreground ml-2">one-time payment</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>Unlock advanced portfolio customization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>Download complete source code</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>Access 2 premium portfolio templates</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : 'Upgrade to Pro – ₹129'}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Secure payment powered by Dodo Payments
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
