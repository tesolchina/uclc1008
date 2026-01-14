import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, X, Plus, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { emailSchema, displayNameSchema } from '../utils/validation';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TeacherRequestFormProps {
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export function TeacherRequestForm({ onError, onSuccess }: TeacherRequestFormProps) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [sections, setSections] = useState<string[]>([]);
  const [sectionInput, setSectionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addSection = () => {
    const trimmed = sectionInput.trim();
    // Validate: must be 2 digits
    if (!/^\d{2}$/.test(trimmed)) {
      onError('Section number must be exactly 2 digits (e.g., 01, 12)');
      return;
    }
    if (sections.includes(trimmed)) {
      onError('Section already added');
      return;
    }
    setSections([...sections, trimmed]);
    setSectionInput('');
    onError('');
  };

  const removeSection = (section: string) => {
    setSections(sections.filter(s => s !== section));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSection();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');

    try {
      emailSchema.parse(email);
      displayNameSchema.parse(displayName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        onError(err.errors[0].message);
        return;
      }
    }

    if (sections.length === 0) {
      onError('Please add at least one section number');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('pending_teacher_requests')
        .insert({
          email: email.toLowerCase().trim(),
          display_name: displayName.trim(),
          sections: sections,
        });

      if (error) {
        if (error.code === '23505') {
          onError('A request with this email already exists. Please wait for admin approval or contact simonwang@hkbu.edu.hk');
        } else {
          onError(error.message);
        }
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      onSuccess('Your request has been submitted! You will receive an email once approved.');
    } catch (err: any) {
      onError(err.message || 'Failed to submit request');
    }
    
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Request Submitted!</AlertTitle>
          <AlertDescription>
            Your teacher account request has been submitted for review. Once approved by an administrator, 
            you will receive an email at <strong>{email}</strong> with your login credentials.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>What happens next?</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>An administrator will review your request. This typically takes 1-2 business days.</p>
            <p className="text-sm text-muted-foreground">
              Questions? Contact <a href="mailto:simonwang@hkbu.edu.hk" className="text-primary underline">simonwang@hkbu.edu.hk</a>
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="request-name">Full Name</Label>
        <Input
          id="request-name"
          type="text"
          placeholder="Dr. Simon Wang"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="request-email">Email Address</Label>
        <Input
          id="request-email"
          type="email"
          placeholder="simonwang@hkbu.edu.hk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          You'll receive your login credentials at this email once approved
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="section-input">Section Numbers (2 digits each)</Label>
        <div className="flex gap-2">
          <Input
            id="section-input"
            type="text"
            placeholder="e.g., 01"
            value={sectionInput}
            onChange={(e) => setSectionInput(e.target.value.slice(0, 2))}
            onKeyDown={handleKeyDown}
            maxLength={2}
            className="w-24"
          />
          <Button type="button" variant="outline" size="icon" onClick={addSection}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {sections.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sections.map(section => (
              <Badge key={section} variant="secondary" className="gap-1">
                Section {section}
                <button
                  type="button"
                  onClick={() => removeSection(section)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Enter the section numbers you teach. You can add multiple sections.
        </p>
      </div>

      <Alert className="bg-muted/50">
        <Mail className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Your account will be created pending admin approval. Once approved, you'll receive 
          an email with your login credentials. Questions? Email{' '}
          <a href="mailto:simonwang@hkbu.edu.hk" className="text-primary underline">simonwang@hkbu.edu.hk</a>
        </AlertDescription>
      </Alert>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Submit Request
      </Button>
    </form>
  );
}
