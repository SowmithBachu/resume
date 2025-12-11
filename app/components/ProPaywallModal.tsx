'use client';

import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Check } from 'lucide-react';

interface ProPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'share' | 'download' | 'template';
}

export default function ProPaywallModal({ isOpen, onClose, feature }: ProPaywallModalProps) {
  if (!isOpen) return null;

  const getFeatureMessage = () => {
    switch (feature) {
      case 'share':
        return 'Share Link is a Pro feature';
      case 'download':
        return 'Download Source Code is a Pro feature';
      case 'template':
        return 'Premium Templates are Pro features';
      default:
        return 'This is a Pro feature';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="max-w-md w-full border-2"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <CardDescription className="text-base">
            {getFeatureMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold">₹129</span>
              <span className="text-muted-foreground ml-2">one-time payment</span>
            </div>
            <ul className="space-y-3">
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
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                window.location.href = '/pricing';
              }}
              className="flex-1"
            >
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

