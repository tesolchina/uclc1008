import { useApiKeyStatus } from '@/contexts/ApiKeyContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Key, Zap, AlertTriangle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ApiKeyStatusIndicator() {
  const { hasPersonalKey, isLoading, studentId, sharedUsage } = useApiKeyStatus();
  const navigate = useNavigate();

  // Don't show if no student ID or still loading
  if (!studentId || isLoading) {
    return null;
  }

  const goToSettings = () => navigate('/settings');

  if (hasPersonalKey) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className="gap-1.5 cursor-pointer bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20"
              onClick={goToSettings}
            >
              <Key className="h-3 w-3" />
              <span className="hidden sm:inline">HKBU API</span>
              <span className="sm:hidden">API</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-medium">✓ Your HKBU API Key is Active</p>
            <p className="text-xs text-muted-foreground mt-1">
              Unlimited AI features enabled. All responses use your personal key.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Using shared API
  const remaining = sharedUsage ? Math.max(0, sharedUsage.limit - sharedUsage.used) : null;
  const isLow = remaining !== null && remaining <= 10;
  const isEmpty = remaining === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={`gap-1.5 h-7 px-2 ${
              isEmpty 
                ? 'text-destructive hover:text-destructive' 
                : isLow 
                  ? 'text-amber-600 hover:text-amber-700' 
                  : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={goToSettings}
          >
            {isEmpty ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Zap className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">
              {remaining !== null ? `${remaining}/${sharedUsage?.limit}` : 'Shared'}
            </span>
            <Settings className="h-3 w-3 opacity-50" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium flex items-center gap-1.5">
            {isEmpty ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                Daily Limit Reached
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Using Shared AI ({remaining} requests left today)
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isEmpty 
              ? 'Set up your HKBU API key to continue using AI features.'
              : 'Add your HKBU API key for unlimited access.'}
          </p>
          <p className="text-xs text-primary mt-1.5 font-medium">
            Click to set up your API key →
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
