import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Week 1 Hour 1 & 2 teaching content for the tutor agenda
const WEEK1_TOPICS = {
  "skimming": {
    title: "Skimming Techniques",
    hour: 1,
    concepts: [
      "Reading quickly for main ideas and overall structure",
      "Focus on: Title → Abstract → Headings → Topic sentences",
      "Finding the 'gist' (main point) - usually in last sentence of Abstract",
    ],
    testTasks: [
      {
        level: 1,
        type: "concept",
        question: "When skimming an academic article, what should you read FIRST?",
        expectedTopics: ["title", "abstract", "headings"],
        hint: "Think about the structural elements that give you an overview."
      },
      {
        level: 2,
        type: "application",
        question: "If you had 2 minutes to understand what Hong et al. (2022) is about, describe your skimming strategy step by step.",
        expectedTopics: ["title", "abstract", "section headings", "topic sentences", "conclusion"],
        hint: "Consider the order in which you'd read different parts."
      },
      {
        level: 3,
        type: "analysis",
        question: "What's the difference between skimming an empirical paper (like Hong et al.) versus a conceptual paper (like Andrejevic & Selwyn)? How would your strategy differ?",
        expectedTopics: ["imrad", "structure", "methods", "results", "conceptual", "argument"],
        hint: "Think about how the structure of each type affects what you look for."
      }
    ]
  },
  "scanning": {
    title: "Scanning Techniques",
    hour: 1,
    concepts: [
      "Searching for specific information (names, dates, numbers, statistics)",
      "Move eyes quickly looking for keywords",
      "Use text features: bold, italics, headings, tables",
    ],
    testTasks: [
      {
        level: 1,
        type: "concept",
        question: "What is the primary purpose of scanning, and how is it different from skimming?",
        expectedTopics: ["specific information", "quickly", "keywords", "numbers"],
        hint: "Think about WHAT you're looking for in each strategy."
      },
      {
        level: 2,
        type: "application",
        question: "How would you scan Hong et al. (2022) to find the sample size and data collection method?",
        expectedTopics: ["methods section", "participants", "numbers", "380", "questionnaire", "likert"],
        hint: "What keywords and section would you look for?"
      },
      {
        level: 3,
        type: "analysis",
        question: "You need to find evidence that technology affects education. Explain how you'd scan multiple articles efficiently to find relevant statistics or quotes.",
        expectedTopics: ["results", "discussion", "p-value", "significant", "keywords", "abstract"],
        hint: "Consider a systematic approach across multiple sources."
      }
    ]
  },
  "imrad": {
    title: "IMRaD Structure",
    hour: 1,
    concepts: [
      "Introduction, Methods, Results, and Discussion",
      "Introduction: background, research gap, purpose",
      "Methods: participants, procedures, instruments",
      "Results: findings, statistics, tables",
      "Discussion: interpretation, implications, limitations",
    ],
    testTasks: [
      {
        level: 1,
        type: "concept",
        question: "What does IMRaD stand for, and what type of papers use this structure?",
        expectedTopics: ["introduction", "methods", "results", "discussion", "empirical"],
        hint: "Think about papers that collect and analyze data."
      },
      {
        level: 2,
        type: "application",
        question: "If you wanted to find out HOW Hong et al. collected their data, which section would you look in and why?",
        expectedTopics: ["methods", "procedure", "instrument", "questionnaire", "participants"],
        hint: "Each section has a specific purpose."
      },
      {
        level: 3,
        type: "analysis",
        question: "Why do you think the Discussion section comes AFTER Results? What's the logical relationship between them?",
        expectedTopics: ["interpretation", "meaning", "explain", "findings", "implications", "limitations"],
        hint: "Think about what needs to happen before you can discuss something."
      }
    ]
  },
  "paraphrasing": {
    title: "Paraphrasing Strategies",
    hour: 2,
    concepts: [
      "Strategy 1: Synonym replacement (with caution)",
      "Strategy 2: Word form changes (verb → noun)",
      "Strategy 3: Active ↔ Passive voice",
      "Strategy 4: Sentence structure changes",
      "Always include citations - no citation = plagiarism",
    ],
    testTasks: [
      {
        level: 1,
        type: "concept",
        question: "What are the 4 main paraphrasing strategies you learned?",
        expectedTopics: ["synonym", "word form", "voice", "structure", "active", "passive"],
        hint: "Think about the different ways you can change a sentence."
      },
      {
        level: 2,
        type: "application",
        question: "Paraphrase this sentence using at least 2 strategies: 'Researchers collected data from 380 participants using questionnaires.'",
        expectedTopics: ["data was collected", "gathered", "survey", "responses", "individuals"],
        hint: "Try combining voice change with word form changes."
      },
      {
        level: 3,
        type: "analysis",
        question: "Original: 'Facial recognition technology is being introduced across various aspects of public life.' Someone wrote: 'Facial recognition is being introduced across many aspects of public life.' Is this acceptable? Explain why or why not.",
        expectedTopics: ["patchwriting", "plagiarism", "structure", "too close", "change more"],
        hint: "Think about what makes a paraphrase acceptable vs. problematic."
      }
    ]
  },
  "patchwriting": {
    title: "Avoiding Patchwriting",
    hour: 2,
    concepts: [
      "Patchwriting = copying with minor word changes (still plagiarism!)",
      "Must change BOTH words AND structure significantly",
      "Even with citation, patchwriting is not acceptable",
    ],
    testTasks: [
      {
        level: 1,
        type: "concept",
        question: "What is patchwriting and why is it considered plagiarism?",
        expectedTopics: ["minor changes", "copying", "structure same", "plagiarism", "insufficient"],
        hint: "Think about what makes it different from proper paraphrasing."
      },
      {
        level: 2,
        type: "application",
        question: "Look at this attempt: Original: 'Technology impacts education significantly.' Paraphrase: 'Technology affects education greatly.' Is this patchwriting? Explain.",
        expectedTopics: ["yes", "patchwriting", "same structure", "only synonyms", "need structure change"],
        hint: "Check both the words AND the sentence structure."
      },
      {
        level: 3,
        type: "analysis",
        question: "A student includes a citation with their paraphrase, but the paraphrase is very close to the original. They argue it's fine because they cited it. How would you respond?",
        expectedTopics: ["still patchwriting", "citation not enough", "must change significantly", "academic integrity"],
        hint: "Think about what citation alone does and doesn't protect against."
      }
    ]
  }
};

type Message = { role: "system" | "user" | "assistant"; content: string };

interface TutorState {
  currentTaskIndex: number;
  currentLevel: number;
  scores: number[];
  responses: { level: number; response: string; score: number; feedback: string }[];
  phase: "introduction" | "testing" | "complete";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { 
      messages, 
      topicId, 
      studentId, 
      weekNumber,
      hourNumber,
      action,
      tutorState
    } = await req.json();

    const topic = WEEK1_TOPICS[topicId as keyof typeof WEEK1_TOPICS];
    if (!topic) {
      return new Response(
        JSON.stringify({ error: "Invalid topic" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If action is "generate_report", generate the final report
    if (action === "generate_report" && tutorState) {
      const report = await generateReport(topic, tutorState, studentId, weekNumber, hourNumber, topicId, supabase);
      return new Response(
        JSON.stringify(report),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the smart tutor system prompt
    const state: TutorState = tutorState || {
      currentTaskIndex: 0,
      currentLevel: 1,
      scores: [],
      responses: [],
      phase: "introduction"
    };

    const currentTask = topic.testTasks[state.currentTaskIndex];
    const systemPrompt = buildSystemPrompt(topic, state, currentTask);

    // Use Lovable AI
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "X-Tutor-State": JSON.stringify(state)
      },
    });
  } catch (e) {
    console.error("smart-tutor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildSystemPrompt(
  topic: typeof WEEK1_TOPICS[keyof typeof WEEK1_TOPICS],
  state: TutorState,
  currentTask: typeof WEEK1_TOPICS[keyof typeof WEEK1_TOPICS]["testTasks"][0] | undefined
): string {
  const basePrompt = `You are a smart AI tutor for UCLC 1008 University English I, specifically teaching "${topic.title}".

YOUR TEACHING APPROACH:
1. You have an AGENDA with 3 tasks of increasing difficulty (Level 1, 2, 3)
2. After each student response, you EVALUATE their answer and provide feedback
3. You track their performance to generate a final report

KEY CONCEPTS YOU'RE TESTING:
${topic.concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

IMPORTANT RULES:
- Be encouraging but honest about mistakes
- Give specific feedback referencing the concepts
- If student struggles, provide hints from the task
- After evaluating, present the next task OR wrap up if done
- Use [SCORE:X] tag (X = 0-3) in your response to indicate score for this task
  - 0 = No understanding shown
  - 1 = Partial understanding, major gaps
  - 2 = Good understanding, minor issues
  - 3 = Excellent, comprehensive understanding
- Use [NEXT_TASK] tag when moving to the next task
- Use [SESSION_COMPLETE] tag when all 3 tasks are done

CURRENT STATE:
- Tasks completed: ${state.scores.length} of 3
- Current level: ${currentTask?.level || "N/A"}
- Previous scores: ${state.scores.length > 0 ? state.scores.join(", ") : "None yet"}`;

  if (state.phase === "introduction" && state.scores.length === 0) {
    return basePrompt + `

CURRENT PHASE: INTRODUCTION
Start by briefly explaining what you'll be testing (${topic.title}), then present the first task:

TASK 1 (Level ${currentTask?.level}): ${currentTask?.question}
Type: ${currentTask?.type}

After greeting, immediately present Task 1.`;
  }

  if (currentTask) {
    return basePrompt + `

CURRENT PHASE: TESTING
You just received a response to a task. Evaluate it based on these expected topics: ${currentTask.expectedTopics.join(", ")}

CURRENT TASK (Level ${currentTask.level}): ${currentTask.question}
Expected topics in answer: ${currentTask.expectedTopics.join(", ")}
Hint to give if struggling: ${currentTask.hint}

Provide feedback with [SCORE:X] tag, then:
- If more tasks remain, use [NEXT_TASK] and present the next task
- If this was Task 3, use [SESSION_COMPLETE] and summarize their performance`;
  }

  return basePrompt + `

CURRENT PHASE: COMPLETE
All tasks have been completed. Summarize the student's performance and let them know a report will be generated.`;
}

async function generateReport(
  topic: typeof WEEK1_TOPICS[keyof typeof WEEK1_TOPICS],
  state: TutorState,
  studentId: string,
  weekNumber: number,
  hourNumber: number,
  topicId: string,
  supabase: any
) {
  // Calculate star rating (max 9 points = 5 stars)
  const totalScore = state.scores.reduce((a, b) => a + b, 0);
  const maxScore = 9; // 3 tasks × 3 points max
  const starRating = Math.round((totalScore / maxScore) * 10) / 2; // 0-5 in 0.5 increments

  // Generate qualitative report based on performance
  let qualitativeReport = "";
  const avgScore = totalScore / 3;

  if (avgScore >= 2.5) {
    qualitativeReport = `Excellent performance on ${topic.title}! You demonstrated strong understanding of key concepts including ${topic.concepts.slice(0, 2).join(" and ")}. Keep up the great work!`;
  } else if (avgScore >= 1.5) {
    qualitativeReport = `Good progress on ${topic.title}. You showed understanding of the basics but could strengthen your knowledge of ${topic.concepts[topic.concepts.length - 1]}. Consider reviewing the material again.`;
  } else {
    qualitativeReport = `You're building your understanding of ${topic.title}. Focus on practicing ${topic.concepts[0]} and revisiting the key concepts from Hour ${topic.hour}. Don't hesitate to ask questions!`;
  }

  // Add specific feedback based on individual task performance
  const taskFeedback = state.responses.map((r, i) => 
    `Task ${i + 1} (Level ${r.level}): ${r.score}/3`
  ).join(", ");

  qualitativeReport += `\n\nTask breakdown: ${taskFeedback}`;

  // Save to database
  const reportData = {
    student_id: studentId,
    week_number: weekNumber,
    hour_number: hourNumber,
    topic_id: topicId,
    star_rating: starRating,
    qualitative_report: qualitativeReport,
    performance_data: {
      scores: state.scores,
      responses: state.responses,
      total_score: totalScore,
      max_score: maxScore
    },
    tasks_completed: state.scores.length,
    tasks_total: 3
  };

  const { data, error } = await supabase
    .from("ai_tutor_reports")
    .upsert(reportData, { 
      onConflict: "student_id,week_number,hour_number,topic_id" 
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving report:", error);
  }

  return {
    ...reportData,
    id: data?.id,
    topicTitle: topic.title
  };
}
