import { FileText, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";
import type { RubricCategory } from "./types";

export const rubricCategories: RubricCategory[] = [
  {
    id: "summary-accuracy",
    title: "Summary Accuracy",
    icon: <FileText className="h-5 w-5" />,
    rubricDescription: "The summary accurately captures the main ideas and key supporting details from the source text. All essential information is included without distortion or misrepresentation. The summary maintains the original meaning and intent of the source.",
    commonProblems: [
      {
        title: "Missing key points",
        example: "The summary only mentions FRT for security but omits attendance monitoring and online learning verification.",
        suggestion: "Ensure all major applications mentioned in the source are included."
      },
      {
        title: "Adding personal opinions",
        example: "FRT is clearly dangerous and should be banned from schools.",
        suggestion: "A summary should only report what the source says, not your views."
      },
      {
        title: "Factual errors",
        example: "Schools spend $27 billion on security (actual figure: $2.7 billion).",
        suggestion: "Double-check numbers and facts when including them in your summary."
      },
      {
        title: "Overgeneralization",
        example: "All schools use facial recognition instead of some schools are adopting...",
        suggestion: "Preserve the hedging language used in the original source."
      },
      {
        title: "Missing the main argument",
        example: "Listing applications without explaining the author's critical perspective on FRT.",
        suggestion: "Identify and include the author's central thesis or argument."
      }
    ],
    strengths: [
      {
        title: "Comprehensive coverage",
        example: "The summary covers all four applications: security, attendance, online verification, and engagement monitoring."
      },
      {
        title: "Accurate representation",
        example: "Correctly states that FRT is most prevalent in the US and includes the $2.7 billion figure."
      },
      {
        title: "Balanced perspective",
        example: "Captures both the stated benefits and the critical concerns raised by the authors."
      }
    ]
  },
  {
    id: "paraphrasing",
    title: "Paraphrasing",
    icon: <TrendingUp className="h-5 w-5" />,
    rubricDescription: "Ideas from the source are expressed in the student's own words using different vocabulary and sentence structures. Direct copying is avoided. The paraphrased content maintains the original meaning while demonstrating language transformation skills.",
    commonProblems: [
      {
        title: "Patchwriting (light editing)",
        example: "Original: 'school shooting incidents have prompted school authorities' → 'school shooting events have caused school authorities' (only changing 2 words)",
        suggestion: "Change both vocabulary AND sentence structure. Try starting the sentence differently."
      },
      {
        title: "Copying unique phrases",
        example: "Using 'all-seeing shield' or 'normalisation of surveillance' without quotation marks.",
        suggestion: "If a phrase is distinctive, either quote it or find a completely different way to express it."
      },
      {
        title: "Same sentence structure",
        example: "Original uses 'While X, Y...' and paraphrase also uses 'While X, Y...'",
        suggestion: "Restructure: try passive voice, start with a different clause, or combine sentences."
      },
      {
        title: "Word-for-word segments",
        example: "Multiple consecutive words copied directly from the source.",
        suggestion: "Read the source, close it, then write from memory. Then check for accuracy."
      },
      {
        title: "Insufficient transformation",
        example: "Only changing verbs to synonyms while keeping the rest identical.",
        suggestion: "Aim for at least 70% different words and a different sentence structure."
      }
    ],
    strengths: [
      {
        title: "Complete restructuring",
        example: "Original: 'Facial recognition systems have now been sold to thousands of US schools' → 'Thousands of American educational institutions have purchased technology that identifies students by their faces.'"
      },
      {
        title: "Effective synonym use",
        example: "'school authorities' → 'education administrators'; 'campus security' → 'on-site safety measures'"
      },
      {
        title: "Voice and structure changes",
        example: "Changing from active to passive voice, or combining multiple source sentences into one."
      }
    ]
  },
  {
    id: "academic-tone",
    title: "Academic Tone & Clarity",
    icon: <BarChart3 className="h-5 w-5" />,
    rubricDescription: "The writing uses formal academic register with appropriate vocabulary. Sentences are clear, well-structured, and grammatically correct. The text flows logically with appropriate transitions between ideas.",
    commonProblems: [
      {
        title: "Informal language",
        example: "FRT is a really big deal in schools nowadays.",
        suggestion: "Use formal alternatives: 'FRT has become increasingly significant in educational settings.'"
      },
      {
        title: "Vague expressions",
        example: "'A lot of schools' or 'many things' instead of specific language.",
        suggestion: "Be precise: 'numerous schools' or 'thousands of US schools' (citing the source)."
      },
      {
        title: "Run-on sentences",
        example: "A 60+ word sentence with multiple ideas connected by 'and' repeatedly.",
        suggestion: "Break into shorter sentences. Each sentence should have one main idea."
      },
      {
        title: "Grammatical errors",
        example: "Subject-verb agreement issues, tense inconsistency, article errors.",
        suggestion: "Proofread carefully. Read aloud to catch errors."
      },
      {
        title: "Missing transitions",
        example: "Jumping between ideas without connecting words (e.g., 'Furthermore,' 'However,' 'In addition').",
        suggestion: "Use transitional phrases to show relationships between ideas."
      }
    ],
    strengths: [
      {
        title: "Formal vocabulary",
        example: "Using 'implement,' 'utilize,' 'significant,' and 'facilitate' appropriately."
      },
      {
        title: "Clear sentence structure",
        example: "Each sentence conveys one main idea with proper subordination and coordination."
      },
      {
        title: "Logical flow",
        example: "Ideas progress from general (what FRT is) to specific (applications) to evaluation (concerns)."
      }
    ]
  },
  {
    id: "in-text-citation",
    title: "In-Text Citation",
    icon: <CheckCircle2 className="h-5 w-5" />,
    rubricDescription: "In-text citations follow APA 7th edition format correctly. Citations are placed appropriately to attribute ideas to the source. Both author-prominent (narrative) and information-prominent (parenthetical) styles are used correctly.",
    commonProblems: [
      {
        title: "Missing citations",
        example: "Stating facts from the article without any citation.",
        suggestion: "Every idea from the source needs a citation, even if paraphrased."
      },
      {
        title: "Incorrect format",
        example: "'Andrejevic, Selwyn (2020)' or '(Andrejevic and Selwyn, 2020)'",
        suggestion: "Use 'Andrejevic and Selwyn (2020)' for narrative or '(Andrejevic & Selwyn, 2020)' for parenthetical."
      },
      {
        title: "Citation at wrong position",
        example: "'(Andrejevic & Selwyn, 2020) FRT is used in schools.'",
        suggestion: "Citation comes after the information, before the period: 'FRT is used in schools (Andrejevic & Selwyn, 2020).'"
      },
      {
        title: "Inconsistent style",
        example: "Mixing '&' and 'and' incorrectly, or inconsistent comma usage.",
        suggestion: "Use 'and' in narrative citations, '&' in parenthetical citations."
      },
      {
        title: "Over-citation",
        example: "Adding '(Andrejevic & Selwyn, 2020)' after every single sentence.",
        suggestion: "If consecutive sentences are from the same source, cite once at the end of the paragraph or when the source changes."
      }
    ],
    strengths: [
      {
        title: "Correct APA format",
        example: "According to Andrejevic and Selwyn (2020), FRT is increasingly used in educational contexts."
      },
      {
        title: "Variety of citation styles",
        example: "Using both author-prominent and information-prominent citations throughout the summary."
      },
      {
        title: "Strategic placement",
        example: "Citations placed at key points where source attribution is most needed, not repetitively."
      }
    ]
  }
];
