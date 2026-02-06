import React from 'react';
import { Download, Copy, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { downloadMarkdown, copyToClipboard } from '../utils/downloadMarkdown';
import { useToast } from '@/hooks/use-toast';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  imagePreview: string | null;
  onReset: () => void;
}

export function TextEditor({ text, onTextChange, imagePreview, onReset }: TextEditorProps) {
  const [title, setTitle] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Image Preview */}
      {imagePreview && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Original Image</CardTitle>
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

          {/* Action Buttons */}
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
            <Button variant="ghost" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
