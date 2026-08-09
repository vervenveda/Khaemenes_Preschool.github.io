# Khaemenes Preschool · Crechè

**A public early-learning adventure garden with an optional family-linked personalized Mentor pathway.**

Khaemenes Preschool is the Preschool entrance to Khaemenes Academy. The repository intentionally separates **public play** from **personalized learner identity**.

Public site:

`https://vervenveda.com/Khaemenes_Preschool.github.io/`

Personalized child Mentor:

`https://vervenveda.com/Khaemenes_Preschool.github.io/mentor/`

Academy Family Profile:

`https://vervenveda.com/Khaemenes_Academy.github.io/family/`

---

## Final Access Architecture

```text
Crechè Home
│
├── 52 child games / apps / stories / tools
│   └── public · no registration required
│
├── Parent / Family Mentor Account
│   └── Academy Family Registry
│       ├── one family
│       ├── authorized adults
│       └── separate learner accounts
│
└── linked Preschool learner
    └── bright named Mentor button
        └── mentor/index.html
            ├── child-only personalized Mentor
            ├── My Learning Path
            ├── feelings check-in
            ├── learning garden
            ├── gentle read-aloud
            ├── real-world breaks
            └── Crechè apps in a resizable in-page window
```

**Games and apps are never gated by the learner account.**

The learner account is used when a child enters the personalized Mentor / structured learning path or when persistent academic/curriculum records need a stable learner identity.

There is no Preschool Guest-Mentor mode in the final architecture.

---

## Public Crechè Adventure Garden

The repository root `index.html` is the open Preschool portal.

The current shared catalog contains:

- **53 total catalog entries**
- **52 child adventures**
- **1 grown-up support entry**
- **0 duplicate catalog IDs**
- **0 duplicate catalog paths**
- **0 catalog targets missing from the audited repository tree**

The Adventure Garden supports:

- Full activity browsing
- Search and category filtering
- Adventure Rooms
- Today’s Pick
- Surprise Me
- Browser-local favorites
- Visited activity history
- Child / Grown-Up presentation modes
- Resizable in-page app windows
- Parent / Family Mentor Account entrance
- Named child Mentor buttons after learner registration

Public play remains available even when the Family Registry is unavailable.

---

## Shared Preschool Catalog

The production catalog is:

```text
assets/preschool-catalog.js
```

It is the source of truth for:

- Crechè activity metadata
- File routes
- Categories
- Mentor eligibility
- Mentor age bands
- Mentor learning domains
- Activity duration
- Energy level
- Broad interests

The repository also currently contains a root `preschool-catalog.js` copy. Treat that as a compatibility duplicate; new code should consume `assets/preschool-catalog.js` so catalog metadata is not maintained independently in multiple places.

Legacy filenames with spaces or historical spellings are preserved. Consumers URL-encode each path segment instead of destructively renaming files.

---

## Family and Learner Identity

The Preschool portal uses the Academy-wide Family Registry:

```text
https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js
```

Important shared keys include:

```text
khaemenes_family_registry_v1
khaemenes_active_family_v1
khaemenes_active_adult_v1
khaemenes_active_learner_v1
```

The registry supports a family containing multiple adults and multiple learners. Each learner has a stable learner ID.

The main Crechè page is the family-facing Mentor entrance. Once a Preschool learner is linked, it reveals a bright button using the child’s nickname. Clicking that button selects the learner before opening `mentor/index.html`.

### Current storage boundary

The current Family Registry is local to the shared `vervenveda.com` browser origin. It is an Academy-wide identity model, but this Preschool repository does **not** by itself provide authenticated cross-device synchronization or email invitation delivery. Those capabilities require the separate connected/server account layer.

---

## Legacy Preschool Profile Compatibility

Older Preschool builds used:

```text
khaemenes_preschool_profile_v1
khaemenes_learning_continuity_v1
khaemenes_profile_favorites_v1
khaemenes_profile_visits_v1
```

These records remain compatibility data.

The Academy Family Registry includes a non-destructive `migrateLegacyPreschool()` path so an older learner can be attached to the unified family model without silently erasing existing Preschool data.

New identity creation should happen through the Academy Family Profile rather than through a second independent Preschool child-profile form.

The local bridge remains at:

```text
assets/khaemenes-profile-bridge.js
```

It is a compatibility/continuity reader and does not create an account.

---

## Personalized Preschool Mentor

`mentor/index.html` is a **child-only** learning environment.

It does not:

- Create a family
- Create a learner account
- Offer Guest Mode
- Contain a parent dashboard
- Contain an adult Family Guide
- Collect unrestricted child text
- Claim formal grading authority

It reads the active Preschool learner selected through the Academy Family Registry.

If no Preschool learner is active, it shows a friendly doorway back to the Crechè family entrance and the Academy Parent / Family Profile.

The header always includes a separate **Parent Profile** button for an adult to leave the child environment and manage the family account.

See `mentor/README.md` for implementation details.

---

## My Learning Path

The Preschool repository does not currently contain a separate root `/curriculum/` directory.

The personalized Mentor’s **My Learning Path** is therefore the current structured Preschool guidance interface. It builds a short sequence from Mentor-eligible Crechè activities using:

- Broad age band
- Broad interests
- Current session feeling/energy
- Activity duration
- Learning-domain balance
- Novelty / previously explored activities
- Stable learner-specific daily variation

The path is guidance, not a formal grade.

Formal persistent records should remain linked to the stable learner ID.

---

## Whole-Child Mentor Domains

The shared catalog currently supports six Mentor domains:

1. Language & Early Literacy
2. Numbers & Early Reasoning
3. Feelings, Friendship & Self-Knowledge
4. Art, Music & Imagination
5. Movement, Health & Life Skills
6. Nature, Weather & Wonder

The Mentor balances domains instead of turning Preschool into a single-subject screen routine.

---

## Mentor Communication Styles

Current Mentor presentations:

| Mentor | Style |
|---|---|
| **Pip** 🌞 | Playful, social, encouraging |
| **Miri** 🦉 | Quiet, curious, patient |
| **Nova** 🚀 | Imaginative, expressive, adventurous |
| **Sage** 🌿 | Steady, patient, determined |

A learner record may also carry a custom visible Mentor identity. Custom appearance changes presentation; it does not bypass age, safety, or learning-path rules.

---

## Child Safety Boundary

The Preschool Mentor is not an unrestricted private chatbot.

Child interaction uses bounded controls such as:

- Give Me a Hint
- Let’s Play
- I Feel Stuck
- I Need a Break
- Feelings buttons
- Read-aloud controls
- Activity choices

There is no free-form private child chat field.

The Mentor encourages nearby adult help when appropriate and includes real-world breaks.

---

## Voice and Read-Aloud

The child Mentor uses browser speech synthesis only after a user presses a read-aloud control.

The final voice engine:

- Waits for browser voices
- Filters for English voices
- Prefers known friendly / natural / enhanced voices
- Avoids a list of commonly harsh/deep system voices
- Uses modest pitch changes rather than extreme artificial pitch
- Provides four child-facing voice presentations:
  - Sunny
  - Benny Bunny
  - Rainbow Rae
  - Story Owl
- Provides slow, storytime, and lively speeds
- Refuses to choose an arbitrary default voice when no suitable gentle voice is exposed by the device

Individual Crechè apps may have their own narration systems.

---

## Mentor Progress

The child Mentor stores small learner-scoped local progress under:

```text
khaemenes_preschool_child_mentor_progress_v3
```

Current progress includes:

- Completed Mentor-recommended activity IDs
- Completion time/title
- Exploration star count

This is not a grade or transcript.

Voice preference is learner-scoped under:

```text
khaemenes_preschool_child_mentor_voice_v2
```

Current session feelings are not written as a permanent psychological profile.

---

## Parent Boundary

Parent administration belongs outside the child Mentor page.

The child Mentor header contains:

```text
Parent Profile
```

which links to:

```text
https://vervenveda.com/Khaemenes_Academy.github.io/family/
```

The Academy family layer owns adult identity, learner management, permissions, exports, and future connected account/invitation services.

Preschool should not duplicate those controls inside the child learning environment.

---

## Repository Structure

```text
Khaemenes_Preschool.github.io/
├── index.html
├── mentor-manifest.json
├── README.md
├── VALIDATION.json
│
├── mentor/
│   ├── index.html
│   └── README.md
│
├── assets/
│   ├── preschool-catalog.js
│   └── khaemenes-profile-bridge.js
│
└── apps/
    └── 52 public child learning adventures + grown-up support resource
```

---

## Privacy and Reliability

Core principles:

- Public games do not require registration
- Minimal learner data
- Shared family identity rather than duplicate school accounts
- Browser-local compatibility records
- No advertising
- No unrestricted child chat
- No automatic microphone recording
- No arbitrary background voice playback
- Parent administration outside the child page
- App failure should not disable public Crechè browsing

---

## Ownership

Copyright © 2026 Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy.

See the repository license, security, and third-party notices for current terms.
