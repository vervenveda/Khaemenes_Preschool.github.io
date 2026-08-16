# Khaemenes Preschool · Archaemenes Mentor

`mentor/index.html` is the child-facing Preschool Mentor environment for Crechè Preschool.

**Archaemenes is the Khaemenes Academy mentor for Preschool learners.**

The page is not the family registration page, parent dashboard, a guest mentor, or an unrestricted child chatbot.

---

## Access Contract

The Mentor requires an active linked Preschool learner from the Academy Family Registry.

```text
Crechè Home
   ↓
Parent / Family Profile
   ↓
linked Preschool learner
   ↓
NAIB intake / delegation boundary
   ↓
Khaemenes Academy
   ↓
Archaemenes · Preschool presentation
```

NAIB acts as the Academy front desk / AI Resources Director. It receives a bounded visitor context and delegates the learner to the appropriate Academy or ecosystem destination. Once the visitor is delegated into Khaemenes Academy, **the Academy provides Archaemenes as its educational mentor**.

If there is no active Preschool learner, the page should remain locked and provide clear links back to Crechè and the Parent / Family Profile.

If the active learner belongs to another Khaemenes school stage, the Preschool Mentor should not silently reuse that learner.

---

## Authority Boundary

The Preschool page owns the immediate child-facing experience: layout, activity context, local progress display, accessibility, read-aloud controls, feelings buttons, and contained activity windows.

The page does **not** own cross-ecosystem identity, NAIB delegation policy, private AI implementation, server authorization, or long-term authority over the learner.

Responsibilities are intentionally separated:

- **Academy Family Registry** — learner and family identity.
- **NAIB** — intake, administration, resource direction, and delegation.
- **Khaemenes Academy** — institutional educational relationship.
- **Archaemenes** — Academy mentoring and learner-facing guidance.
- **Crechè catalog / lesson context** — age-appropriate activities and learning resources.
- **Parent / guardian / educator** — human oversight and educational judgment.

The current runtime may still call the historical `assignMentor()` compatibility seam while school clients migrate to `delegate()`. That compatibility method must resolve through the same NAIB delegation contract and must not turn NAIB into the mentor.

---

## Archaemenes Presentation

Archaemenes is one continuous Academy mentor identity. Preschool presentation may adapt for developmental context, such as a gentler Nestling or Storybook presentation, without creating additional personalities.

Voice tone, pacing, visual treatment, and activity wording may vary as presentation settings. They do not create alternate mentors.

Archaemenes should remain:

- clue-first;
- age-appropriate;
- encouraging without overclaiming mastery;
- bounded to educational support;
- non-coercive;
- transparent about uncertainty;
- respectful of family/guardian authority.

---

## Specialist AI Boundary

Archaemenes is the mentor for the **Khaemenes Academy** environment. Other Verve N Veda specialist platforms may present their own specialist AIs when a learner enters those domains. NAIB may delegate a visitor to those platforms, but one platform's specialist does not silently replace another platform's institutional specialist.

Examples include music, literary/language-arts, knowledge, games, civic resources, communications, and other specialized destinations.

---

## Future Responsible Mentor Adoption

A future Mentor Adoption program may allow a learner or family to design and adopt an AI avatar/mentor under Academy safety, privacy, identity, continuity, and guardian rules.

That program is future work. The current Preschool experience should not emulate it by inventing local alternate mentor identities or by allowing a page to self-assign a different mentor.

Until the formal program exists, Archaemenes remains the Khaemenes Academy mentor.

---

## Required Public Dependencies

The page may load the shared Preschool catalog and the Academy Family Registry. It may also load the Academy public NAIB delegation router.

These public dependencies must not contain credentials, private keys, authentication secrets, privileged server configuration, unrestricted child-chat endpoints, or private AI implementation details.

If family identity or the delegation layer is unavailable, the personalized Mentor path should fail closed rather than inventing identity or authority. Public Crechè activities may remain available independently.

---

## Learner Inputs

The Mentor should use only the minimum learner information necessary for the immediate educational experience, such as a display nickname, Preschool stage, broad age band, broad interests, and learner-scoped local progress.

Legacy local fields that previously selected a mentor may remain temporarily for compatibility, but they must not be treated as authority for the Academy specialist relationship.

Sensitive information should not be requested from the child unless a separate authorized feature clearly requires it.

---

## Bounded Child Interaction

The current Mentor deliberately avoids unrestricted private child chat. Appropriate controls include hints, play suggestions, stuck/help prompts, breaks, feelings choices, read-aloud, and activity selections.

Feelings are session context for gentle adaptation, not diagnosis or a permanent psychological profile.

Archaemenes must not infer intelligence, academic potential, protected traits, diagnosis, politics, religion, socioeconomic status, or disciplinary risk from appearance, voice, age, interests, or other presentation details.

---

## Learning Path

The Mentor may build a short learning path from Mentor-eligible Crechè activities using broad developmental suitability, interests, current session energy, activity duration, learning-domain balance, novelty, and prior exploration.

The path is educational guidance and encouragement, not a formal grade, transcript, diagnosis, or mastery determination.

---

## Contained Activity Window

Recommended activities may open in a contained in-page window. The parent Mentor page should validate activity routes against the approved Preschool catalog and should sandbox embedded activities as tightly as practical for their actual feature needs.

The child should always have a clear way to close or exit the activity. Keyboard and assistive-technology access should remain intact.

---

## Local Progress

Learner-scoped progress may retain lightweight items such as completed activity IDs, exploration stars, and user-selected voice preferences.

Browser storage is local device data, not a secure vault. Do not store passwords, access tokens, private keys, government identifiers, financial information, medical records, or privileged account material in the Mentor page.

---

## Voice and Read-Aloud

Read-aloud should start only after a user action. Any selectable voices or styles are **Archaemenes voice presentations**, not separate mentor identities.

Continuous microphone listening is outside the current Preschool design. Any future voice input should remain explicit, visible, and push-to-talk or similarly bounded.

---

## Parent Boundary

Parent administration belongs in the Academy Family Profile rather than inside the child Mentor page.

The child experience should not expose adult account controls, guardian invitation tools, privileged family exports, administrative secrets, or private service contracts.

---

## Security Expectations

- no embedded credentials or secrets;
- no `eval` or dynamically constructed executable code;
- validate routes before placing them in an iframe or navigation target;
- render user-controlled content as text wherever possible;
- use narrowly scoped network access;
- avoid analytics, advertising, tracking, and unnecessary third-party scripts;
- keep microphone/camera/geolocation disabled unless explicitly needed;
- preserve clear escape and keyboard behavior;
- fail closed for learner identity and personalized Academy mentoring.

See the root `SECURITY.md` for the public security boundary.

---

## Ownership

Copyright © 2026 Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy.
