# Preschool PE — Browser and Device Regression Matrix

Status: **Prepared; manual device runs are not yet certified.**
Target: `apps/PE_move_n_groove_index.html` plus the linked teacher guide and learner-storage helper.

## Required environments
- Desktop Chrome or Chromium
- Desktop Firefox
- Desktop Safari (macOS)
- Mobile Safari (iOS/iPadOS)
- Mobile Chrome (Android)
- Narrow viewport at 255 px and at 320 px
- Keyboard-only desktop session
- Reduced-motion preference enabled
- Browser with speech synthesis unavailable or voices unavailable

## Scenarios and pass criteria

| ID | Scenario | Pass criteria | Result |
|---|---|---|---|
| PE-01 | Open the portal as a guest | Lesson list renders and can be explored without a named profile | NOT TESTED |
| PE-02 | Complete one lesson with a correct check answer | Completion and a `correct` learning-check record appear | NOT TESTED |
| PE-03 | Complete a lesson after two incorrect answers | Record says `reviewed-after-help`; completion is not described as skill mastery | NOT TESTED |
| PE-04 | Save an adult observation | Observation, adaptation, and next step persist after reload | NOT TESTED |
| PE-05 | Export PE backup | Valid JSON downloads with schema, learner ID, completion records, and evidence | NOT TESTED |
| PE-06 | Restore into the same learner | Preview/confirmation appears; records restore and totals update | NOT TESTED |
| PE-07 | Attempt restore with a different learner ID | Restore is rejected; current records remain unchanged | NOT TESTED |
| PE-08 | Restore malformed, unknown-schema, or oversized JSON | Restore is rejected with a useful message; no state is replaced | NOT TESTED |
| PE-09 | Switch between two learner profiles | Neither learner sees the other's scoped progress or observations | NOT TESTED |
| PE-10 | Reset one learner's progress | That learner's PE records clear; the other learner's records remain | NOT TESTED |
| PE-11 | Use keyboard-only controls | All controls can be reached and activated; focus remains visible | NOT TESTED |
| PE-12 | Use reduced motion / no speech voices | Activity remains usable and text instructions are still available | NOT TESTED |
| PE-13 | Run at 255 px and 320 px width | No horizontal page overflow; evidence controls stay usable | NOT TESTED |
| PE-14 | Print or save the teacher guide | Tables, prompts, and observation fields remain legible | NOT TESTED |

## Run procedure
1. Start with a fresh browser profile and record environment/version.
2. Test guest mode first, then create/select Learner A and Learner B in the Academy family flow.
3. Record the result, browser, device, date, and evidence for each scenario.
4. Mark PASS only after the scenario is performed; static code checks do not count as device certification.
5. Re-run PE-02 through PE-10 after any storage or evidence change.

## Safety and interpretation boundary
Participation, question response, and adult observation are separate evidence types. A stored completion record is not by itself proof of movement proficiency, a medical assessment, or a developmental diagnosis.
