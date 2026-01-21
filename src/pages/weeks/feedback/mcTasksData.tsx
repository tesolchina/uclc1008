import { MCTaskProps } from "./MCTask";

// Generate MC tasks from problems - students identify what's wrong
export const summaryAccuracyTasks: MCTaskProps[] = [
  {
    question: "What is the problem with this summary excerpt?",
    context: "Key application includes campus security, attendance monitoring and virtual learning support...",
    options: [
      { id: "a", text: "Grammar error", isCorrect: false },
      { id: "b", text: "Missing one of the four required applications", isCorrect: true },
      { id: "c", text: "Too long", isCorrect: false },
      { id: "d", text: "Incorrect citation", isCorrect: false }
    ],
    explanation: "This summary is missing the fourth application: engagement detection (monitoring student attention through facial expressions).",
    tip: "Before writing, list all four applications: (1) Campus Security, (2) Attendance Monitoring, (3) Virtual Learning Integrity, (4) Engagement Detection."
  },
  {
    question: "What is the problem with this sentence?",
    context: "FRT is clearly dangerous and should be banned from schools.",
    options: [
      { id: "a", text: "Adding personal opinion instead of summarizing", isCorrect: true },
      { id: "b", text: "Missing citation", isCorrect: false },
      { id: "c", text: "Informal language", isCorrect: false },
      { id: "d", text: "Factual error", isCorrect: false }
    ],
    explanation: "A summary should only report what the source says, not your personal views. Words like 'clearly', 'should', 'dangerous' are evaluations.",
    tip: "Remove evaluative words. Use neutral language: 'The article describes...' not 'The article argues this is dangerous...'"
  },
  {
    question: "What is wrong with this claim?",
    context: "Schools spend $27 billion on security.",
    options: [
      { id: "a", text: "Missing citation", isCorrect: false },
      { id: "b", text: "Factual error (actual figure is $2.7 billion)", isCorrect: true },
      { id: "c", text: "Too specific", isCorrect: false },
      { id: "d", text: "Informal language", isCorrect: false }
    ],
    explanation: "The actual figure mentioned in the source is $2.7 billion, not $27 billion. This is a significant factual error.",
    tip: "Double-check numbers and facts when including them in your summary. Misremembering figures is a common mistake."
  },
  {
    question: "What is the problem with this generalization?",
    context: "All schools use facial recognition technology.",
    options: [
      { id: "a", text: "Overgeneralization (source says 'some schools are adopting...')", isCorrect: true },
      { id: "b", text: "Missing citation", isCorrect: false },
      { id: "c", text: "Informal language", isCorrect: false },
      { id: "d", text: "Personal opinion", isCorrect: false }
    ],
    explanation: "The source uses hedging language ('some schools', 'beginning to be taken up'). Changing this to 'all schools' distorts the meaning.",
    tip: "Preserve the hedging language used in the original source. Pay attention to words like 'some', 'many', 'increasingly'."
  },
  {
    question: "What is missing from this summary?",
    context: "FRT can be used for security, attendance, and online verification. It can detect faces and is becoming popular.",
    options: [
      { id: "a", text: "The author's critical perspective on FRT", isCorrect: true },
      { id: "b", text: "Statistics about usage", isCorrect: false },
      { id: "c", text: "Definition of FRT", isCorrect: false },
      { id: "d", text: "Citations", isCorrect: false }
    ],
    explanation: "This only lists applications without capturing the author's central argument or perspective. A good summary identifies the thesis.",
    tip: "Identify and include the author's central thesis or argument, not just a list of facts."
  },
  // Strengths as positive examples
  {
    question: "Why is this summary excerpt effective?",
    context: "The summary covers all four applications: security, attendance, online verification, and engagement monitoring.",
    options: [
      { id: "a", text: "It has comprehensive coverage of all main ideas", isCorrect: true },
      { id: "b", text: "It uses advanced vocabulary", isCorrect: false },
      { id: "c", text: "It is very short", isCorrect: false },
      { id: "d", text: "It includes personal analysis", isCorrect: false }
    ],
    explanation: "Including all four applications shows you understood and captured the complete scope of the source text.",
    tip: "Before submitting, check: Did I cover all the main points mentioned in the source?"
  },
  {
    question: "What makes this summary accurate?",
    context: "The article states that FRT is 'most prevalent in the US' and notes the $2.7 billion security market.",
    options: [
      { id: "a", text: "It accurately represents facts and figures from the source", isCorrect: true },
      { id: "b", text: "It uses direct quotes only", isCorrect: false },
      { id: "c", text: "It is very brief", isCorrect: false },
      { id: "d", text: "It adds helpful context", isCorrect: false }
    ],
    explanation: "Accurate representation means preserving the exact facts and figures as stated in the source without distortion.",
    tip: "Use quotation marks for distinctive phrases, and double-check numbers and statistics."
  }
];

export const paraphrasingTasks: MCTaskProps[] = [
  {
    question: "Which of these is 'patchwriting' (problematic light editing)?",
    context: "Original: 'school shooting incidents have prompted school authorities'",
    options: [
      { id: "a", text: "'school shooting events have caused school authorities' (only 2 words changed)", isCorrect: true },
      { id: "b", text: "'Educational administrators have responded to gun violence in schools'", isCorrect: false },
      { id: "c", text: "'In response to campus violence, school leaders have taken action'", isCorrect: false },
      { id: "d", text: "'Schools have implemented new safety measures following shooting incidents'", isCorrect: false }
    ],
    explanation: "Patchwriting means only changing a few words while keeping the same sentence structure. This is not acceptable paraphrasing.",
    tip: "Change both vocabulary AND sentence structure. Try starting the sentence differently."
  },
  {
    question: "What should you do with distinctive phrases like 'all-seeing shield'?",
    context: "Original text uses: 'pitching the technology as an all-seeing shield'",
    options: [
      { id: "a", text: "Use it without quotation marks", isCorrect: false },
      { id: "b", text: "Either quote it OR find a completely different way to express it", isCorrect: true },
      { id: "c", text: "Change one word to make it different", isCorrect: false },
      { id: "d", text: "Remove it from your summary", isCorrect: false }
    ],
    explanation: "Distinctive phrases are the author's creative expression. If you copy them, you must use quotation marks. Otherwise, express the idea differently.",
    tip: "If a phrase is memorable or unique, either quote it or completely rephrase the concept."
  },
  {
    question: "Why is this paraphrase problematic?",
    context: "Original: 'While X, Y...' → Paraphrase: 'While X, Y...'",
    options: [
      { id: "a", text: "It keeps the same sentence structure", isCorrect: true },
      { id: "b", text: "It changes the meaning", isCorrect: false },
      { id: "c", text: "It is too long", isCorrect: false },
      { id: "d", text: "It lacks citations", isCorrect: false }
    ],
    explanation: "Good paraphrasing changes sentence structure, not just vocabulary. Starting with the same pattern shows over-reliance on the source.",
    tip: "Restructure: try passive voice, start with a different clause, or combine sentences differently."
  },
  {
    question: "What is the best strategy to avoid copying?",
    options: [
      { id: "a", text: "Use a thesaurus to replace every word", isCorrect: false },
      { id: "b", text: "Read the source, close it, then write from memory", isCorrect: true },
      { id: "c", text: "Copy first, then edit words", isCorrect: false },
      { id: "d", text: "Only summarize short phrases", isCorrect: false }
    ],
    explanation: "Writing from memory forces you to use your own words and sentence structure. You can then check for accuracy.",
    tip: "Read → Understand → Look away → Write → Verify. This ensures genuine paraphrasing."
  },
  {
    question: "What percentage of words should ideally be different in a good paraphrase?",
    options: [
      { id: "a", text: "At least 30%", isCorrect: false },
      { id: "b", text: "At least 50%", isCorrect: false },
      { id: "c", text: "At least 70% with different sentence structure", isCorrect: true },
      { id: "d", text: "100% - every word must change", isCorrect: false }
    ],
    explanation: "Aim for significant transformation: at least 70% different words AND a different sentence structure.",
    tip: "Some words (names, technical terms) don't need to change, but the overall structure and most vocabulary should."
  },
  // Strengths
  {
    question: "Why is this paraphrase effective?",
    context: "Original: 'Facial recognition systems have now been sold to thousands of US schools' → 'Thousands of American educational institutions have purchased technology that identifies students by their faces.'",
    options: [
      { id: "a", text: "It completely restructures the sentence while preserving meaning", isCorrect: true },
      { id: "b", text: "It is shorter than the original", isCorrect: false },
      { id: "c", text: "It adds new information", isCorrect: false },
      { id: "d", text: "It uses simpler vocabulary", isCorrect: false }
    ],
    explanation: "This paraphrase changes the subject, uses different vocabulary, restructures the sentence, and still accurately conveys the meaning.",
    tip: "Good paraphrasing demonstrates understanding by expressing the idea in your own unique way."
  },
  {
    question: "What makes these synonym choices effective?",
    context: "'school authorities' → 'education administrators'; 'campus security' → 'on-site safety measures'",
    options: [
      { id: "a", text: "They maintain the same meaning with different words", isCorrect: true },
      { id: "b", text: "They use simpler words", isCorrect: false },
      { id: "c", text: "They are more formal", isCorrect: false },
      { id: "d", text: "They are shorter", isCorrect: false }
    ],
    explanation: "Effective synonyms preserve the exact meaning while demonstrating your vocabulary range.",
    tip: "Choose synonyms carefully - make sure they carry the same meaning in context."
  }
];

export const academicToneTasks: MCTaskProps[] = [
  {
    question: "What is wrong with this sentence?",
    context: "FRT is a really big deal in schools nowadays.",
    options: [
      { id: "a", text: "It uses informal language ('really big deal', 'nowadays')", isCorrect: true },
      { id: "b", text: "It is too short", isCorrect: false },
      { id: "c", text: "It lacks a citation", isCorrect: false },
      { id: "d", text: "It is factually incorrect", isCorrect: false }
    ],
    explanation: "'Really big deal' and 'nowadays' are conversational expressions inappropriate for academic writing.",
    tip: "Use formal alternatives: 'FRT has become increasingly significant in educational settings.'"
  },
  {
    question: "What should replace 'a lot of schools'?",
    options: [
      { id: "a", text: "'Many schools'", isCorrect: false },
      { id: "b", text: "'Numerous schools' or cite the specific number from the source", isCorrect: true },
      { id: "c", text: "'Tons of schools'", isCorrect: false },
      { id: "d", text: "'Schools everywhere'", isCorrect: false }
    ],
    explanation: "'A lot' is vague and informal. Academic writing requires precision.",
    tip: "Be precise: 'numerous schools' or 'thousands of US schools' (citing the source)."
  },
  {
    question: "What is the problem with a 60+ word sentence connected by 'and' repeatedly?",
    options: [
      { id: "a", text: "It is a run-on sentence that is hard to follow", isCorrect: true },
      { id: "b", text: "It uses too many commas", isCorrect: false },
      { id: "c", text: "It is too formal", isCorrect: false },
      { id: "d", text: "It lacks citations", isCorrect: false }
    ],
    explanation: "Run-on sentences overwhelm readers. Each sentence should convey one main idea.",
    tip: "Break into shorter sentences. Each sentence should have one main idea."
  },
  {
    question: "Which error type needs proofreading?",
    context: "The technology is use in many school. It be implemented widely.",
    options: [
      { id: "a", text: "Citation errors", isCorrect: false },
      { id: "b", text: "Subject-verb agreement and verb form errors", isCorrect: true },
      { id: "c", text: "Informal language", isCorrect: false },
      { id: "d", text: "Missing topic sentence", isCorrect: false }
    ],
    explanation: "'is use' should be 'is used'; 'It be' should be 'It is'. These grammar errors undermine clarity.",
    tip: "Proofread carefully. Read aloud to catch errors."
  },
  {
    question: "What is missing when ideas jump without connection?",
    context: "FRT monitors attendance. Security systems detect threats. Online courses verify identity.",
    options: [
      { id: "a", text: "Transitional phrases (Furthermore, However, In addition)", isCorrect: true },
      { id: "b", text: "Citations", isCorrect: false },
      { id: "c", text: "Examples", isCorrect: false },
      { id: "d", text: "Statistics", isCorrect: false }
    ],
    explanation: "Without transitions, ideas feel disconnected. Transitions show relationships between ideas.",
    tip: "Use transitional phrases: 'Furthermore,' 'In addition,' 'Moreover' to connect related ideas."
  },
  // Strengths
  {
    question: "Why does this vocabulary work well?",
    context: "Using 'implement,' 'utilize,' 'significant,' and 'facilitate' appropriately in context.",
    options: [
      { id: "a", text: "These are formal academic vocabulary used correctly", isCorrect: true },
      { id: "b", text: "They are the longest words possible", isCorrect: false },
      { id: "c", text: "They replace all simple words", isCorrect: false },
      { id: "d", text: "They make sentences longer", isCorrect: false }
    ],
    explanation: "Academic vocabulary should be used appropriately - not to show off, but to communicate precisely.",
    tip: "Choose formal words that fit naturally. Don't overuse complex vocabulary where simple words work better."
  },
  {
    question: "What makes this structure effective?",
    context: "Ideas progress from general (what FRT is) → specific (applications) → evaluation (concerns).",
    options: [
      { id: "a", text: "It follows a logical flow that guides the reader", isCorrect: true },
      { id: "b", text: "It uses the most words", isCorrect: false },
      { id: "c", text: "It includes personal opinions", isCorrect: false },
      { id: "d", text: "It avoids citations", isCorrect: false }
    ],
    explanation: "Logical organization helps readers follow your argument and shows clear thinking.",
    tip: "Plan your structure: Introduction → Main points in logical order → Conclusion."
  }
];

export const citationTasks: MCTaskProps[] = [
  {
    question: "What is wrong with stating facts without any citation?",
    context: "FRT is used in thousands of US schools for security purposes.",
    options: [
      { id: "a", text: "Missing citation - every idea from the source needs attribution", isCorrect: true },
      { id: "b", text: "The sentence is too long", isCorrect: false },
      { id: "c", text: "The vocabulary is too simple", isCorrect: false },
      { id: "d", text: "It is a personal opinion", isCorrect: false }
    ],
    explanation: "Every idea from the source needs a citation, even if paraphrased. 37.5% of submissions missed citations entirely.",
    tip: "If the information comes from your source, cite it."
  },
  {
    question: "What is wrong with this citation format?",
    context: "Andrejevic, Selwyn (2020) or (Andrejevic and Selwyn, 2020)",
    options: [
      { id: "a", text: "Missing punctuation", isCorrect: false },
      { id: "b", text: "Incorrect format - should use 'and' in text, '&' in parentheses", isCorrect: true },
      { id: "c", text: "Year is wrong", isCorrect: false },
      { id: "d", text: "Names are spelled wrong", isCorrect: false }
    ],
    explanation: "In APA: Use 'Andrejevic and Selwyn (2020)' for narrative OR '(Andrejevic & Selwyn, 2020)' for parenthetical.",
    tip: "Use 'and' in signal phrases, '&' in parenthetical citations."
  },
  {
    question: "What is wrong with this citation placement?",
    context: "(Andrejevic & Selwyn, 2020) FRT is used in schools.",
    options: [
      { id: "a", text: "Citation comes before the information instead of after", isCorrect: true },
      { id: "b", text: "Wrong punctuation", isCorrect: false },
      { id: "c", text: "Missing year", isCorrect: false },
      { id: "d", text: "Wrong author order", isCorrect: false }
    ],
    explanation: "Citation should come after the information, before the period: 'FRT is used in schools (Andrejevic & Selwyn, 2020).'",
    tip: "Place citations at the end of the relevant clause or sentence."
  },
  {
    question: "What is the problem with mixing '&' and 'and'?",
    options: [
      { id: "a", text: "It creates inconsistent style", isCorrect: true },
      { id: "b", text: "It changes the meaning", isCorrect: false },
      { id: "c", text: "It is too formal", isCorrect: false },
      { id: "d", text: "It makes citations too long", isCorrect: false }
    ],
    explanation: "APA requires consistency: 'and' in narrative citations (in the text), '&' in parenthetical citations (in parentheses).",
    tip: "Be consistent: check that all your citations follow the same rules."
  },
  {
    question: "What is wrong with citing after every single sentence?",
    context: "FRT is used in schools (Andrejevic & Selwyn, 2020). It monitors attendance (Andrejevic & Selwyn, 2020). It verifies identity (Andrejevic & Selwyn, 2020).",
    options: [
      { id: "a", text: "Over-citation - cite once at the end if using the same source", isCorrect: true },
      { id: "b", text: "Under-citation", isCorrect: false },
      { id: "c", text: "Wrong format", isCorrect: false },
      { id: "d", text: "Missing page numbers", isCorrect: false }
    ],
    explanation: "If consecutive sentences are from the same source, you can cite once at the end of the paragraph.",
    tip: "Cite strategically: when the source changes or at the end of a section from the same source."
  },
  // Strengths
  {
    question: "Why is this citation style effective?",
    context: "According to Andrejevic and Selwyn (2020), FRT is increasingly used in educational contexts.",
    options: [
      { id: "a", text: "It uses correct APA format with a signal phrase", isCorrect: true },
      { id: "b", text: "It is the shortest option", isCorrect: false },
      { id: "c", text: "It avoids mentioning authors", isCorrect: false },
      { id: "d", text: "It uses first names", isCorrect: false }
    ],
    explanation: "Signal phrases integrate citations naturally: author names in the text, year in parentheses.",
    tip: "Vary between signal phrases ('According to X...') and parenthetical citations ('...claims (X, Year).')."
  },
  {
    question: "What makes citation variety effective?",
    context: "Using both 'Andrejevic and Selwyn (2020) state...' and '...in schools (Andrejevic & Selwyn, 2020).'",
    options: [
      { id: "a", text: "It shows mastery of both narrative and parenthetical styles", isCorrect: true },
      { id: "b", text: "It makes the paper longer", isCorrect: false },
      { id: "c", text: "It hides the sources", isCorrect: false },
      { id: "d", text: "It avoids page numbers", isCorrect: false }
    ],
    explanation: "Using both styles shows understanding of APA and creates more natural, varied writing.",
    tip: "Mix citation styles to create flow while maintaining proper attribution."
  }
];

export const allTasksByCategory: Record<string, MCTaskProps[]> = {
  "summary-accuracy": summaryAccuracyTasks,
  "paraphrasing": paraphrasingTasks,
  "academic-tone": academicToneTasks,
  "in-text-citation": citationTasks
};
