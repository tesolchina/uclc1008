import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Loader2, Key, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type ApiProvider = "lovable" | "hkbu" | "openrouter" | "bolatu" | "kimi";

interface ApiStatus {
  provider: ApiProvider;
  available: boolean;
  name: string;
}

export default function ApiConfigPage() {
  const { accessToken, isAuthenticated } = useAuth();
  const [checking, setChecking] = useState(true);
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [activeProvider, setActiveProvider] = useState<ApiProvider>("hkbu");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);

  const providers: { id: ApiProvider; name: string; description: string; docUrl?: string }[] = [
    { id: "lovable", name: "Lovable AI", description: "Built-in AI service (auto-configured)" },
    { id: "hkbu", name: "HKBU GenAI", description: "HKBU's GenAI Platform API", docUrl: "https://genai.hkbu.edu.hk" },
    { id: "openrouter", name: "OpenRouter", description: "Access to multiple AI models", docUrl: "https://openrouter.ai" },
    { id: "bolatu", name: "Bolatu (BLT)", description: "Bolatu AI services", docUrl: "https://bolatu.com" },
    { id: "kimi", name: "Kimi", description: "Moonshot AI's Kimi", docUrl: "https://kimi.moonshot.cn" },
  ];

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-api-status", {
        body: { accessToken },
      });
      if (error) throw error;
      
      setApiStatuses(data?.statuses || []);
    } catch (err) {
      console.error("Failed to check API status:", err);
      // Default to showing Lovable AI as available
      setApiStatuses([{ provider: "lovable", available: true, name: "Lovable AI" }]);
    } finally {
      setChecking(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("save-api-key", {
        body: { provider: activeProvider, apiKey: apiKey.trim(), accessToken },
      });

      if (error) {
        throw new Error(error.message || "Failed to save API key");
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const providerName = providers.find(p => p.id === activeProvider)?.name;
      if (data?.savedToHkbu) {
        toast.success(`${providerName} API key saved to HKBU platform ✓`, {
          description: "Your key is now stored on the remote platform and synced across devices.",
        });
      } else {
        toast.success(`${providerName} API key saved locally`, {
          description: "Key stored locally. Sign in with HKBU to sync across devices.",
        });
      }
      setApiKey("");
      checkApiStatus();
    } catch (err: any) {
      console.error("Failed to save API key:", err);
      toast.error(err.message || "Failed to save API key");
    } finally {
      setSaving(false);
    }
  };

  const getStatusForProvider = (providerId: ApiProvider) => {
    return apiStatuses.find(s => s.provider === providerId);
  };

  const hasAnyActiveApi = apiStatuses.some(s => s.available);

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">API Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Configure AI services for the learning platform
        </p>
      </div>

      {/* Status Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI Services Status
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
                No API Configured
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {hasAnyActiveApi 
              ? "AI features are enabled with the following providers"
              : "Configure at least one API provider to enable AI features"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const status = getStatusForProvider(provider.id);
              const isAvailable = status?.available || false;
              
              return (
                <div
                  key={provider.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    isAvailable 
                      ? "border-green-500/30 bg-green-500/5" 
                      : "border-border bg-muted/30"
                  }`}
                >
                  {isAvailable ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{provider.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{provider.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configure API Keys
          </CardTitle>
          <CardDescription>
            Add or update API keys for different AI providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeProvider} onValueChange={(v) => setActiveProvider(v as ApiProvider)}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 h-auto">
              {providers.filter(p => p.id !== "lovable").map((provider) => (
                <TabsTrigger key={provider.id} value={provider.id} className="text-xs px-2 py-1.5">
                  {provider.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {providers.filter(p => p.id !== "lovable").map((provider) => (
              <TabsContent key={provider.id} value={provider.id} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${provider.id}-key`}>{provider.name} API Key</Label>
                    {provider.docUrl && (
                      <a
                        href={provider.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Get API Key <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <Input
                    id={`${provider.id}-key`}
                    type="password"
                    placeholder={`Enter your ${provider.name} API key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{provider.description}</p>
                </div>
                <Button onClick={handleSaveApiKey} disabled={saving || !apiKey.trim()}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {saving ? "Validating..." : "Validate & Save API Key"}
                </Button>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <Button variant="outline" size="sm" onClick={checkApiStatus} disabled={checking}>
          {checking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Refresh Status
        </Button>
      </div>
    </div>
  );
}
