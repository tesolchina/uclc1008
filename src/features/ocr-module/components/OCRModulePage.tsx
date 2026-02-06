import React, { useState, useCallback } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OCRUploader } from './OCRUploader';
import { TextEditor } from './TextEditor';
import { useOCRExtraction } from '../hooks/useOCRExtraction';

type Step = 'upload' | 'edit';

export function OCRModulePage() {
  const [step, setStep] = useState<Step>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  
  const { extractText, isExtracting, error, clearError } = useOCRExtraction();

  const handleImageSelected = useCallback(async (base64: string, mimeType: string, previewUrl: string) => {
    setImagePreview(previewUrl);
    clearError();
    
    try {
      const text = await extractText(base64, mimeType);
      setExtractedText(text);
      setStep('edit');
    } catch (err) {
      // Error is handled by the hook
      console.error('Extraction failed:', err);
    }
  }, [extractText, clearError]);

  const handleClearImage = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    clearError();
  }, [imagePreview, clearError]);

  const handleReset = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setExtractedText('');
    setStep('upload');
    clearError();
  }, [imagePreview, clearError]);

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
            Upload a photo of handwritten text and get accurate digital text extraction. 
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

        {/* Main Content */}
        {step === 'upload' && (
          <OCRUploader
            onImageSelected={handleImageSelected}
            isProcessing={isExtracting}
            currentPreview={imagePreview}
            onClearImage={handleClearImage}
          />
        )}

        {step === 'edit' && (
          <TextEditor
            text={extractedText}
            onTextChange={setExtractedText}
            imagePreview={imagePreview}
            onReset={handleReset}
          />
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by Gemini 2.5 Pro for high-accuracy handwriting recognition.
            <br />
            No login required. Your images are not stored.
          </p>
        </div>
      </div>
    </div>
  );
}
