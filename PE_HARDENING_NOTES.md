# Pre-K PE Hardening Notes

**Surface:** `apps/PE_move_n_groove_index.html`  
**Latest code commit:** `9579faf8ada0643b8f32a2f08e24ef7f9a67079c`

## Repairs and instructional upgrades applied

- A lesson cannot be marked complete until the learner has interacted with its learning check. One incorrect answer invites another try; after two incorrect choices, the safe choice is revealed and the learner may continue.
- A countdown cannot continue below zero or restart at zero. Choosing a new duration resets the countdown.
- The Space-key shortcut no longer intercepts typing, native keyboard activation, or hidden movement phases. Escape returns to the lesson list only while a lesson is open.
- Learning-check choices use Fisher–Yates shuffling.
- All 42 lessons now have individualized adult observation cues and accessible alternatives.
- Each lesson has a three-question pool: 126 total items across 42 lessons. One question is selected when the learning-check phase opens, and its choices are shuffled.
- Question-pool source validation confirms each lesson has three unique prompts, three distinct options per prompt, valid correct-choice indices, and no empty question text.
- Existing seated/standing/supported participation options, reduced-motion support, read-aloud controls, and local activity records remain in place.

## Validation boundary

- The inline JavaScript parsed successfully after the changes.
- Source-level checks passed for 42 lesson records, all 42 observation/adaptation guides, all 126 question items, and the answer-selection/complete-button wiring.
- A full interactive browser/device regression run has **not** been performed in this pass.
- All progress remains browser-local; this static page is not an authenticated teacher grading service.

## Next curriculum-quality pass

The next step is to build a teacher-facing printable observation rubric and map these lesson outcomes against age-appropriate locomotor skills, object control, balance, body awareness, cooperation, and healthy habits. After that, return to high school PE to expand Grade 9 Weeks 9–36 assessment banks and then author the corresponding grade-specific instruction and question banks for Grades 10–12.
