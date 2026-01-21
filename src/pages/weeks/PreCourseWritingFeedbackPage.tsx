import { RubricSection, OverviewSection, NextStepsCard, InsightsMCSection, rubricCategories } from "./feedback";

export default function PreCourseWritingFeedbackPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/week/2" className="hover:underline">Week 2</a>
          <span>/</span>
          <span>Feedback</span>
        </div>
        <h1 className="text-2xl font-bold">Pre-course Writing Feedback (Summary)</h1>
        <p className="text-muted-foreground">
          Common patterns, areas for improvement, and examples of good practice from your summary submissions.
        </p>
      </div>

      {/* Overview Visualization (Toggleable) */}
      <OverviewSection />

      {/* Rubric Sections with Tables */}
      <div className="space-y-4">
        {rubricCategories.map((category) => (
          <RubricSection key={category.id} category={category} />
        ))}
      </div>

      {/* MC Tasks for Actionable Insights */}
      <InsightsMCSection />

      {/* Next Steps */}
      <NextStepsCard />
    </div>
  );
}
