# Khaemenes Preschool · Crechè

**A public early-learning adventure garden connected to one Academy-wide family identity and one Academy Mentor: Archaemenes.**

Khaemenes Preschool is the Preschool entrance to Khaemenes Academy. The repository intentionally separates **open public play** from **family-linked learner continuity**.

Public Preschool site:

`https://vervenveda.com/Khaemenes_Preschool.github.io/`

Academy Family Profile:

`https://vervenveda.com/Khaemenes_Academy.github.io/family/`

Single Academy Mentor:

`https://vervenveda.com/Khaemenes_Academy.github.io/mentor/`

The historical Preschool path `/mentor/` is retained only as a compatibility redirect to Archaemenes.

---

## One-Mentor Architecture

```text
Crechè Home
│
├── 52 child games / apps / stories / tools
│   └── public · no registration required
│
└── Mentor doorway
    │
    ├── no active family session
    │   └── Academy Family Profile
    │
    └── active family session
        └── selected learner in Academy Family Registry
            └── Archaemenes · Academy Mentor
```

There is **one Mentor program** across the Academy.

Preschool does not maintain a second Mentor identity, Guest Mentor, separate parent dashboard, separate learner-account authority, or separate Mentor chatbot.

Archaemenes remains one continuous identity while adapting his presentation to the learner's registered stage:

- **Wise Owl** — Preschool and Kindergarten
- **Academy Mentor** — school-age learners
- **Scholar** — Higher Learning

For Preschool and Kindergarten, the Mentor uses bounded prompt choices rather than unrestricted private child text chat.

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
- Parent / Family entrance
- Named learner Mentor buttons after family registration

Public play remains available even when no learner is registered.

---

## Shared Preschool Catalog

The production catalog is:

`assets/preschool-catalog.js`

It is the source of truth for Crechè activity metadata, file routes, categories, Mentor eligibility, age bands, learning domains, duration, energy level, and broad interests.

Legacy filenames with spaces or historical spellings are preserved. Consumers URL-encode each path segment instead of destructively renaming files.

---

## Family and Learner Identity

Preschool uses the Academy-wide Family Registry:

`https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js`

Important shared keys include:

```text
khaemenes_family_registry_v1
khaemenes_active_family_v1
khaemenes_active_adult_v1
khaemenes_active_learner_v1
```

The Family Registry supports multiple authorized adults and multiple learners under one family. Each learner has a stable learner ID.

A named child Mentor button first selects that learner in the Family Registry and then opens the Academy-hosted Archaemenes Mentor. Learner and family IDs are not placed in the URL.

Because the Academy Mentor and Family Registry are both hosted under the shared `vervenveda.com` origin, Archaemenes can read the active learner directly from the same browser-local family continuity layer.

### Current storage boundary

The Family Registry is currently browser-local to the shared `vervenveda.com` origin. Authenticated cross-device synchronization and email invitation delivery require the separate connected account service.

---

## Legacy Preschool Compatibility

Older Preschool builds used independent local records such as:

```text
khaemenes_preschool_profile_v1
khaemenes_learning_continuity_v1
khaemenes_profile_favorites_v1
khaemenes_profile_visits_v1
```

These remain compatibility data only.

The Academy Family Registry includes a non-destructive `migrateLegacyPreschool()` path so older learner information can be attached to the unified family model without silently erasing existing Preschool data.

New family and learner identity should be created through the Academy Family Profile.

The historical file:

`mentor/index.html`

no longer contains a separate Mentor application. It is now a redirect-only compatibility doorway to the Academy Archaemenes Mentor.

---

## Archaemenes and Early Learners

Archaemenes is the Academy's educational Mentor. He is patient, observant, curious, thoughtful, calm, encouraging, scholarly, respectful, and fair-minded.

His younger-learner expression is **Wise Owl**: warm, playful, concrete, clue-first, and discovery-oriented.

For early learners, bounded controls can include prompts such as:

- Give me a clue
- Let’s learn something
- I feel stuck
- I need a break

The early-learning Mentor surface does not provide unrestricted private child text chat.

---

## Parent Boundary

Parent administration belongs in the Academy Family Profile, not inside a child Mentor page.

The Academy family layer owns:

- family identity
- learner registration
- active learner selection
- adult relationships and permissions
- placement
- exports
- future connected account and invitation services

Preschool should not duplicate those controls.

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
│   ├── index.html   ← redirect-only compatibility doorway
│   └── README.md
│
├── assets/
│   ├── preschool-catalog.js
│   └── khaemenes-profile-bridge.js
│
└── apps/
    └── 52 public child learning adventures + grown-up support resource
```

The active Mentor implementation now belongs to:

```text
Khaemenes_Academy.github.io/mentor/index.html
```

---

## Privacy and Reliability

Core principles:

- Public games do not require registration
- One family identity model
- One active Mentor program
- Minimal learner data
- No learner or family IDs in Mentor URLs
- Browser-local compatibility records
- No advertising
- No unrestricted private child chat for early learners
- No automatic microphone recording
- Parent administration outside the child Mentor surface
- Failure of the family or Mentor layer must not disable public Crechè browsing

---

## Ownership

Copyright © 2026 Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy.

See the repository license, security, and third-party notices for current terms.
