import { useState, useCallback } from 'react';

interface OCRResult {
  text: string;
  model: string;
}

interface UseOCRExtractionReturn {
  extractText: (imageBase64: string, mimeType: string) => Promise<string>;
  isExtracting: boolean;
  error: string | null;
  clearError: () => void;
}

export function useOCRExtraction(): UseOCRExtractionReturn {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const extractText = useCallback(async (imageBase64: string, mimeType: string): Promise<string> => {
    setIsExtracting(true);
    setError(null);

    try {
      console.log('Calling ocr-extract API...');
      
      const response = await fetch('/api/ocr-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to extract text');
      }

      const data: OCRResult = await response.json();

      if (!data?.text) {
        throw new Error('No text extracted from image');
      }

      console.log('OCR extraction successful, text length:', data.text.length);
      return data.text;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('OCR extraction failed:', message);
      setError(message);
      throw err;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return {
    extractText,
    isExtracting,
    error,
    clearError,
  };
}
