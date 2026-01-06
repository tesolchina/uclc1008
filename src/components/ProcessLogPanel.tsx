import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Trash2, Terminal } from "lucide-react";

interface ProcessLog {
  id: string;
  operation: string;
  step: string;
  status: string;
  message: string;
  details: unknown;
  session_id: string | null;
  created_at: string;
}

interface ProcessLogPanelProps {
  sessionId?: string;
  maxLogs?: number;
}

export function ProcessLogPanel({ sessionId, maxLogs = 50 }: ProcessLogPanelProps) {
  const [logs, setLogs] = useState<ProcessLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial logs
    const fetchLogs = async () => {
      let query = supabase
        .from("process_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(maxLogs);
      
      if (sessionId) {
        query = query.eq("session_id", sessionId);
      }

      const { data } = await query;
      if (data) {
        setLogs(data.reverse());
      }
    };

    fetchLogs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("process-logs-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "process_logs",
        },
        (payload) => {
          const newLog = payload.new as ProcessLog;
          // Filter by session if specified
          if (!sessionId || newLog.session_id === sessionId) {
            setLogs((prev) => {
              const updated = [...prev, newLog];
              // Keep only last maxLogs
              return updated.slice(-maxLogs);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, maxLogs]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  const clearLogs = async () => {
    const { error } = await supabase
      .from("process_logs")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
    
    if (!error) {
      setLogs([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "error":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case "save-api-key":
        return "text-purple-500";
      case "check-api-status":
        return "text-cyan-500";
      case "revoke-api-key":
        return "text-orange-500";
      case "oauth":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const ms = date.getMilliseconds().toString().padStart(3, "0");
    return `${time}.${ms}`;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Terminal className="h-4 w-4" />
            Process Log
            <Badge variant="secondary" className="ml-1">
              {logs.length}
            </Badge>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        {isOpen && logs.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearLogs} className="gap-1 text-muted-foreground">
            <Trash2 className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-3">
        <div className="rounded-lg border bg-black/95 text-sm font-mono">
          <ScrollArea className="h-64" ref={scrollRef}>
            <div className="p-3 space-y-1">
              {logs.length === 0 ? (
                <div className="text-muted-foreground text-center py-8">
                  No logs yet. Perform an API operation to see real-time logs.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2 text-xs leading-relaxed">
                    <span className="text-muted-foreground shrink-0">
                      {formatTime(log.created_at)}
                    </span>
                    <span className={`shrink-0 ${getOperationColor(log.operation)}`}>
                      [{log.operation}]
                    </span>
                    <Badge variant="outline" className={`shrink-0 text-[10px] px-1 py-0 ${getStatusColor(log.status)}`}>
                      {log.step}
                    </Badge>
                    <span className="text-foreground/90">{log.message}</span>
                    {log.details && typeof log.details === "object" && Object.keys(log.details as object).length > 0 && (
                      <span className="text-muted-foreground">
                        {JSON.stringify(log.details)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
