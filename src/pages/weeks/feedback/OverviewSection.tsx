import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BarChart3, ChevronDown } from "lucide-react";
import { useState } from "react";
import { rubricCategories } from "./rubricData";
import { ImageLightbox } from "./ImageLightbox";

export function OverviewSection() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Overview
              </CardTitle>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Analysis Dashboard</h3>
                <ImageLightbox 
                  src="/images/feedback-charts/analysis_dashboard.png" 
                  alt="Comprehensive analysis dashboard showing word count and citation statistics"
                  className="w-full rounded-lg border shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Quality Categories</h3>
                <ImageLightbox 
                  src="/images/feedback-charts/quality_categories_stacked.png" 
                  alt="Stacked bar chart showing quality categories across submissions"
                  className="w-full rounded-lg border shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Word Count Distribution</h3>
                <ImageLightbox 
                  src="/images/feedback-charts/word_count_pie_chart.png" 
                  alt="Pie chart showing distribution of word counts across submissions"
                  className="w-full rounded-lg border shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Citation Usage</h3>
                <ImageLightbox 
                  src="/images/feedback-charts/citation_pie_chart.png" 
                  alt="Pie chart showing citation usage across submissions"
                  className="w-full rounded-lg border shadow-sm"
                />
              </div>
            </div>

            {/* Category Cards with Weighting */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              {rubricCategories.map((cat) => (
                <div 
                  key={cat.id}
                  className="p-4 rounded-lg bg-muted/30 border text-center"
                >
                  <div className="text-primary mb-2 flex justify-center">
                    {cat.icon}
                  </div>
                  <p className="font-medium text-sm">{cat.title}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                    20%
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click each section below to practice with MC tasks based on common issues and strengths
            </p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
