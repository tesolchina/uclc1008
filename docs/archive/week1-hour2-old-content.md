# Week 1 Hour 2 - Archived Content (Original Design)

> **Archived on:** 2026-01-13
> **Reason:** Restructured to follow Hour 1's format with collapsible parts and ParaphraseCoach as a learning app

## Original Design

The original design had:
1. A `ParaphraseCoach` component as the primary interactive element
2. 5-step guided paraphrasing process with AI coaching
3. Less structured content format (not matching Hour 1's collapsible format)

## ParaphraseCoach Component

The `ParaphraseCoach.tsx` component was created with:
- Step 1: Read & Identify Meaning
- Step 2: Plan Your Changes (select strategies)
- Step 3: Draft Your Paraphrase
- Step 4: Add Citation
- Step 5: Final Check

This component is now used as a "Learning App" that follows the structured content in Part 4.

## Original Content Structure

```typescript
{
  weekNumber: 1,
  hourNumber: 2,
  title: "Paraphrasing Fundamentals",
  theme: "4 Core Strategies with AI-Guided Practice",
  learningGoals: [
    "Apply 4 core paraphrasing strategies (synonyms, word forms, voice, sentence structure)",
    "Identify and avoid 'patchwriting' (insufficient changes that constitute plagiarism)",
    "Integrate citations correctly with paraphrased content",
    "Practice paraphrasing with AI-guided step-by-step feedback"
  ],
  agenda: [
    { title: "Why Paraphrase? (Concept)", duration: "10 min" },
    { title: "The 4 Paraphrasing Strategies", duration: "20 min" },
    { title: "Patchwriting Detection", duration: "10 min" },
    { title: "AI-Guided Paraphrasing Practice", duration: "25 min" }
  ]
}
```

## Key Concepts (Preserved)

- Paraphrasing: Restating in your own words
- Patchwriting: Minor changes = still plagiarism
- Strategy 1: Synonym Replacement
- Strategy 2: Word Form Changes
- Strategy 3: Active ↔ Passive Voice
- Strategy 4: Sentence Structure Changes
- Citation Integration

## Notes for Future Reference

The ParaphraseCoach component can be reused for:
- Week 2: More advanced paraphrasing practice
- Week 3: Integrated with summarizing skills
- Week 4: Speed drills
- Week 5: Mock AWQ preparation
