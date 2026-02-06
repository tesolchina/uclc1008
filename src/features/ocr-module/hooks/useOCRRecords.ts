import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

export interface OCRRecord {
  id: string;
  student_id: string;
  title: string | null;
  extracted_text: string;
  image_count: number;
  created_at: string;
  updated_at: string;
}

interface UseOCRRecordsReturn {
  saveRecord: (text: string, title?: string, imageCount?: number) => Promise<OCRRecord | null>;
  fetchRecords: () => Promise<OCRRecord[]>;
  isSaving: boolean;
  saveError: string | null;
  clearSaveError: () => void;
}

export function useOCRRecords(): UseOCRRecordsReturn {
  const { studentId, isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const clearSaveError = useCallback(() => {
    setSaveError(null);
  }, []);

  const saveRecord = useCallback(async (
    text: string, 
    title?: string, 
    imageCount: number = 1
  ): Promise<OCRRecord | null> => {
    if (!studentId) {
      setSaveError('You must be logged in to save records');
      return null;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const { data, error } = await supabase
        .from('student_ocr_records')
        .insert({
          student_id: studentId,
          title: title || null,
          extracted_text: text,
          image_count: imageCount
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving OCR record:', error);
        setSaveError('Failed to save to database. Please copy your text as backup.');
        return null;
      }

      return data as OCRRecord;
    } catch (err) {
      console.error('Save OCR record failed:', err);
      setSaveError('Failed to save. Please copy your text and download as backup.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [studentId]);

  const fetchRecords = useCallback(async (): Promise<OCRRecord[]> => {
    if (!studentId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('student_ocr_records')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching OCR records:', error);
        return [];
      }

      return (data || []) as OCRRecord[];
    } catch (err) {
      console.error('Fetch OCR records failed:', err);
      return [];
    }
  }, [studentId]);

  return {
    saveRecord,
    fetchRecords,
    isSaving,
    saveError,
    clearSaveError,
  };
}
