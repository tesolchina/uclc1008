import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  id?: string;
}

export const CollapsibleSection = ({
  title,
  description,
  icon,
  children,
  defaultOpen = true,
  className,
  headerClassName,
  id,
}: CollapsibleSectionProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Auto-open and scroll when hash matches this section's id
  useEffect(() => {
    if (id && location.hash === `#${id}`) {
      setIsOpen(true);
      // Small delay to allow content to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [id, location.hash]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card id={id} className={cn("card-elevated scroll-mt-20", className)}>
        <CollapsibleTrigger asChild>
          <CardHeader className={cn("pb-3 cursor-pointer select-none hover:bg-muted/30 transition-colors rounded-t-xl", headerClassName)}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {icon}
                  {title}
                </CardTitle>
                {description && <CardDescription className="mt-1">{description}</CardDescription>}
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )} 
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};