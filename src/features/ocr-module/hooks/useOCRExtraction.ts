import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      console.log('Calling ocr-extract edge function...');
      
      const { data, error: fnError } = await supabase.functions.invoke<OCRResult>('ocr-extract', {
        body: { imageBase64, mimeType }
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Failed to extract text');
      }

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
