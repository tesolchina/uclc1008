import React, { useState, useCallback, useRef } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OCRUploader } from './OCRUploader';
import { TextEditor } from './TextEditor';
import { ProcessingStatus } from './ProcessingStatus';
import { useOCRExtraction } from '../hooks/useOCRExtraction';
import { ImageItem } from './ImageGallery';

type Step = 'upload' | 'edit';

export function OCRModulePage() {
  const [step, setStep] = useState<Step>('upload');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(-1);
  
  const { extractText, isExtracting, error, clearError } = useOCRExtraction();
  const idCounter = useRef(0);

  const handleImagesAdded = useCallback((newImages: Array<{ base64: string; mimeType: string; previewUrl: string }>) => {
    const imageItems: ImageItem[] = newImages.map(img => ({
      id: `img-${++idCounter.current}`,
      previewUrl: img.previewUrl,
      base64: img.base64,
      mimeType: img.mimeType,
      status: 'pending' as const
    }));
    setImages(prev => [...prev, ...imageItems]);
    clearError();
  }, [clearError]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const handleStartExtraction = useCallback(async () => {
    setIsProcessingBatch(true);
    setCurrentProcessingIndex(0);
    clearError();
    
    const allExtractedTexts: string[] = [];
    
    // Process images sequentially
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      setCurrentProcessingIndex(i);
      
      if (image.status === 'done' && image.extractedText) {
        allExtractedTexts.push(image.extractedText);
        continue;
      }

      // Update status to processing
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, status: 'processing' as const } : img
      ));

      try {
        const text = await extractText(image.base64, image.mimeType);
        allExtractedTexts.push(text);
        
        // Update status to done
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'done' as const, extractedText: text } : img
        ));
      } catch (err) {
        // Update status to error
        setImages(prev => prev.map(img => 
          img.id === image.id ? { 
            ...img, 
            status: 'error' as const, 
            error: err instanceof Error ? err.message : 'Extraction failed' 
          } : img
        ));
      }
    }

    setIsProcessingBatch(false);
    setCurrentProcessingIndex(-1);
    
    if (allExtractedTexts.length > 0) {
      // Combine texts with page separators
      const combinedText = allExtractedTexts.length === 1 
        ? allExtractedTexts[0]
        : allExtractedTexts.map((text, i) => `## Page ${i + 1}\n\n${text}`).join('\n\n---\n\n');
      
      setExtractedText(combinedText);
      setStep('edit');
    }
  }, [images, extractText, clearError]);

  const handleReset = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setExtractedText('');
    setStep('upload');
    clearError();
  }, [images, clearError]);

  // Get first image for preview in editor
  const firstImagePreview = images.length > 0 ? images[0].previewUrl : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">OCR Text Extractor</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload multiple photos of handwritten text and get accurate digital text extraction. 
            Edit the results and download as a Markdown file.
          </p>
        </div>

        {/* Beta Notice */}
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            <strong>Beta Feature:</strong> This tool uses AI to extract handwritten text. 
            Results may vary based on handwriting clarity. Always review and edit the extracted text.
          </AlertDescription>
        </Alert>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Status */}
        {isProcessingBatch && (
          <ProcessingStatus
            totalImages={images.length}
            processedImages={images.filter(i => i.status === 'done').length}
            currentImageIndex={currentProcessingIndex}
            isProcessing={isProcessingBatch}
          />
        )}

        {/* Main Content */}
        {step === 'upload' && !isProcessingBatch && (
          <OCRUploader
            images={images}
            onImagesAdded={handleImagesAdded}
            onRemoveImage={handleRemoveImage}
            isProcessing={isProcessingBatch || isExtracting}
            onStartExtraction={handleStartExtraction}
            hasExtractedText={extractedText.length > 0}
          />
        )}

        {step === 'edit' && (
          <TextEditor
            text={extractedText}
            onTextChange={setExtractedText}
            imagePreview={firstImagePreview}
            onReset={handleReset}
            totalImages={images.length}
          />
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by Gemini for fast, accurate handwriting recognition.
            <br />
            No login required. Your images are not stored.
          </p>
        </div>
      </div>
    </div>
  );
}
