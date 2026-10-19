# Pre-K PE Hardening Notes

**Surface:** `apps/PE_move_n_groove_index.html`  
**Commit:** `43d09329c54ff2f9699d4b61e28bfae3cbc382a6`

## Repairs applied

- A lesson cannot be marked complete until the learner has interacted with the learning check. One incorrect answer invites another try; after two incorrect choices, the safe choice is revealed and the learner may continue.
- The page-level Space shortcut no longer intercepts typing or native keyboard activation inside buttons, inputs, selects, textareas, and editable fields. Escape returns to the lesson list only while a lesson is open.
- A countdown cannot restart at zero or tick negative. Choosing a new duration resets the countdown and re-enables Start.
- Learning-check choices now use Fisher–Yates shuffling rather than a random comparator, preserving answer-order variety without the comparator's bias.
- Existing seated/standing/supported participation options, reduced-motion support, read-aloud controls, and local activity records remain in place.

## Validation boundary

- Read the deployed source on the repository's `main` branch before editing.
- All inline JavaScript parsed successfully after the changes.
- Source-level checks confirm the updated completion, timer and keyboard guards are present.
- A full interactive browser/device regression run has **not** been performed in this pass.

## Next curriculum-quality pass

The 42 lessons currently provide a warm-up, movement activity, cool-down, and one short learning check per lesson. The next instructional upgrade should author additional age-appropriate checks and caregiver/teacher observation cues for each lesson, while keeping participation accessible and never making physical performance or body traits the measure of learning.
