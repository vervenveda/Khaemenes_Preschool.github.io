# Khaemenes Guided Preschool Mentor

**A guardian-guided, local-first preschool mentor that organizes short, balanced, age-aware learning paths from the Crechè activity collection.**

**Public Mentor:**  
https://vervenveda.com/Khaemenes_Preschool.github.io/mentor/

**Crechè Adventure Garden:**  
https://vervenveda.com/Khaemenes_Preschool.github.io/

---

## Purpose

The Guided Preschool Mentor gives families a structured alternative to browsing the complete Crechè Adventure Garden.

Rather than asking a very young child to choose from dozens of applications, the mentor prepares a short daily sequence using the learner's:

- Broad age band
- Broad interests
- Preferred guidance style
- Approximate available learning time
- Current energy
- Previous completion history
- Balance across foundational learning domains

The mentor is intended to support:

- Child choice without overload
- Short, developmentally appropriate sessions
- Whole-child balance
- Repetition without monotony
- Adult participation
- Gentle adaptive learning
- Privacy-respecting educational continuity

---

## Important Design Principle

The preschool mentor is **not an unrestricted private chatbot**.

Young children interact through:

- Guided setup choices
- Safe check-in buttons
- Predefined help requests
- Activity recommendations
- Encouragement
- Movement-break suggestions
- Adult-supported learning prompts

Examples of child-facing mentor prompts include:

- I do not know how to start.
- I feel stuck.
- I finished something!
- I need a break.
- Will you do it with me?

This keeps the preschool experience bounded, transparent, and developmentally appropriate.

---

## Mentor Identity

The interface always discloses the mentor as an AI learning guide.

Four current communication matches are available:

| Mentor | Communication style |
|---|---|
| **Pip** 🌞 | Playful, social, encouraging |
| **Miri** 🦉 | Quiet, curious, patient |
| **Nova** 🚀 | Imaginative, expressive, adventurous |
| **Sage** 🌿 | Steady, patient, determined |

These profiles adjust presentation and encouragement. They do not assign ability labels or permanently limit the child's curriculum.

---

## Learner Setup

A grown-up helps create the local profile.

### Step 1 · Learner

The mentor requests:

- First name or nickname
- Broad learning stage
- Grown-up confirmation

Current learning stages:

- Ages 2–3
- Ages 3–4
- Ages 4–5
- Ages 5–6

An exact birthday is not requested.

### Step 2 · Communication Match

The grown-up/child chooses one broad style:

- Playful and social
- Quiet and curious
- Imaginative and expressive
- Steady and determined

### Step 3 · Interests

Current broad interests include:

- Stories
- Numbers
- Art
- Music
- Nature
- Movement
- Helping
- Space

At least two interests are selected.

These preferences influence examples and recommendations but do not narrow the child to only preferred topics.

### Step 4 · Daily Rhythm

Current guidance styles:

- Gentle
- Balanced
- Adventurous

Current time choices:

- **20 minutes** · 3 short stations
- **30 minutes** · 4 balanced stations
- **45 minutes** · 5 stations with a broader rotation

---

## Whole-Child Learning Domains

The mentor uses six current domains.

### 1. Language & Early Literacy

Supports:

- Listening
- Speaking
- Letters
- Sounds
- Vocabulary
- Stories
- Beginning words

### 2. Numbers & Early Reasoning

Supports:

- Counting
- Quantity
- Shapes
- Patterns
- Comparison
- Early problem solving
- Mathematical reasoning

### 3. Feelings, Friendship & Self-Knowledge

Supports:

- Naming feelings
- Kindness
- Friendship
- Boundaries
- Calming
- Help-seeking
- Repair

### 4. Art, Music & Imagination

Supports:

- Color
- Drawing
- Music
- Rhythm
- Creative choice
- Story imagination
- Expression

### 5. Movement, Health & Life Skills

Supports:

- Gross-motor movement
- Healthy routines
- Personal care
- Practical independence
- Safe helping
- Daily routines

### 6. Nature, Weather & Wonder

Supports:

- Nature observation
- Weather
- Moon and sky
- Space
- Directions
- Curiosity
- Beginning scientific reasoning

---

## Daily Plan Blueprints

Current station blueprints are:

```text
20 minutes:
Feelings → Letters → Movement

30 minutes:
Feelings → Letters → Numbers → Creative

45 minutes:
Feelings → Letters → Numbers → Movement → Wonder
```

The mentor then selects a suitable activity for each domain.

This prevents the daily plan from becoming only literacy, only mathematics, or only screen games.

---

## Activity Selection

When a learner profile exists, the mentor evaluates candidate activities using factors such as:

- Broad age fit
- Interest fit
- Current energy fit
- Novelty
- Previous completion
- Underrepresented domains
- Preferred learning pace
- Stable daily rotation

The local fallback scoring model currently weighs these factors rather than choosing a purely random activity.

A deterministic seed is used to avoid needless reshuffling of the same day when the same learning context is preserved.

---

## Sovereign Adaptive Agent

When available on the shared Verve N Veda origin, the mentor imports:

```text
/assessment-engine/agents/core/sovereign-agent.js
```

and creates a local learner-specific `SovereignProblemSolvingAgent`.

The shared agent can combine:

- Heuristic scoring
- Monte Carlo simulation
- Hard constraints
- Outcome memory
- Confidence estimates
- Evidence emission

The preschool mentor currently requests a hybrid decision strategy.

### Current Hard Constraints

An activity can be rejected when:

- It falls outside the selected age band
- It exceeds the short preschool station-length limit

This constraint layer is important: adaptive recommendation never overrides the age/stage requirements simply because an activity scores well in another category.

---

## Local Fallback

If the shared Sovereign Agent cannot load, the mentor enters:

**local safe mode**

The learner can still use Guided Preschool.

The fallback model selects activities using the same general local profile and balance information without requiring the shared agent.

The mentor should never become unusable merely because an optional adaptive module is unavailable.

---

## Outcome Learning

When the child/grown-up marks a recommended station complete, the mentor records the completion in the local preschool progress record.

When the shared adaptive agent is connected, a successful completion can also be passed back as a bounded positive outcome.

The shared memory model stores action/outcome values rather than unrestricted child conversation text.

A future enhancement may add a small structured reflection such as:

- Loved it
- Just right
- Too easy
- Too hard

This should remain button-based rather than collecting private free-form preschool text.

---

## Feelings Check-In

The mentor includes a simple current-session check-in:

- Happy
- Unsure
- Tired
- Excited
- Frustrated
- Calm

The current feeling is used to change encouragement and guidance.

It is not intended to create a diagnostic psychological profile.

The interface states that feelings are kept only in the current browser session.

---

## Progress

Current mentor progress includes:

- Completed activity IDs
- Completion counts
- Completion date
- Daily completed stations
- Completion counts by learning domain

The Whole-Child Learning Map displays local domain activity rather than a formal academic grade.

The mentor can celebrate completion of an entire balanced daily path.

---

## Local Data Keys

Current Guided Preschool keys include:

```text
khaemenes_preschool_profile_v1
khaemenes_preschool_progress_v1
khaemenes_preschool_settings_v1
khaemenes_preschool_daily_plan_v1
```

The shared Crechè continuity architecture also uses:

```text
khaemenes_profile_favorites_v1
khaemenes_profile_visits_v1
khaemenes_learning_continuity_v1
```

The Sovereign Agent uses a learner-specific local memory key.

---

## Profile Continuity

The Mentor and Crechè intentionally share:

```text
khaemenes_preschool_profile_v1
```

This allows the same active learner identity to be recognized by both preschool entry points on the same origin.

The Crechè root page additionally writes:

```text
khaemenes_learning_continuity_v1
```

for future cross-school use.

The reusable reader is:

```text
../assets/khaemenes-profile-bridge.js
```

See the repository root:

```text
PROFILE_CONTINUITY_ADAPTER.md
```

for the current reader API.

---

## Current Integration Boundary

Preschool currently provides the continuity foundation.

Kinder Garden and Elementary School still need to install their compatible profile readers and learner-facing display components before the continuity data becomes visible in those portals.

Do not describe cross-school learner continuity as fully deployed until those receiving repositories have been updated.

---

## Mentor Across Khaemenes Academy

The long-term architecture is for the **mentor to be available throughout all Khaemenes learning repositories**, not only Preschool.

The shared mentor should keep one conceptual identity while changing its interface, permissions, educational behavior, and level of independence for each developmental stage.

A future progression can follow:

```text
Preschool
  Guided choices
  Short stations
  Grown-up-supported setup
        ↓
Kinder Garden
  Early learning guidance
  Readiness and playful routines
        ↓
Elementary
  Daily planning
  Skill support
  Project encouragement
        ↓
Middle School
  Study planning
  Reflection
  Adaptive practice
        ↓
High School
  Course navigation
  Mastery support
  Academic planning
        ↓
Higher Learning
  Research support
  Advanced study planning
  Independent-learning assistance
```

This should be implemented as a shared Khaemenes mentor architecture rather than copying unrelated mentor logic into every repository.

---

## Recommended Shared-Mentor Direction

As the ecosystem is consolidated, mentor-specific shared modules should eventually move toward a common public layer, for example:

```text
vervenveda.com/
└── assessment-engine/
    └── mentor/
        ├── mentor-core.js
        ├── learner-context.js
        ├── recommendation-adapter.js
        ├── evidence-adapter.js
        └── safety-policy.js
```

Each repository can then provide a small school-level adapter such as:

```text
preschool-mentor-adapter.js
elementary-mentor-adapter.js
middle-mentor-adapter.js
high-mentor-adapter.js
higher-learning-mentor-adapter.js
```

This is a planned architecture, not a claim that these files already exist.

---

## Privacy

The Guided Preschool Mentor is local-first.

The current design does not require:

- Full legal name
- Exact date of birth
- Email
- Address
- Photograph
- Student ID
- Account
- Cloud profile
- Open private messaging

The profile and learning progress remain in browser storage unless a grown-up deliberately exports the record.

The current export identifies the data as a local educational record and explicitly states that adaptive-agent evidence is not a formal grade.

---

## Grown-Up Controls

The Mentor includes grown-up controls for:

- Editing the child profile
- Exporting the local mentor record
- Erasing mentor profile/progress/settings
- Calm colors
- Reduced movement
- Reading the mentor message aloud

The grown-up area also makes clear that:

- No account is required
- Advertising/analytics are not part of the mentor
- Open private messaging is disabled
- The mentor has no formal grading authority
- A nearby grown-up is recommended

---

## Accessibility & Comfort

Current features include:

- Large controls
- Keyboard focus states
- Reduced-motion mode
- Calm colors
- Responsive design
- Built-in browser speech synthesis
- Short activity rhythm
- Movement-break suggestions
- Simple guided prompts

---

## Important Data-Consolidation Work Still Planned

The current Mentor and Crechè pages share the active child profile but still maintain some separate surrounding records.

Planned consolidation includes:

1. One shared preschool activity catalog.
2. One shared preschool learner/profile storage API.
3. One complete learner export across Crechè and Mentor.
4. One true erase-all learner operation across both preschool experiences.
5. Preservation of all profile fields when either interface edits the shared learner.
6. Shared structured adaptive feedback.
7. Cross-school continuity readers.
8. Shared Khaemenes mentor availability throughout the Academy.

Until that consolidation is complete, the current separate storage boundaries should remain documented honestly.

---

## Repository Location

```text
Khaemenes_Preschool.github.io/
└── mentor/
    ├── index.html
    └── README.md
```

The mentor opens activities from:

```text
../apps/
```

and shares the same public custom-domain origin as the main Crechè portal.

---

## Development Principle

The mentor should grow **with** the learner without trying to replace human relationships.

It is intended to help a learner:

- Begin
- Choose
- Practice
- Notice progress
- Ask for help
- Take breaks
- Build confidence
- Develop independence gradually

For preschool, adult participation remains part of the educational design.

---

## Ownership & Use

Khaemenes Guided Preschool is part of Khaemenes Academy and the Verve N Veda educational ecosystem.

Copyright © 2026 Jennifer Kay Pearl, Verve N Veda, and Khaemenes Academy.  
All Rights Reserved.

See the repository root `LICENSE.md`, `SECURITY.md`, and `THIRD_PARTY_NOTICES.md` for current terms and notices.
