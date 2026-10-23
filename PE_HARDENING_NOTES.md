# Pre-K PE Hardening Notes

**Surface:** `apps/PE_move_n_groove_index.html`  
**Latest PE app commit:** `45721dd9dfa386366a583fd9c7bd5bb8f7af5b34`  
**Teacher guide commit:** `84765a8d48f4fd8fcca2d254e6cb9529fdab56fa`

## Repairs and instructional upgrades applied

- A lesson cannot be marked complete until the learner has interacted with its learning check. One incorrect answer invites another try; after two incorrect choices, the safe choice is revealed and the learner may continue.
- A countdown cannot continue below zero or restart at zero. Choosing a new duration resets the countdown.
- The Space-key shortcut no longer intercepts typing, native keyboard activation, or hidden movement phases. Escape returns to the lesson list only while a lesson is open.
- Learning-check choices use Fisher–Yates shuffling.
- All 42 lessons now have individualized adult observation cues and accessible alternatives.
- Each lesson has a three-question pool: 126 total items across 42 lessons. One question is selected when the learning-check phase opens, and its choices are shuffled.
- Question-pool source validation confirms each lesson has three unique prompts, three distinct options per prompt, valid correct-choice indices, and no empty question text.
- Added `apps/PE_move_n_groove_teacher_guide.html`, a print-friendly 42-lesson map, observation scale, core PE domains, adaptations/safety guidance, and reusable observation record; linked it from the learner portal.
- Existing seated/standing/supported participation options, reduced-motion support, read-aloud controls, and local activity records remain in place.

## Validation boundary

- The inline JavaScript parsed successfully after the changes.
- Source-level checks passed for 42 lesson records, all 42 observation/adaptation guides, all 126 question items, and the answer-selection/complete-button wiring.
- A full interactive browser/device regression run has **not** been performed in this pass.
- All progress remains browser-local; this static page is not an authenticated teacher grading service.

## Next curriculum-quality pass

The next step is to build a teacher-facing printable observation rubric and map these lesson outcomes against age-appropriate locomotor skills, object control, balance, body awareness, cooperation, and healthy habits. After that, return to high school PE to expand Grade 9 Weeks 9–36 assessment banks and then author the corresponding grade-specific instruction and question banks for Grades 10–12.

## October 23, 2026 — forensic audit follow-through

- Fixed learner-scoped legacy migration: each unscoped legacy progress key can be claimed by only the first active learner, with a persistent migration receipt. The legacy source is preserved; subsequent learners do not inherit it through the fallback path.
- Added `tools/preschool-learner-storage-regression.mjs` and placed it in the Preschool source-regression workflow. The automated test covers one-time legacy migration, two-learner isolation, learner-scoped removal, and guest compatibility.
- The Move & Groove portal now records a separate evidence item when a lesson finishes. The record distinguishes participation from a correct learning check or a check completed after help. It does not claim that lesson completion proves motor-skill mastery.
- Added an adult observation workflow with optional adaptation and next-step notes.
- Added JSON PE backup export and restore. Restore requires the same learner ID, validates the schema and lesson identifiers, limits uploads to 2 MB, sanitizes imported evidence fields, and asks for confirmation before replacing current progress.
- Added `curriculum/pe/prek-movement-scope-sequence.json`, mapping all 42 lessons to focus, intended outcome, safety setup, adaptation options, evidence types, and a next learning opportunity. The printable teacher guide now links to this map.
- Added `tools/preschool-pe-regression.mjs` and included it in CI. It checks all 42 lessons, all 42 adult-cue/adaptation records, the three-question banks, map parity, evidence controls, restore safeguards, and inline-script syntax.
- Added `tests/PE_DEVICE_TEST_MATRIX.md` for repeatable browser, mobile, narrow-viewport, keyboard, reduced-motion, and speech-unavailable checks.

### Verification boundary

The latest GitHub source-regression workflow passed, including both new automated test scripts. This confirms the automated source contracts only. The manual browser/device scenarios in `tests/PE_DEVICE_TEST_MATRIX.md` remain **NOT TESTED** until they are performed on the listed environments. GitHub Pages deployment is tracked separately from source-regression success.
