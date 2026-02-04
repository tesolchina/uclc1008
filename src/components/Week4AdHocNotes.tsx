import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, FileText } from "lucide-react";

const GOOGLE_DOC_EMBED_URL = "https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/preview";

export const Week4AdHocNotes = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-amber-100/50 transition-colors py-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600" />
                Ad Hoc Notes & Updates
              </span>
              <ChevronDown className={`h-4 w-4 text-amber-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="rounded-md overflow-hidden border border-amber-200">
              <iframe
                src={GOOGLE_DOC_EMBED_URL}
                className="w-full h-[400px]"
                title="Week 4 Ad Hoc Notes"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
