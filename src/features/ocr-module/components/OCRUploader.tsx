import React, { useCallback, useRef, useState } from 'react';
import { Camera, Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OCRUploaderProps {
  onImageSelected: (base64: string, mimeType: string, previewUrl: string) => void;
  isProcessing: boolean;
  currentPreview: string | null;
  onClearImage: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function OCRUploader({ 
  onImageSelected, 
  isProcessing, 
  currentPreview,
  onClearImage 
}: OCRUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
      setError('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 10MB');
      return;
    }

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Remove data URL prefix to get pure base64
        const base64 = result.split(',')[1];
        const mimeType = file.type || 'image/jpeg';
        onImageSelected(base64, mimeType, previewUrl);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      console.error('Image processing error:', err);
    }
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input
    e.target.value = '';
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // If we have a preview, show the image
  if (currentPreview) {
    return (
      <Card className="relative">
        <CardContent className="p-4">
          <div className="relative">
            <img 
              src={currentPreview} 
              alt="Uploaded image" 
              className="w-full max-h-[400px] object-contain rounded-lg"
            />
            {!isProcessing && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={onClearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Extracting text...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-1">Drop an image here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse (JPG, PNG, WebP up to 10MB)
          </p>
          <Button variant="outline" type="button">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </CardContent>
      </Card>

      {/* Camera Button for Mobile */}
      <div className="flex justify-center">
        <Button 
          variant="secondary" 
          className="w-full sm:w-auto"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
