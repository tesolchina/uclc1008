# Week 2 Design Outline: APA Citations for Summary Writing

## Overview
Week 2 focuses on citation practices essential for writing summaries. Hour 1 covers in-text citations with varied sentence patterns, Hour 2 covers end-of-text citations (reference list), and Hour 3 is practice/reflection.

---

## Hour 1: In-Text Citations (APA 7th)

**Theme:** "Citing Sources Within Your Text"

**Learning Goals:**
1. Master author-prominent vs. information-prominent citation styles
2. Use varied sentence patterns with citations
3. Apply '&' vs 'and' and 'et al.' rules correctly
4. Integrate citations smoothly into summary sentences

### Structure (Following Hour 1 Pattern)

**Part 1: Two Citation Styles** (Collapsible)
- Notes: Author-prominent (narrative) vs. Information-prominent (parenthetical)
- When to use each style
- MC Q1-Q2: Identify the citation style

**Part 2: The '&' vs 'and' and 'et al.' Rules** (Collapsible)
- Notes: APA 7th specific rules
- Common errors to avoid
- MC Q3-Q4: Spot the errors

**Part 3: Sentence Patterns with Citations** (Collapsible)
- Notes: 5+ sentence patterns for integrating citations
  - Pattern A: "According to Author (Year), [claim]."
  - Pattern B: "Author (Year) argues/demonstrates/contends that [claim]."
  - Pattern C: "[Claim] (Author, Year)."
  - Pattern D: "As Author (Year) notes, [claim]."
  - Pattern E: "[Claim], as evidenced by Author's (Year) study."
- MC Q5-Q6: Match pattern to purpose
- Writing Task: Rewrite a sentence using 3 different patterns

**Part 4: Citations in Summary Context** (Collapsible)
- Notes: How citations function in summaries
- When to cite (every borrowed idea)
- MC Q7-Q8: Citation placement in summaries
- Writing Task: Write a summary sentence with proper citation

**Part 5: AI Citation Coach (Learning App)** (Collapsible)
- Interactive practice: Given a claim, add citation in different patterns
- AI feedback on format and placement
- Error detection and correction suggestions

---

## Hour 2: End-of-Text Citations (Reference List)

**Theme:** "Building Your Reference List"

**Learning Goals:**
1. Construct APA 7th reference entries for journal articles
2. Identify the required elements (author, date, title, source, DOI)
3. Apply correct formatting (italics, capitalization, punctuation)
4. Link in-text citations to reference entries

### Structure

**Part 1: Why Reference Lists Matter** (Collapsible)
- Notes: Purpose of reference lists
- Connection between in-text and end-text citations
- MC Q1-Q2: What information goes where?

**Part 2: The 5 Elements of a Journal Article Reference** (Collapsible)
- Notes: Author(s), Date, Title, Source (journal + volume/issue), DOI
- Format rules for each element
- MC Q3-Q5: Identify correct formatting

**Part 3: Common Formatting Rules** (Collapsible)
- Notes: Capitalization (sentence case for titles), italics (journal name, volume), punctuation
- Side-by-side correct vs. incorrect examples
- MC Q6-Q7: Spot the formatting error
- Writing Task: Fix a malformed reference

**Part 4: Building References from Sources** (Collapsible)
- Notes: Where to find each element in an article
- Practice: Build reference entries for course articles
- Writing Task: Write complete reference entries for Hong et al. and Andrejevic & Selwyn

**Part 5: AI Reference Builder (Learning App)** (Collapsible)
- Input: Paste article details
- AI guides through each element
- Generates correctly formatted reference
- Compare with your attempt

---

## Hour 3: Practice, Feedback & Reflection

**Theme:** "Consolidate Citation Skills"

**Learning Goals:**
1. Apply in-text and end-text citation skills in integrated practice
2. Self-assess citation accuracy
3. Identify personal areas for improvement
4. Set goals for summary writing

### Structure

**Part 1: Quick Skills Review** (Collapsible)
- MC Q1-Q4: Rapid-fire review of Hours 1-2 content

**Part 2: Integrated Citation Practice** (Collapsible)
- Given a passage, write summary sentences with proper in-text citations
- Create corresponding reference entries
- AI feedback on both

**Part 3: Error Detection Challenge** (Collapsible)
- Find and fix errors in citation examples
- Timed challenge mode (optional)

**Part 4: Reflection & Goal Setting** (Collapsible)
- Self-assessment: Rate confidence on each citation skill
- Identify biggest challenge
- Set specific goal for Week 3
- Writing Task: Reflection paragraph

---

## AI Learning Apps for Week 2

### App 1: Citation Pattern Transformer (Hour 1)
- Input: A claim and source info
- Student selects a sentence pattern
- AI shows the correctly formatted sentence
- Practice converting between patterns

### App 2: Reference Entry Builder (Hour 2)
- Step-by-step guidance for building reference entries
- AI validates each element
- Provides correction suggestions
- Builds confidence before AWQ

---

## Task Summary

| Hour | MC Questions | Writing Tasks | AI App |
|------|--------------|---------------|--------|
| 1 | 8 | 2 | Citation Pattern Transformer |
| 2 | 7 | 2 | Reference Entry Builder |
| 3 | 4 | 2 | Integrated practice with AI feedback |

---

## Key Resources

- APA 7th Edition Manual sections on citations
- Course articles: Hong et al. (2022), Andrejevic & Selwyn (2020)
- Sample AWQ with citation examples

---

## Implementation Notes

1. Create new AI learning app components:
   - `src/components/lessons/CitationPatternCoach.tsx`
   - `src/components/lessons/ReferenceBuilder.tsx`

2. Update `hourContent.ts` with Week 2 content following existing patterns

3. Extend chat edge function with citation-specific prompts

4. Connect to student progress tracking
