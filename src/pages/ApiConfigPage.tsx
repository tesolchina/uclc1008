import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, Key, ExternalLink, LogOut, Trash2, Send, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProcessLogPanel } from "@/components/ProcessLogPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

type ApiProvider = "hkbu" | "openrouter" | "bolatu" | "kimi";

interface ApiStatus {
  provider: ApiProvider;
  available: boolean;
  name: string;
  source?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ApiConfigPage() {
  const { accessToken, isAuthenticated, isLoading: authLoading, profile, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ApiProvider>("hkbu");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);
  
  // Chat test state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  
  // Generate a unique session ID for log filtering
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const providers: { id: ApiProvider; name: string; description: string; docUrl?: string }[] = [
    { id: "hkbu", name: "HKBU GenAI", description: "HKBU's GenAI Platform API", docUrl: "https://genai.hkbu.edu.hk" },
    { id: "openrouter", name: "OpenRouter", description: "Access to multiple AI models", docUrl: "https://openrouter.ai" },
    { id: "bolatu", name: "Bolatu (BLT)", description: "Bolatu AI services", docUrl: "https://bolatu.com" },
    { id: "kimi", name: "Kimi", description: "Moonshot AI's Kimi", docUrl: "https://kimi.moonshot.cn" },
  ];

  const checkApiStatus = async (token: string | null) => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-api-status", {
        body: { accessToken: token, sessionId },
      });
      if (error) throw error;
      
      setApiStatuses(data?.statuses || []);
    } catch (err) {
      console.error("Failed to check API status:", err);
      setApiStatuses([]);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    checkApiStatus(accessToken);
  }, [accessToken, isAuthenticated, authLoading]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("save-api-key", {
        body: { provider: selectedProvider, apiKey: apiKey.trim(), accessToken, sessionId },
      });

      if (error) throw new Error(error.message || "Failed to save API key");
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const providerName = providers.find(p => p.id === selectedProvider)?.name;
      if (data?.savedToHkbu) {
        toast.success(`${providerName} API key saved to HKBU platform ✓`);
      } else {
        toast.success(`${providerName} API key saved locally`);
      }
      setApiKey("");
      checkApiStatus(accessToken);
    } catch (err: any) {
      console.error("Failed to save API key:", err);
      toast.error(err.message || "Failed to save API key");
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeApiKey = async (provider: ApiProvider) => {
    setRevoking(true);
    try {
      const { data, error } = await supabase.functions.invoke("revoke-api-key", {
        body: { provider, accessToken, sessionId },
      });

      if (error) throw new Error(error.message || "Failed to revoke API key");
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const providerName = providers.find(p => p.id === provider)?.name;
      toast.success(`${providerName} API key revoked`);
      checkApiStatus(accessToken);
    } catch (err: any) {
      console.error("Failed to revoke API key:", err);
      toast.error(err.message || "Failed to revoke API key");
    } finally {
      setRevoking(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = { role: "user", content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({ role: m.role, content: m.content })),
          accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setChatMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return [...prev.slice(0, -1), { role: "assistant", content: assistantContent }];
                  }
                  return [...prev, { role: "assistant", content: assistantContent }];
                });
              }
            } catch {}
          }
        }
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusForProvider = (providerId: ApiProvider) => {
    return apiStatuses.find(s => s.provider === providerId);
  };

  // Find the first configured provider
  const configuredProvider = apiStatuses.find(s => s.available);
  const hasAnyActiveApi = !!configuredProvider;

  return (
    <div className="container max-w-4xl py-8">
      {/* Header with Sign Out */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure AI services for the learning platform
          </p>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{profile?.display_name || profile?.email}</p>
              <p className="text-xs text-muted-foreground">Signed in with HKBU</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Status Overview - Simplified */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI Service Status
            {checking ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : hasAnyActiveApi ? (
              <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-500/20 text-red-600 border-red-500/30">
                <XCircle className="h-3 w-3 mr-1" />
                Not Configured
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {hasAnyActiveApi 
              ? `Using ${configuredProvider?.name} for AI features`
              : "Configure an API provider to enable AI features"
            }
          </CardDescription>
        </CardHeader>
        {hasAnyActiveApi && configuredProvider && (
          <CardContent>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{configuredProvider.name}</p>
                <p className="text-sm text-muted-foreground">
                  {configuredProvider.source === "hkbu_platform" 
                    ? "Synced from HKBU platform" 
                    : "Stored locally"
                  }
                </p>
              </div>
              {isAuthenticated && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Revoke
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke {configuredProvider.name} API Key?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove your API key. You'll need to configure a new key to use AI features.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleRevokeApiKey(configuredProvider.provider)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {revoking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Revoke Key
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* API Key Configuration - Only show when authenticated AND no API configured */}
      {isAuthenticated && !hasAnyActiveApi && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configure API Key
            </CardTitle>
            <CardDescription>
              Select a provider and enter your API key (only one provider can be active)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label>Select Provider</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {providers.map((provider) => (
                  <Button
                    key={provider.id}
                    variant={selectedProvider === provider.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedProvider(provider.id)}
                    className="justify-start"
                  >
                    {provider.name.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="api-key">
                  {providers.find(p => p.id === selectedProvider)?.name} API Key
                </Label>
                {providers.find(p => p.id === selectedProvider)?.docUrl && (
                  <a
                    href={providers.find(p => p.id === selectedProvider)?.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Get API Key <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <Input
                id="api-key"
                type="password"
                placeholder={`Enter your ${providers.find(p => p.id === selectedProvider)?.name} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {providers.find(p => p.id === selectedProvider)?.description}
              </p>
            </div>

            <Button onClick={handleSaveApiKey} disabled={saving || !apiKey.trim()}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {saving ? "Validating..." : "Validate & Save API Key"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sign in prompt when not authenticated */}
      {!isAuthenticated && !hasAnyActiveApi && (
        <Card className="mb-6 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Configure API Key
            </CardTitle>
            <CardDescription>
              Sign in with your HKBU account to configure an API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              API key configuration requires authentication. Please sign in to add or manage your AI service API key.
            </p>
            <Button asChild>
              <a href="/auth">Sign In with HKBU</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Test Chat UI - Only show when API is configured */}
      {hasAnyActiveApi && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Test AI Chat
            </CardTitle>
            <CardDescription>
              Send a test message to verify your API configuration is working
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[200px] rounded-lg border bg-muted/30 p-4">
              {chatMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Send a message to test the AI connection
                </p>
              ) : (
                <div className="space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Type a test message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendTestMessage()}
                disabled={chatLoading}
              />
              <Button onClick={handleSendTestMessage} disabled={chatLoading || !chatInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatMessages([])}
              disabled={chatMessages.length === 0}
            >
              Clear Chat
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 text-center">
        <Button variant="outline" size="sm" onClick={() => checkApiStatus(accessToken)} disabled={checking}>
          {checking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Refresh Status
        </Button>
      </div>

      {/* Real-time Process Log Panel */}
      <ProcessLogPanel sessionId={sessionId} />
    </div>
  );
}
