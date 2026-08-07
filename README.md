# Khaemenes Preschool · Crechè

**A local-first early-learning environment for young children, families, caregivers, and educators.**

Khaemenes Preschool is the early-learning entrance to the Khaemenes Academy and Verve N Veda educational ecosystem. It combines a free-choice **Crechè Adventure Garden** with a separate **Guided Preschool Mentor** pathway so children can explore independently with a grown-up or follow a balanced, age-aware learning rhythm.

**Public site:**  
https://vervenveda.com/Khaemenes_Preschool.github.io/

**Guided Preschool Mentor:**  
https://vervenveda.com/Khaemenes_Preschool.github.io/mentor/

---

## Current Program Architecture

Khaemenes Preschool intentionally provides two complementary learning experiences.

### 1. Crechè Adventure Garden

The repository root `index.html` is the open exploration portal.

Children and families can:

- Browse the complete preschool activity garden
- Search by title, topic, description, category, or filename
- Enter subject-based learning rooms
- Save favorite activities
- Pin favorites to an active child profile
- Track visited adventures locally
- Open a daily featured adventure
- Use **Surprise Me** for playful discovery
- Switch to a calmer visual mode
- Open parent and child profile controls
- Continue to Guided Preschool
- Continue toward Kinder Garden and Elementary School
- Export or erase the family-controlled local learning record

The Adventure Garden is designed to preserve child choice, curiosity, play, and exploration.

### 2. Guided Preschool Mentor

`mentor/index.html` provides a more structured educational pathway.

A grown-up helps create a small local learner profile using:

- First name or nickname only
- Broad age band
- General communication/personality style
- Broad interests
- Preferred learning pace
- Approximate daily guided-learning time

The mentor then builds a short, balanced daily path from the preschool activity collection.

The mentor is always identified as an AI learning guide and uses **guided choices rather than an unrestricted private chat box**.

---

## Current Catalog

The production Crechè catalog currently contains:

- **53 catalog entries**
- **52 child learning adventures**
- **1 grown-up support resource**
- **0 duplicate catalog IDs**
- **0 duplicate catalog file paths**
- **0 catalog targets missing from the repository tree**

The current catalog has been validated against the repository tree.

Some historical filenames contain spaces or older spellings. The production portal safely URL-encodes each path segment so those existing routes can remain functional until compatibility-safe aliases are introduced.

Examples include:

```text
apps/Art _resources_index.html
apps/Life_Skills_kitchen_ resipes_index.html
```

These filenames should not be mass-renamed without providing compatibility routes.

---

## Learning Areas

The Crechè collection supports whole-child early learning across several connected areas.

### Language, Literacy & Storytelling

Examples include:

- ABC Story Time
- Alphabet Adventure
- Bilingual ABC
- ABC Bubble Adventure
- Cosmic Alphabet
- ABC Match
- ABC Time
- ABC Adventure Hub
- Cosmic Arabic Alphabet Quest
- Learn a New Word
- Sight Words
- Spelling Game
- Spelling Journal
- Spelling Safari
- Storybird Grove
- Sunny ABCs & 123s Storytime

### Numbers, Shapes & Early Reasoning

Examples include:

- Pre-K Math Cloud
- Numbers 1–12 Fun
- Numbers Drag & Drop
- Shapes Game
- Match the Shapes

### Feelings, Friendship & Social-Emotional Learning

Examples include:

- Feelings Emotional Explorer
- Emotions & Friendship Garden
- Acts of Kindness
- Feelings Game
- Noetic Emotions Explorer

### Art, Music & Creative Expression

Examples include:

- Art Color Studio
- Little Artist Resources
- Color Mixing Studio
- Little Museum
- Match the Colors
- Drawing Tool
- Harmony Haven Staff Studio
- Little Composer Piano

### Movement, Health & Life Skills

Examples include:

- Move & Groove
- How to Brush Your Teeth
- Life Skills Clubhouse
- Little Kitchen Helper
- Little Kitchen Recipes
- Making Your Bed
- Mini Organizer
- Schoolwork Helper
- Walking With a Dog Safely
- Compass Exploration

### Nature, Weather & Wonder

Examples include:

- Weather for Tots
- Sunny's Weather Adventure
- Sunny's Moon Adventure
- Solanar Kid Weather
- The Wondercabinet
- Little Worlds Promenade
- Joke Jar

---

## Guided Mentor Learning Map

The Guided Preschool Mentor currently organizes its educational planning across six whole-child domains:

1. **Language & Early Literacy**
2. **Numbers & Early Reasoning**
3. **Feelings, Friendship & Self-Knowledge**
4. **Art, Music & Imagination**
5. **Movement, Health & Life Skills**
6. **Nature, Weather & Wonder**

The mentor uses broad age bands:

- Ages 2–3
- Ages 3–4
- Ages 4–5
- Ages 5–6

Daily guided-learning rhythms currently support:

- **20 minutes** · 3 short stations
- **30 minutes** · 4 balanced stations
- **45 minutes** · 5 stations with broader rotation

The mentor attempts to balance domains rather than turning preschool into only letters, only mathematics, or only screen-based games.

---

## Mentor Personalities

The current preschool interface includes four communication matches:

| Mentor | Style |
|---|---|
| **Pip** 🌞 | Playful, social, encouraging |
| **Miri** 🦉 | Quiet, curious, patient |
| **Nova** 🚀 | Imaginative, expressive, adventurous |
| **Sage** 🌿 | Steady, patient, determined |

These mentor identities are communication styles, not human identities.

The child is not placed into a fixed academic track because of the selected style.

---

## Adaptive Learning Engine

When available on the shared Verve N Veda origin, Guided Preschool connects to the Khaemenes/Verve **Sovereign Problem-Solving Agent**:

```text
/assessment-engine/agents/core/sovereign-agent.js
```

The shared agent can combine:

- Hard age/stage constraints
- Heuristic ranking
- Monte Carlo outcome simulation
- Interest fit
- Energy fit
- Novelty
- Domain balance
- Age fit
- Local outcome memory

Preschool currently uses short activity constraints and age-stage constraints before an activity can be recommended.

If the shared agent cannot load, the Mentor deliberately falls back to a local deterministic scoring system rather than preventing the child from learning.

The adaptive memory is browser-local and bounded. It is designed to store action/outcome values rather than free-form private learner conversations.

---

## Child Profile & Local Continuity

The active preschool profile uses:

```text
khaemenes_preschool_profile_v1
```

Crechè also maintains learner-scoped favorites and visits and writes a small cross-school continuity record:

```text
khaemenes_learning_continuity_v1
```

The continuity record can include:

- Learner ID
- Nickname
- Broad age band
- Current pathway
- Mentor match
- Broad interests
- Pinned activity metadata
- Favorite activity IDs
- Visited activity IDs
- Last update time

The profile does **not** require:

- Surname
- Exact birthday
- Email address
- Home address
- Student identification number
- Photograph
- Microphone recording
- Account creation

The shared reader is located at:

```text
assets/khaemenes-profile-bridge.js
```

It exposes:

```text
getProfile()
getContinuity()
getPinnedActivities()
getFavoriteIds()
getVisitedIds()
getSummary()
subscribe(listener)
```

---

## Current Continuity Boundary

The Preschool side of cross-school continuity is implemented.

Kinder Garden and Elementary School still need to install the compatible profile bridge/display layer before pinned Crechè activities and learner continuity are visibly surfaced inside those portals.

This repository should therefore be treated as the **source foundation**, not as proof that every downstream school interface is already integrated.

The long-term Khaemenes goal is a continuous learner-controlled pathway:

```text
Preschool
   ↓
Kinder Garden
   ↓
Elementary
   ↓
Middle School
   ↓
High School
   ↓
Higher Learning
```

The mentor is intended to become a shared Khaemenes capability across these repositories, with age-appropriate interfaces and safeguards at each level.

---

## Privacy & Local-First Design

Khaemenes Preschool is designed around minimal data collection and family control.

Core principles include:

- No required user account
- No advertising
- No behavioral advertising profile
- No required cloud database
- No required social-media login
- Browser-local learner records
- User-controlled export
- User-controlled erase/reset
- Guided rather than unrestricted AI interaction for young children
- Short learning sessions
- Adult participation encouraged
- Reduced-motion and calmer visual options

Most activities are local or self-contained.

### Network-Dependent Exceptions

Some learning tools intentionally use outside network services for their educational function.

For example, **Solanar Kid Weather** uses Open-Meteo services for live forecast data and can optionally use browser geolocation when a grown-up chooses **My Location**.

Network-dependent applications should clearly disclose their network and location behavior inside the app.

See:

- `SECURITY.md`
- `THIRD_PARTY_NOTICES.md`

for additional repository-wide information.

---

## Accessibility

Current preschool interfaces include or are designed to support features such as:

- Large touch targets
- Keyboard navigation
- Visible focus states
- Responsive layouts
- Reduced-motion support
- Calm visual modes
- Read-aloud through browser speech synthesis
- Print-friendly output where appropriate
- Clear child/grown-up separation
- Simple language
- Local accessibility preferences

Individual apps may provide additional controls such as larger text, simplified layouts, narration speed, high contrast, or animation controls.

---

## Key Repository Files

```text
Khaemenes_Preschool.github.io/
├── index.html
├── README.md
├── LICENSE.md
├── SECURITY.md
├── THIRD_PARTY_NOTICES.md
├── PROFILE_CONTINUITY_ADAPTER.md
├── CRECHE_LINK_AUDIT.md
├── UPLOAD_INSTRUCTIONS.md
│
├── mentor/
│   ├── index.html
│   └── README.md
│
├── assets/
│   ├── khaemenes-profile-bridge.js
│   ├── ABC.js
│   ├── ABC_arabic.js
│   ├── dictionary.js
│   ├── settings.js
│   ├── story_actions.js
│   └── additional local support files
│
└── apps/
    ├── ABC_Story_Time/
    ├── Art_color_studio/
    ├── Feelings_emotional_explorer/
    ├── Sunny_ABCs_123s_Storytime/
    ├── reading_storybird_grove/
    └── additional preschool applications
```

---

## Current Validation

The current production audit records that:

- The catalog was compared with the recursive repository tree
- All current catalog targets exist
- Catalog IDs are unique
- Catalog paths are unique
- Root HTML parsed successfully
- Element IDs were unique
- JavaScript DOM ID references resolved
- Inline JavaScript passed syntax checking
- The profile bridge passed syntax checking
- Mentor, Kinder Garden, Elementary, Parent Profile, and Child Profile pathways are present

See:

```text
CRECHE_LINK_AUDIT.md
```

for the detailed catalog audit.

---

## Development Priorities

The current architecture is intentionally being consolidated rather than rebuilt.

Near-term priorities are:

1. Maintain one shared preschool activity catalog for both Crechè and Mentor.
2. Maintain one shared preschool learner/profile storage API.
3. Unify export and full learner-data erasure across Crechè and Mentor.
4. Preserve pathway state when the mentor profile is edited.
5. Add profile-aware developmental guidance to the free-choice Adventure Garden.
6. Expand adaptive feedback without collecting unrestricted child text.
7. Make approaches-to-learning and fine-motor development more explicit in the adult-facing learning framework.
8. Install learner-continuity readers in Kinder Garden and Elementary.
9. Extend the Khaemenes mentor architecture through all school repositories.
10. Replace legacy filenames gradually using compatibility-safe aliases rather than destructive renaming.

---

## Educational Philosophy

Khaemenes Preschool is not intended to turn early childhood into a miniature version of secondary school.

The program is designed around:

- Play
- Language
- Relationships
- Curiosity
- Movement
- Creativity
- Early reasoning
- Healthy routines
- Emotional awareness
- Adult-child interaction
- Safe experimentation
- Repetition without penalty
- Progressive independence

The mentor supports the child and the grown-up. It does not replace parents, caregivers, teachers, real human relationships, professional developmental evaluation, or formal educational authority.

---

## Ownership & Use

Khaemenes Preschool is part of the Verve N Veda and Khaemenes Academy educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl, Verve N Veda, and Khaemenes Academy.  
All Rights Reserved.

See `LICENSE.md`, `SECURITY.md`, and `THIRD_PARTY_NOTICES.md` for current repository terms and notices.
