import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Loader2, Settings, Sparkles, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DEFAULT_PROMPT = `Evaluate this AWQ summary based on the 5 criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations - 20% each). Provide specific, actionable feedback. Point out strengths first, then areas for improvement. Keep feedback concise and encouraging but honest.`;

export function W4H3PromptSettings() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [originalPrompt, setOriginalPrompt] = useState(DEFAULT_PROMPT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPrompt() {
      try {
        const { data, error } = await supabase
          .from("system_settings")
          .select("value")
          .eq("key", "w4h3_feedback_prompt")
          .maybeSingle();

        if (error) throw error;

        if (data?.value) {
          const valueObj = data.value as { prompt?: string };
          if (valueObj.prompt) {
            setPrompt(valueObj.prompt);
            setOriginalPrompt(valueObj.prompt);
          }
        }
      } catch (err) {
        console.error("Failed to load prompt:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPrompt();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("system_settings")
        .upsert({
          key: "w4h3_feedback_prompt",
          value: { prompt },
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        });

      if (error) throw error;

      setOriginalPrompt(prompt);
      toast.success("Prompt saved successfully!");
    } catch (err) {
      console.error("Failed to save prompt:", err);
      toast.error("Failed to save prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset to the default prompt?")) {
      setPrompt(DEFAULT_PROMPT);
    }
  };

  const hasChanges = prompt !== originalPrompt;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Week 4 Hour 3 - AI Feedback Prompt</CardTitle>
          </div>
          {hasChanges && <Badge variant="secondary">Unsaved changes</Badge>}
        </div>
        <CardDescription>
          Customize the AI feedback prompt for the OCR Writing Review activity. 
          Students upload photos of their handwritten summaries and receive feedback based on this prompt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter instructions for the AI tutor..."
          className="min-h-[150px] font-mono text-sm"
        />
        
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription className="text-xs">
            The AI will use these instructions when reviewing student summaries. 
            Include specific criteria, tone guidance, and feedback structure.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset to Default
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Prompt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
