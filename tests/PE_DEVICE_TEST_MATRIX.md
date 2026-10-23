# Preschool PE — Browser and Device Regression Matrix

Status: **Automated Chromium regression passed (13 checks); physical-device runs remain NOT TESTED.**

Automated run: [Preschool PE browser regression — GitHub Actions](https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/39906897706). The test exercised a 255 px viewport and `prefers-reduced-motion: reduce` in headless Chromium. This does not substitute for manual physical-device or assistive-technology testing.
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
| PE-02 | Complete one lesson with a correct check answer | Completion and a `correct` learning-check record appear | PARTIAL — lesson and check completion tested; the browser script accepts either valid outcome and does not force the correct-only branch |
| PE-03 | Complete a lesson after two incorrect answers | Record says `reviewed-after-help`; completion is not described as skill mastery | NOT TESTED — the automated run did not force this branch independently |
| PE-04 | Save an adult observation | Observation, adaptation, and next step persist after reload | PASS — Chromium saved an observation, reloaded, and verified observation/adaptation/next-step persistence |
| PE-05 | Export PE backup | Valid JSON downloads with schema, learner ID, completion records, and evidence | PASS — browser download payload inspected |
| PE-06 | Restore into the same learner | Preview/confirmation appears; records restore and totals update | PASS — correct-learner restore accepted after confirmation |
| PE-07 | Attempt restore with a different learner ID | Restore is rejected; current records remain unchanged | PASS — cross-learner restore rejected and B remains empty |
| PE-08 | Restore malformed, unknown-schema, or oversized JSON | Restore is rejected with a useful message; no state is replaced | PASS — invalid schema and file over 2 MB rejected without replacement |
| PE-09 | Switch between two learner profiles | Neither learner sees the other's scoped progress or observations | PASS — Chromium verified A→B isolation; also exposed and validated the beforeunload-save owner guard |
| PE-10 | Reset one learner's progress | That learner's PE records clear; the other learner's records remain | NOT TESTED |
| PE-11 | Use keyboard-only controls | All controls can be reached and activated; focus remains visible | PARTIAL — large-type control focused and activated with Enter; complete keyboard-only sweep still needed |
| PE-12 | Use reduced motion / no speech voices | Activity remains usable and text instructions are still available | PARTIAL — reduced-motion preference passed; speech-unavailable scenario not tested |
| PE-13 | Run at 255 px and 320 px width | No horizontal page overflow; evidence controls stay usable | PARTIAL — 255 px passed with document/body width 255 px; 320 px not separately tested |
| PE-14 | Print or save the teacher guide | Tables, prompts, and observation fields remain legible | NOT TESTED |

## Run procedure
1. Start with a fresh browser profile and record environment/version.
2. Test guest mode first, then create/select Learner A and Learner B in the Academy family flow.
3. Record the result, browser, device, date, and evidence for each scenario.
4. Mark PASS only after the scenario is performed; static code checks do not count as device certification.
5. Re-run PE-02 through PE-10 after any storage or evidence change.

## Safety and interpretation boundary
Participation, question response, and adult observation are separate evidence types. A stored completion record is not by itself proof of movement proficiency, a medical assessment, or a developmental diagnosis.
