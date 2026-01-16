import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, TrendingUp, Loader2, RefreshCw } from "lucide-react";

interface AiTutorRatingProps {
  weekNumber: number;
  studentId: string;
  completedTasks: string[];
  totalTasks: number;
}

type RatingLevel = "strong" | "developing" | "needs-practice";

interface RatingResult {
  level: RatingLevel;
  message: string;
  recommendations: string[];
}

export function AiTutorRating({ weekNumber, studentId, completedTasks, totalTasks }: AiTutorRatingProps) {
  const [rating, setRating] = useState<RatingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateRating = async () => {
    setIsLoading(true);
    
    try {
      const completionRate = (completedTasks.length / totalTasks) * 100;
      
      // Build prompt for AI rating
      const prompt = `You are an academic writing tutor assessing a student's practice session performance.

Week ${weekNumber} Practice Session Results:
- Tasks completed: ${completedTasks.length} out of ${totalTasks}
- Completion rate: ${completionRate.toFixed(0)}%
- Skills practiced: Skimming, Scanning, Paraphrasing, Integrated Practice

Based on this completion rate, provide:
1. A rating: "Strong" (80%+), "Developing" (50-79%), or "Needs Practice" (<50%)
2. A brief encouraging message (1-2 sentences)
3. Exactly 2 specific recommendations for improvement

Format your response EXACTLY as JSON:
{
  "level": "strong|developing|needs-practice",
  "message": "Your encouraging message here",
  "recommendations": ["First recommendation", "Second recommendation"]
}`;

      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [{ role: "user", content: prompt }],
          meta: { weekTitle: `Week ${weekNumber}`, theme: "Practice Rating", aiPromptHint: "rating" },
          studentId
        }
      });

      if (response.data) {
        // Parse the AI response
        const responseText = response.data.content || response.data;
        try {
          // Extract JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setRating({
              level: parsed.level as RatingLevel,
              message: parsed.message,
              recommendations: parsed.recommendations || []
            });
          } else {
            // Fallback rating based on completion
            setRating({
              level: completionRate >= 80 ? "strong" : completionRate >= 50 ? "developing" : "needs-practice",
              message: completionRate >= 80 
                ? "Excellent work! You've shown strong understanding of the key skills."
                : completionRate >= 50
                ? "Good progress! Keep practicing to strengthen your skills."
                : "Keep going! Practice makes perfect.",
              recommendations: [
                "Review the skill summaries before your next session",
                "Try the paraphrasing practice again with a different paragraph"
              ]
            });
          }
        } catch {
          // Fallback on parse error
          setRating({
            level: completionRate >= 80 ? "strong" : completionRate >= 50 ? "developing" : "needs-practice",
            message: "Great effort on completing the practice session!",
            recommendations: [
              "Continue practicing paraphrasing with different texts",
              "Apply skimming techniques to your course readings"
            ]
          });
        }
      }
    } catch (error) {
      console.error("Error generating rating:", error);
      // Provide a fallback rating
      const completionRate = (completedTasks.length / totalTasks) * 100;
      setRating({
        level: completionRate >= 80 ? "strong" : completionRate >= 50 ? "developing" : "needs-practice",
        message: "You've completed the practice session. Keep up the good work!",
        recommendations: [
          "Review the concepts you found challenging",
          "Practice paraphrasing with new texts"
        ]
      });
    } finally {
      setIsLoading(false);
      setHasGenerated(true);
    }
  };

  const getRatingColor = (level: RatingLevel) => {
    switch (level) {
      case "strong": return "text-green-600 bg-green-100";
      case "developing": return "text-yellow-600 bg-yellow-100";
      case "needs-practice": return "text-orange-600 bg-orange-100";
    }
  };

  const getRatingIcon = (level: RatingLevel) => {
    switch (level) {
      case "strong": return <Trophy className="h-5 w-5" />;
      case "developing": return <TrendingUp className="h-5 w-5" />;
      case "needs-practice": return <Star className="h-5 w-5" />;
    }
  };

  const getRatingLabel = (level: RatingLevel) => {
    switch (level) {
      case "strong": return "Strong";
      case "developing": return "Developing";
      case "needs-practice": return "Needs Practice";
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Practice Rating
        </CardTitle>
        <CardDescription>
          Get personalized feedback on your Week {weekNumber} practice performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasGenerated ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              You've completed {completedTasks.length} of {totalTasks} tasks.
              Get your AI-generated performance rating!
            </p>
            <Button onClick={generateRating} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Get My Rating
                </>
              )}
            </Button>
          </div>
        ) : rating ? (
          <div className="space-y-4">
            {/* Rating Badge */}
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getRatingColor(rating.level)}`}>
                {getRatingIcon(rating.level)}
                <span className="font-semibold">{getRatingLabel(rating.level)}</span>
              </div>
            </div>

            {/* Message */}
            <div className="text-center">
              <p className="text-sm">{rating.message}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recommendations for Week {weekNumber + 1}
              </p>
              <ul className="text-sm space-y-1">
                {rating.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Regenerate button */}
            <div className="text-center">
              <Button variant="outline" size="sm" onClick={generateRating} disabled={isLoading}>
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Rating
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default AiTutorRating;
