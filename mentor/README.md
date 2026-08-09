# Khaemenes Preschool · Personalized Child Mentor

`mentor/index.html` is the child-facing personalized Mentor for Crechè Preschool.

It is **not** the family registration page, parent dashboard, or a public Guest Mentor.

---

## Access Contract

The Mentor requires an **active linked Preschool learner** from the Academy Family Registry.

Expected flow:

```text
Crechè Home
   ↓
Parent / Family Mentor Account
   ↓
Family + child learner
   ↓
bright named child button
   ↓
active learnerId selected
   ↓
mentor/index.html
```

If there is no active learner, the page shows a friendly locked state with links back to Crechè and to the Parent / Family Profile.

If the active learner belongs to another Khaemenes school stage, the Preschool Mentor does not silently use that learner. It directs the family back to the correct school entrance.

---

## Parent Boundary

The Mentor page is for the child.

It does not contain:

- Parent registration
- Adult account creation
- Adult permission management
- Guardian invitation tools
- Family exports
- Adult Family Guide
- Guardian release forms
- A Child / Parent mode toggle

A clear **Parent Profile** button in the sticky header sends the adult to:

```text
https://vervenveda.com/Khaemenes_Academy.github.io/family/
```

This keeps adult administration out of the young child’s learning interface.

---

## Required Dependencies

The page loads:

```text
../assets/preschool-catalog.js
```

and:

```text
https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js
```

The first supplies activity and Mentor-planning metadata.

The second supplies the active family/learner identity.

If the Family Registry is unavailable, the Mentor stays locked rather than inventing a learner identity. Public Crechè games remain available from the repository root.

---

## Learner Inputs

The Mentor reads available learner information such as:

- learnerId
- nickname
- Preschool stage
- broad age band
- broad interests
- mentorId
- mentorIdentity

For compatibility, missing Preschool fields may be read from the older matching:

```text
khaemenes_preschool_profile_v1
```

The Mentor does not create or overwrite that legacy profile.

---

## Personalized Mentor

Built-in presentations:

| Mentor | Presentation |
|---|---|
| Pip 🌞 | Playful and encouraging |
| Miri 🦉 | Quiet and curious |
| Nova 🚀 | Imaginative and adventurous |
| Sage 🌿 | Steady and patient |

If the learner already has a valid custom visible Mentor identity, the child page can display it while continuing to use the same bounded learning rules.

---

## Bounded Child Interaction

The Mentor deliberately avoids unrestricted private child chat.

Current child controls include:

- Give Me a Hint
- Let’s Play
- I Feel Stuck
- I Need a Break
- Happy
- Okay
- Wiggly
- Tired
- Frustrated

These controls change encouragement and recommendations without collecting free-form private Preschool conversation.

---

## My Learning Path

The Mentor creates a short learning path from the shared Crechè catalog.

Hard eligibility checks include:

- `mentor.eligible === true`
- broad age-band compatibility
- gentle-energy filtering when the child reports tired/frustrated

Ranking can consider:

- broad learner interests
- current session feeling
- activity energy
- novelty
- already explored activities
- deterministic learner/day variation

The path first tries to select different learning domains before filling additional stations.

Current station count:

```text
20 minutes → 3 stations
30 minutes → 4 stations
45 minutes → 5 stations
```

If the legacy Preschool profile does not contain a current duration, the child receives a four-station path.

---

## Learning Garden

The child can also choose a broad learning area:

- Letters & Stories
- Numbers
- Art & Music
- Move & Life Skills
- Weather & Wonder

The page chooses an eligible activity from that area rather than exposing an overwhelming list inside the Mentor.

The complete 52-adventure directory remains on the public Crechè home page.

---

## In-Page App Window

Recommended activities open inside a reusable resizable window.

Controls:

- `×` Close
- Maximize / Restore
- `⭐ I’m Done!`
- Escape to close
- Click the backdrop to close

Marking an activity done adds one local exploration star the first time that activity is completed.

This completion is encouragement/progress, not a formal grade.

---

## Learner-Scoped Progress

Storage key:

```text
khaemenes_preschool_child_mentor_progress_v3
```

Data is stored by `learnerId`.

Current shape is conceptually:

```json
{
  "learner_123": {
    "completed": {
      "activity-id": {
        "completedAt": "ISO timestamp",
        "title": "Activity title"
      }
    },
    "stars": 4,
    "updatedAt": "ISO timestamp"
  }
}
```

---

## Feelings Boundary

Current feelings are held in the page session only.

They affect activity energy and Mentor wording but are not written as a permanent diagnostic or psychological profile.

---

## Friendly Voice Engine

The Mentor does **not** blindly use the browser’s default voice.

Read-aloud:

1. waits for `speechSynthesis.getVoices()`;
2. filters to English;
3. prefers known friendly voice names and `Natural` / `Enhanced` / `Premium` voices;
4. excludes a set of commonly harsh/deep default names;
5. uses modest rate/pitch adjustments;
6. speaks only after a child presses a read-aloud button;
7. refuses to speak if the device exposes no suitable gentle voice.

Voice presentations:

- Sunny
- Benny Bunny
- Rainbow Rae
- Story Owl

Speed choices:

- Slow & gentle
- Storytime
- A little lively

Learner-scoped voice preference key:

```text
khaemenes_preschool_child_mentor_voice_v2
```

---

## Clean Anchor Navigation

The sticky header is measured at runtime.

Same-page links use one navigation function that:

- measures the live header height;
- adds breathing room;
- promotes nested targets to the full section boundary;
- remeasures on resize/orientation change;
- corrects direct hash URLs after load.

The page does not combine competing `scroll-padding` and `scroll-margin` offsets.

---

## No Guest Mode

The final architecture intentionally removes the earlier Guest Mentor implementation.

The access rule is:

```text
Public Crechè games/apps → open
Personalized Preschool Mentor → linked Preschool learner required
Parent administration → Academy Family Profile
```

This is the contract that `mentor-manifest.json`, the root README, and validation should all describe.

---

## Ownership

Copyright © 2026 Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy.

See the repository root `LICENSE.md`, `SECURITY.md`, and `THIRD_PARTY_NOTICES.md` for current terms and notices.
