export interface RubricGrade {
  grade: string;
  score: string;
  criteria: string[];
}

export interface RubricTableData {
  grades: RubricGrade[];
}

// Summary Accuracy rubric
export const summaryAccuracyRubric: RubricTableData = {
  grades: [
    {
      grade: "A/A-",
      score: "19-18-17-16",
      criteria: [
        "Includes all the main ideas from the original text without omission",
        "Free from personal bias or unsupported claims",
        "No distortion, exaggeration, or oversimplification of the original meaning"
      ]
    },
    {
      grade: "B+/B/B-",
      score: "15-14-13",
      criteria: [
        "Captures most of the main ideas",
        "No personal views are included",
        "May include some unnecessary details",
        "May contain minor inaccuracies in wording or emphasis"
      ]
    },
    {
      grade: "C+/C/C-",
      score: "12-11-10",
      criteria: [
        "Omits multiple main ideas",
        "May occasionally include personal views",
        "Includes irrelevant details or unsupported claims",
        "Contains inaccuracies resulting in misinterpretation"
      ]
    },
    {
      grade: "D/F",
      score: "9 or below",
      criteria: [
        "Makes significant omissions or fabricates claims",
        "Greatly distorts or oversimplifies the original meaning"
      ]
    }
  ]
};

// Paraphrasing rubric
export const paraphrasingRubric: RubricTableData = {
  grades: [
    {
      grade: "A/A-",
      score: "19-18-17-16",
      criteria: [
        "Fully reworded in student's own voice",
        "No direct copying of phrases or sentence structures",
        "Accurately conveys original idea without distortion"
      ]
    },
    {
      grade: "B+/B/B-",
      score: "15-14-13",
      criteria: [
        "Mostly original phrasing",
        "Meaning is generally correct",
        "May contain near-identical sentence structures",
        "May lose nuance or include minor inaccuracies"
      ]
    },
    {
      grade: "C+/C/C-",
      score: "12-11-10",
      criteria: [
        "Relies on source's phrasing and structures",
        "May distort or oversimplify original ideas"
      ]
    },
    {
      grade: "D/F",
      score: "9 or below",
      criteria: [
        "Direct copying without paraphrasing",
        "Heavy reliance on source phrasing"
      ]
    }
  ]
};

// Academic Tone rubric
export const academicToneRubric: RubricTableData = {
  grades: [
    {
      grade: "A/A-",
      score: "19-18-17-16",
      criteria: [
        "Formal tone with no informal language",
        "Sentences are clear, logically structured, free of ambiguity",
        "Smooth transitions between ideas",
        "Well-structured with clear thesis and topic sentences"
      ]
    },
    {
      grade: "B+/B/B-",
      score: "15-14-13",
      criteria: [
        "Predominantly formal with some lapses",
        "Sentences generally logically structured",
        "Some transitions may be abrupt",
        "Thesis present but may be imprecise"
      ]
    },
    {
      grade: "C+/C/C-",
      score: "12-11-10",
      criteria: [
        "Frequent use of informal phrasing",
        "Ideas may be hard to follow",
        "Awkward or disjointed transitions",
        "Thesis statement is vague"
      ]
    },
    {
      grade: "D/F",
      score: "9 or below",
      criteria: [
        "Overly casual or text-message style",
        "Ideas consistently unclear",
        "Thesis statement missing or incoherent"
      ]
    }
  ]
};

// In-text Citation rubric
export const citationRubric: RubricTableData = {
  grades: [
    {
      grade: "A/A-",
      score: "19-18-17-16",
      criteria: [
        "Correct use of signal phrases and quotations",
        "No missing or misplaced citations",
        "All secondary citations correctly cited",
        "Fully follows APA referencing style"
      ]
    },
    {
      grade: "B+/B/B-",
      score: "15-14-13",
      criteria: [
        "May occasionally forget page numbers or quotation marks",
        "Most sources correctly cited",
        "Minor errors in APA style (punctuation, etc.)"
      ]
    },
    {
      grade: "C+/C/C-",
      score: "12-11-10",
      criteria: [
        "No citations for some direct quotations",
        "Some sources correctly cited",
        "Some errors in APA style (missing years, etc.)"
      ]
    },
    {
      grade: "D/F",
      score: "9 or below",
      criteria: [
        "Citations rarely seen or absent",
        "Citations do not follow APA style"
      ]
    }
  ]
};

export const rubricTableMap: Record<string, RubricTableData> = {
  "summary-accuracy": summaryAccuracyRubric,
  "paraphrasing": paraphrasingRubric,
  "academic-tone": academicToneRubric,
  "in-text-citation": citationRubric
};
