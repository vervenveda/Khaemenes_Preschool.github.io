# Pre-K PE Hardening Notes

**Surface:** `apps/PE_move_n_groove_index.html`  
**Latest PE app commit:** `9649b6c0046f65ae8aa344c5616ea5843ebf9b4c`  
**Teacher guide commit:** `c1c01178641232aeff690385441133e36f8161d1`

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

## Real-browser learner-journey verification — October 23, 2026

**Automated Chromium regression: PASS — 13 checks.** [GitHub Actions run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39906897706)

The real-browser suite exercised:
- Page startup with a distinct learner profile.
- 255 px viewport width with document and body widths constrained to 255 px.
- Reduced-motion preference.
- Keyboard focus and Enter activation.
- Timer start, pause, and stable countdown after pausing.
- Lesson completion and saved evidence distinguishing the learning-check response.
- Adult observation, adaptation, and next-step persistence in the evidence list, including after reloading as the same learner.
- Downloaded backup schema and learner identity.
- Switching from Learner A to Learner B without exposing A's work.
- Rejection of a backup belonging to a different learner.
- Restore for the matching learner after confirmation.
- Rejection of invalid-schema and oversized backups without replacing progress.

### Bugs exposed and repaired by the browser run

1. The first browser pass found that a completed lesson could be recorded with `learningCheck: "not-recorded"` after the learner used both attempts. The second-incorrect-answer branch now records `lastCheckCorrect = false`, so the evidence distinguishes a correct response from a completed check after help.
2. The 255 px pass found horizontal overflow from the 210 px minimum lesson-card track and over-wide links in the injected shared ecosystem menu. Narrow-screen CSS now constrains lesson/stat tracks and menu link sizing without removing the menu.
3. The two-learner flow found that the PE portal's `beforeunload` handler calls `stopTimer()`, which saves. If the shared active learner changed before unload, that final save could be assigned to the newly selected learner. The page now binds its in-memory state to the learner ID active at load time; saves, adult observations, exports, and restores are blocked when the active learner no longer matches that session owner.

### Verification boundary

GitHub source regression, Beta index coverage, Beta rollout, Pages build/deployment, and the Chromium browser regression all passed for commit `9649b6c0046f65ae8aa344c5616ea5843ebf9b4c).

This is a real headless Chromium run with a 255 px viewport, not a physical phone/tablet certification. The separately maintained `tests/PE_DEVICE_TEST_MATRIX.md` still requires manual checks on physical iOS/Android devices, desktop Safari/Firefox, and with real keyboard/assistive-technology setups before the beta can be described as fully device-certified.
