import React, { useCallback, useRef, useState } from 'react';
import { Camera, Upload, ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ImageGallery, ImageItem } from './ImageGallery';

interface OCRUploaderProps {
  images: ImageItem[];
  onImagesAdded: (newImages: Array<{ base64: string; mimeType: string; previewUrl: string }>) => void;
  onRemoveImage: (id: string) => void;
  isProcessing: boolean;
  onStartExtraction: () => void;
  hasExtractedText: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function OCRUploader({ 
  images,
  onImagesAdded,
  onRemoveImage,
  isProcessing, 
  onStartExtraction,
  hasExtractedText
}: OCRUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList) => {
    setError(null);
    const newImages: Array<{ base64: string; mimeType: string; previewUrl: string }> = [];

    for (const file of Array.from(files)) {
      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
        setError('Please upload JPG, PNG, or WebP images');
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError('Images must be smaller than 10MB');
        continue;
      }

      try {
        const previewUrl = URL.createObjectURL(file);
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        newImages.push({
          base64,
          mimeType: file.type || 'image/jpeg',
          previewUrl
        });
      } catch (err) {
        console.error('Failed to process file:', err);
        setError('Failed to process one or more images');
      }
    }

    if (newImages.length > 0) {
      onImagesAdded(newImages);
    }
  }, [onImagesAdded]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    e.target.value = '';
  }, [processFiles]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const pendingImages = images.filter(i => i.status === 'pending').length;
  const processingImage = images.find(i => i.status === 'processing');
  const canExtract = images.length > 0 && !isProcessing;

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
          <h3 className="font-medium mb-1">
            {images.length > 0 ? 'Add more images' : 'Drop images here'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload multiple photos at once (JPG, PNG, WebP up to 10MB each)
          </p>
          <Button variant="outline" type="button">
            <Upload className="h-4 w-4 mr-2" />
            {images.length > 0 ? 'Add More' : 'Choose Files'}
          </Button>
        </CardContent>
      </Card>

      {/* Camera Button for Mobile */}
      <div className="flex justify-center gap-2">
        <Button 
          variant="secondary" 
          className="flex-1 sm:flex-none"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
        {images.length > 0 && (
          <Button
            variant="default"
            className="flex-1 sm:flex-none"
            onClick={onStartExtraction}
            disabled={!canExtract || hasExtractedText}
          >
            {isProcessing ? (
              <>Processing {images.filter(i => i.status === 'done').length + 1}/{images.length}...</>
            ) : hasExtractedText ? (
              'Extraction Complete'
            ) : (
              `Extract Text (${images.length} ${images.length === 1 ? 'image' : 'images'})`
            )}
          </Button>
        )}
      </div>

      {/* Image Gallery */}
      <ImageGallery
        images={images}
        onRemove={onRemoveImage}
        currentProcessingId={processingImage?.id}
      />

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
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
