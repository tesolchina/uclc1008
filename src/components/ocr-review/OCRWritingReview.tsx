import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Camera, 
  Upload, 
  FileText, 
  Send, 
  Loader2, 
  MessageSquare,
  CheckCircle,
  Edit3,
  Lock,
  RefreshCw,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ocr-writing-review`;

type Message = { role: "user" | "assistant"; content: string };
type Step = "upload" | "edit" | "review";

interface OCRWritingReviewProps {
  weekNumber?: number;
  hourNumber?: number;
}

export function OCRWritingReview({ weekNumber = 4, hourNumber = 3 }: OCRWritingReviewProps) {
  const { studentId } = useAuth();
  const [step, setStep] = useState<Step>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const assignmentKey = `ocr-review-w${weekNumber}h${hourNumber}`;

  // Load chat history on mount
  useEffect(() => {
    if (!studentId) return;
    
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from("assignment_chat_history")
          .select("messages, context_type")
          .eq("student_id", studentId)
          .eq("assignment_key", assignmentKey)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.messages) {
          const savedMessages = data.messages as Message[];
          setMessages(savedMessages);
          
          // Restore step
          if (data.context_type === "review") {
            setStep("review");
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    
    loadHistory();
  }, [studentId, assignmentKey]);

  // Save chat history when messages change
  useEffect(() => {
    if (!studentId || !historyLoaded || messages.length === 0) return;

    async function saveHistory() {
      try {
        await supabase
          .from("assignment_chat_history")
          .upsert({
            student_id: studentId,
            assignment_key: assignmentKey,
            messages: messages,
            week_number: weekNumber,
            hour_number: hourNumber,
            context_type: step,
            updated_at: new Date().toISOString()
          }, {
            onConflict: "student_id,assignment_key"
          });
      } catch (err) {
        console.error("Failed to save chat history:", err);
      }
    }

    const timeout = setTimeout(saveHistory, 1000);
    return () => clearTimeout(timeout);
  }, [messages, studentId, assignmentKey, step, historyLoaded]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      
      // Extract text via OCR
      await extractTextFromImage(base64.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }, []);

  const extractTextFromImage = async (base64Data: string) => {
    setIsExtracting(true);
    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "ocr",
          imageBase64: base64Data,
          studentId,
        }),
      });

      if (!resp.ok) {
        throw new Error("OCR failed");
      }

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      setExtractedText(data.extractedText);
      setEditedText(data.extractedText);
      setStep("edit");
      toast.success("Text extracted! Please review and edit.");

    } catch (err) {
      console.error("OCR error:", err);
      toast.error("Failed to extract text. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!editedText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    setIsLoading(true);
    setStep("review");

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "feedback",
          extractedText: editedText,
          messages: [],
          studentId,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get feedback");
      }

      // Stream response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages([{ role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (assistantContent) {
        setMessages([{ role: "assistant", content: assistantContent }]);
      }

    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to get feedback. Please try again.");
      setStep("edit");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setInput("");

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "chat",
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          studentId,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Chat failed");
      }

      // Stream response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (assistantContent) {
        setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
      }

    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Start over? This will clear your current work.")) {
      setStep("upload");
      setImagePreview(null);
      setExtractedText("");
      setEditedText("");
      setMessages([]);
      toast.success("Ready to start fresh!");
    }
  };

  // Word count
  const wordCount = editedText.trim() ? editedText.trim().split(/\s+/).length : 0;

  // Check login
  if (!studentId) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Lock className="h-5 w-5" />
            Registration Required
          </CardTitle>
          <CardDescription>
            Please register or log in to use the OCR Writing Review tool. Your progress will be saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="default" onClick={() => window.location.href = "/auth"}>
            Register / Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">OCR Writing Review</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          <CardDescription>
            Upload a photo of your handwritten summary, review the OCR text, then get AI feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[
              { id: "upload", label: "Upload Image", icon: Camera },
              { id: "edit", label: "Edit Text", icon: Edit3 },
              { id: "review", label: "AI Review", icon: MessageSquare },
            ].map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isComplete = 
                (s.id === "upload" && step !== "upload") ||
                (s.id === "edit" && step === "review");
              return (
                <Badge
                  key={s.id}
                  variant={isActive ? "default" : "outline"}
                  className={`flex items-center gap-1 ${isComplete ? "bg-green-100 text-green-700 border-green-300" : ""}`}
                >
                  {isComplete ? <CheckCircle className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  {s.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-4">
          {/* Upload Section */}
          {step === "upload" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Your Handwritten Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isExtracting ? (
                    <div className="space-y-2">
                      <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Extracting text...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="font-medium">Click to upload or take a photo</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports JPG, PNG, HEIC (max 10MB)
                      </p>
                    </>
                  )}
                </div>

                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    Take a clear, well-lit photo of your handwritten AWQ summary. 
                    The AI will extract the text for you to review and edit.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Edit Section */}
          {(step === "edit" || step === "review") && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    {step === "edit" ? "Review & Edit Extracted Text" : "Your Summary"}
                  </CardTitle>
                  <Badge variant="outline">{wordCount} words</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded" 
                      className="max-h-48 rounded-lg border object-contain w-full bg-muted"
                    />
                  </div>
                )}
                
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  placeholder="Extracted text will appear here..."
                  className="min-h-[200px]"
                  disabled={step === "review"}
                />

                {step === "edit" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("upload");
                        setImagePreview(null);
                        setExtractedText("");
                        setEditedText("");
                      }}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Upload New
                    </Button>
                    <Button
                      onClick={handleGetFeedback}
                      disabled={isLoading || !editedText.trim()}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      Get AI Feedback
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel: AI Chat */}
        <Card className={`flex flex-col ${step !== "review" ? "opacity-50" : ""}`} style={{ height: "500px" }}>
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Dr. Review - AI Feedback
            </CardTitle>
            <CardDescription>
              {step === "review" 
                ? "Ask follow-up questions about your writing"
                : "Complete the upload and edit steps first"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && step === "review" && !isLoading && (
                  <Alert>
                    <AlertDescription>
                      Getting your AI feedback...
                    </AlertDescription>
                  </Alert>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {step === "review" && (
              <div className="flex-shrink-0 pt-4 border-t mt-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask a follow-up question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (input.trim()) sendMessage(input);
                      }
                    }}
                    className="min-h-[60px] resize-none"
                  />
                  <Button
                    onClick={() => input.trim() && sendMessage(input)}
                    disabled={isLoading || !input.trim()}
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
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
