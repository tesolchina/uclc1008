import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { rubricCategories } from "./rubricData";

export function OverviewSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Analysis Dashboard</h3>
            <img 
              src="/images/feedback-charts/analysis_dashboard.png" 
              alt="Comprehensive analysis dashboard showing word count and citation statistics"
              className="w-full rounded-lg border shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Quality Categories</h3>
            <img 
              src="/images/feedback-charts/quality_categories_stacked.png" 
              alt="Stacked bar chart showing quality categories across submissions"
              className="w-full rounded-lg border shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Word Count Distribution</h3>
            <img 
              src="/images/feedback-charts/word_count_pie_chart.png" 
              alt="Pie chart showing distribution of word counts across submissions"
              className="w-full rounded-lg border shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Citation Usage</h3>
            <img 
              src="/images/feedback-charts/citation_pie_chart.png" 
              alt="Pie chart showing citation usage across submissions"
              className="w-full rounded-lg border shadow-sm"
            />
          </div>
        </div>

        {/* Category Cards */}
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
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
                  {cat.commonProblems.length} issues
                </Badge>
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                  {cat.strengths.length} strengths
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Click each section below to view detailed feedback with examples
        </p>
      </CardContent>
    </Card>
  );
}
