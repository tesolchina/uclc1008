import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SessionQRCodeProps {
  sessionCode: string;
}

export function SessionQRCode({ sessionCode }: SessionQRCodeProps) {
  const { toast } = useToast();
  
  // Use the production URL
  const joinUrl = `https://ue1.hkbu.tech/join/${sessionCode}`;
  
  const copyUrl = () => {
    navigator.clipboard.writeText(joinUrl);
    toast({ title: 'Copied!', description: 'Join URL copied to clipboard' });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    toast({ title: 'Copied!', description: 'Session code copied to clipboard' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Session</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl shadow-inner">
            <QRCodeSVG 
              value={joinUrl} 
              size={200}
              level="H"
              includeMargin
            />
          </div>
          
          {/* Session Code */}
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">Session Code</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-3xl font-bold tracking-widest">
                {sessionCode}
              </span>
              <Button variant="ghost" size="icon" onClick={copyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* URL */}
          <div className="w-full space-y-2">
            <p className="text-sm text-muted-foreground text-center">Or go to</p>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
              <code className="flex-1 text-sm break-all text-center">
                ue1.hkbu.tech/join/{sessionCode}
              </code>
              <Button variant="ghost" size="icon" onClick={copyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground text-center space-y-1 pt-2">
            <p>📱 Students can scan the QR code with their phone</p>
            <p>💻 Or enter the code at the join URL</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
