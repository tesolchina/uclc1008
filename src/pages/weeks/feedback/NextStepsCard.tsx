import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NextStepsCard() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">📚 Next Steps for Summary Writing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>• Review the feedback above and identify 1-2 areas to focus on improving in your summary writing.</p>
        <p>• Practice paraphrasing using the strategies from Week 1 Hour 1 to avoid patchwriting in summaries.</p>
        <p>• Review in-text citation rules from Week 2 Hour 1 — summaries require proper citation of source material.</p>
        <p>• Focus on summary accuracy: ensure all main ideas are included without adding personal opinions.</p>
        <p>• The AWQ (15%) in Week 5 will assess similar summary skills — use this feedback to prepare!</p>
      </CardContent>
    </Card>
  );
}
