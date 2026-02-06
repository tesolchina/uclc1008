import React from 'react';
import { Download, Copy, RotateCcw, Check, Save, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { downloadMarkdown, copyToClipboard } from '../utils/downloadMarkdown';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/features/auth';
import { useOCRRecords } from '../hooks/useOCRRecords';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  imagePreview: string | null;
  onReset: () => void;
  totalImages?: number;
}

export function TextEditor({ text, onTextChange, imagePreview, onReset, totalImages }: TextEditorProps) {
  const [title, setTitle] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const { toast } = useToast();
  const { isAuthenticated, studentId } = useAuth();
  const { saveRecord, isSaving, saveError, clearSaveError } = useOCRRecords();

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleDownload = () => {
    downloadMarkdown(text, title || undefined);
    toast({
      title: "Downloaded!",
      description: "Your markdown file has been downloaded.",
    });
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    clearSaveError();
    const result = await saveRecord(text, title || undefined, totalImages || 1);
    if (result) {
      setSaved(true);
      toast({
        title: "Saved to Dashboard!",
        description: "You can view this record in My Progress → OCR Records.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "Please copy your text and download as backup.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Important Warning Banner */}
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          <strong>Important:</strong> Database saving may occasionally fail. Always <strong>copy your text</strong> and <strong>download the file</strong> as backup before leaving this page.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Image Preview */}
        {imagePreview && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Original Image{totalImages && totalImages > 1 ? ` (1 of ${totalImages})` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={imagePreview} 
                alt="Original" 
                className="w-full max-h-[500px] object-contain rounded-md border"
              />
            </CardContent>
          </Card>
        )}

        {/* Text Editor */}
        <Card className={imagePreview ? '' : 'lg:col-span-2'}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Extracted Text</CardTitle>
              <div className="text-xs text-muted-foreground">
                {wordCount} words · {charCount} characters
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="Enter a title for your document"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Text Area */}
            <Textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Extracted text will appear here..."
              className="min-h-[300px] font-mono text-sm"
            />

            {/* Save Error Display */}
            {saveError && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {saveError}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons - Primary Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload} disabled={!text.trim()}>
                <Download className="h-4 w-4 mr-2" />
                Download Markdown
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={!text.trim()}>
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy Text'}
              </Button>
            </div>

            {/* Save to Dashboard Section */}
            {isAuthenticated && studentId ? (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-muted-foreground">
                    Logged in as: <strong>{studentId}</strong>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="secondary" 
                    onClick={handleSave} 
                    disabled={!text.trim() || isSaving || saved}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : saved ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : saved ? 'Saved to Dashboard' : 'Save to Dashboard'}
                  </Button>
                  <Button variant="ghost" onClick={onReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Saved records can be viewed in My Progress → OCR Records tab.
                </p>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <Alert className="border-muted">
                  <AlertDescription className="text-muted-foreground text-sm">
                    <strong>Not logged in:</strong> To save extracted text to your dashboard, please{' '}
                    <a href="/auth/student/login" className="text-primary underline">sign in</a> first.
                    For now, use Copy and Download to save your work.
                  </AlertDescription>
                </Alert>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="ghost" onClick={onReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
