# Pre-K PE Hardening Notes

**Surface:** `apps/PE_move_n_groove_index.html`  
**Latest PE app commit:** `2fa60daa32a0e817c21a54f6fc09aa8735a5c4e2`  
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

The latest GitHub source-regression workflow passed, including learner-storage and PE curriculum/evidence contracts. This confirms the automated source contracts only. The manual browser/device scenarios in `tests/PE_DEVICE_TEST_MATRIX.md` remain **NOT TESTED** until they are performed on the listed environments. GitHub Pages deployment is tracked separately from source-regression success.

## Real-browser learner-journey verification — October 23, 2026

**Automated Chromium regression: PASS — 18 checks.** [GitHub Actions run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39907870537)

The real-browser suite exercised:
- Page startup with a distinct learner profile.
- 255 px viewport width with document and body widths constrained to 255 px.
- Shared ecosystem hamburger opened at 255 px; drawer ended at 241 px, with 130 links checked and no viewport overflow.
- A separate 320 px viewport check, with document/body width exactly 320 px.
- Independent `correct` and `reviewed-after-help` learning-check evidence outcomes.
- Mid-timer reload without false lesson completion or fabricated adult evidence.
- Reduced-motion preference.
- Keyboard focus and Enter activation for the large-type button plus representative navigation, timer, phase, and evidence controls.
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

GitHub source regression, Beta index coverage, and the Chromium browser regression passed for test commit `21d378f0e3f16062d6d54824a570fd2eb43a6aed`. Pages build/deployment was still running at the time this note was refreshed.

This is a real headless Chromium run with 255 px and 320 px viewport checks, not a physical phone/tablet certification. The separately maintained `tests/PE_DEVICE_TEST_MATRIX.md` still requires manual checks on physical iOS/Android devices, desktop Safari/Firefox, and with real keyboard/assistive-technology setups before the beta can be described as fully device-certified.

## Fresh forensic audit — five additional bubbles completed

**Current verified baseline:** commit `693e4963cb363157512c5e9369c8473e28f24f24`. The source regression, Beta index coverage, PE Chromium regression, and catalog browser smoke run passed. GitHub Pages deployment also passed at that revision.

1. **Question-pool metadata parity:** all 42 entries in `curriculum/pe/prek-movement-scope-sequence.json` now report `questionPoolSize: 3`, matching the runtime's primary prompt plus two variants. `tools/preschool-pe-regression.mjs` asserts the map/runtime count for every lesson.
2. **Cross-tab learner changes:** the PE portal listens for active-profile changes, focus, and visibility return. If the session owner no longer matches the active learner, the timer and narration stop, the app is made inert behind an accessible reload overlay, and subsequent saves/actions are guarded.
3. **Strict backup validation:** import validates each completion record's lesson key, object shape, and ISO timestamp; checks evidence lesson references and title consistency; rejects duplicate/empty evidence IDs, invalid learning-check or adult-observation values, excessive note lengths, invalid timestamps, duplicate favorites, invalid movement totals, and invalid accessibility settings before confirmation/replacement.
4. **Interrupted-lesson recovery:** progress stores a learner-scoped lesson checkpoint (lesson ID, phase, remaining seconds, timestamp). Returning to the portal shows Resume or Start Again options. Completing a lesson clears the checkpoint; a reload must never create a false completion or evidence record.
5. **Catalog-wide browser smoke tests:** `tools/preschool-catalog-browser-smoke.mjs` and `.github/workflows/preschool-catalog-browser-smoke.yml` run headless Chromium against representative activities across nine catalog categories. The 13-check suite includes category startup/safe interaction, French language switching and persistence, art drawing plus undo/redo and PNG export, feelings-quiz completion, and piano instrument/beat controls.

### Verification results

- **PE Chromium regression:** 22/22 checks passed, including stale-session cross-tab invalidation, resume after interruption, correct and assisted learning-check outcomes, strict malformed/duplicate backup rejection, identity mismatch rejection, and same-learner restore. [Run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39966673852)
- **Catalog browser smoke:** 13/13 checks passed across nine categories. [Run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39966925784)
- **Source regression:** passed. [Run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39966925807)
- **Beta index coverage:** passed. [Run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39966925966)
- **Pages deployment:** passed. [Run](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39966925441)

### Remaining boundary

These are automated headless Chromium validations. Manual physical-device checks on iOS/iPadOS and Android, desktop Safari/Firefox, voice-unavailable behavior, full keyboard-only navigation, and print-output legibility are still not certified. The browser tests do not replace those manual checks.
