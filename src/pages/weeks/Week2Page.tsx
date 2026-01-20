import { week2, week2Meta } from "@/data/weeks/week2";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink, StickyNote } from "lucide-react";
import { useState } from "react";

const classHours = [
  { 
    hour: 1, 
    title: "In-Text Citations (APA 7th)", 
    theme: "Citing sources within summary writing",
    unitCount: 5
  },
  { 
    hour: 2, 
    title: "End-of-Text Citations (Reference List)", 
    theme: "Building APA 7th reference entries",
    unitCount: 5
  },
  { 
    hour: 3, 
    title: "Practice, Feedback & Reflection", 
    theme: "Practice → AI/Peer/Teacher Feedback → Reflect",
    unitCount: 3
  },
];

const ADHOC_NOTES_URL = "https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/edit?tab=t.0";

const Week2Page = () => {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="space-y-6">
      <WeekOverviewTemplate 
        week={week2} 
        meta={week2Meta}
        classHours={classHours}
      />

      {/* Adhoc Notes Section */}
      <div className="max-w-4xl mx-auto">
        <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-amber-500/10 transition-colors pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-amber-600" />
                    Adhoc Notes
                  </CardTitle>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${notesOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Additional notes and materials shared by your instructor for this week.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={ADHOC_NOTES_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Google Docs
                  </a>
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
};

export default Week2Page;
