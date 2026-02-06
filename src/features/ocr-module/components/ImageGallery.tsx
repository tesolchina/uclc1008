import React from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ImageItem {
  id: string;
  previewUrl: string;
  base64: string;
  mimeType: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  extractedText?: string;
  error?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onRemove: (id: string) => void;
  currentProcessingId?: string;
}

export function ImageGallery({ images, onRemove, currentProcessingId }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">
        Uploaded Images ({images.filter(i => i.status === 'done').length}/{images.length} processed)
      </h3>
      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
              image.status === 'processing' && "border-primary animate-pulse",
              image.status === 'done' && "border-accent",
              image.status === 'error' && "border-destructive",
              image.status === 'pending' && "border-muted"
            )}
          >
            <img
              src={image.previewUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            
            {/* Status Overlay */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              image.status === 'processing' && "bg-background/60",
              image.status === 'done' && "bg-accent/20",
              image.status === 'error' && "bg-destructive/20"
            )}>
              {image.status === 'processing' && (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              )}
              {image.status === 'done' && (
                <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
              )}
              {image.status === 'error' && (
                <AlertCircle className="h-6 w-6 text-destructive" />
              )}
            </div>

            {/* Remove Button (only for non-processing) */}
            {image.status !== 'processing' && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0.5 right-0.5 h-5 w-5"
                onClick={() => onRemove(image.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
