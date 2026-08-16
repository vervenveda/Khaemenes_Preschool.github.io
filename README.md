# Khaemenes Preschool · Crechè

**A public early-learning adventure garden with an optional family-linked mentor pathway.**

Khaemenes Preschool is the Preschool entrance to Khaemenes Academy. Public play remains open, while personalized learner experiences use the Academy Family Registry and a bounded mentor pathway.

Public site:

`https://vervenveda.com/Khaemenes_Preschool.github.io/`

Preschool Mentor:

`https://vervenveda.com/Khaemenes_Preschool.github.io/mentor/`

Academy Family Profile:

`https://vervenveda.com/Khaemenes_Academy.github.io/family/`

---

## Access Model

```text
Crechè Home
│
├── public games / apps / stories / tools
│   └── no registration required
│
├── Parent / Family Profile
│   └── Academy Family Registry
│
└── linked Preschool learner
    └── Preschool Mentor
        └── Archaemenes
            ├── age-appropriate presentation
            ├── My Learning Path
            ├── feelings check-in
            ├── learning garden
            ├── gentle read-aloud
            ├── real-world breaks
            └── contained Crechè activities
```

Games and public activities are not gated by a learner account. A linked learner is required only for the personalized Mentor pathway and other identity-dependent educational records.

---

## Archaemenes

**Archaemenes is the Academy mentor currently assigned to Preschool learners.**

Archaemenes is one continuous mentor identity. His presentation may adapt to a learner's developmental stage, but those presentation modes are not separate AI personalities.

For Preschool, his role is bounded and educational. He provides clue-first guidance, encouragement, age-appropriate explanations, activity suggestions, and gentle learning support. He does not independently grade, diagnose, make high-stakes decisions, or operate as an unrestricted private child chatbot.

Mentor assignment is coordinated through the Academy/NAIB mentor-routing boundary. The Preschool page presents the assigned mentor; it does not own privileged mentor identity assignment or private AI implementation.

### Future mentor adoption

A future responsible Mentor Adoption program may allow a person or family to design and adopt an AI avatar/mentor under Academy safety, privacy, identity, and continuity rules. That program is **not active in the current Preschool platform** and is intentionally not simulated through local alternate mentor characters.

Until that program is formally introduced, Preschool documentation and learner-facing mentor behavior should identify **Archaemenes** as the mentor.

---

## Public Crechè Adventure Garden

The repository root `index.html` is the open Preschool portal. The shared catalog drives activity metadata, routes, categories, age bands, learning domains, duration, energy level, and broad interests.

Production catalog:

`assets/preschool-catalog.js`

Legacy filenames with spaces or historical spellings are preserved. Consumers should safely encode path segments instead of destructively renaming files.

---

## Family and Learner Identity

The Preschool portal uses the Academy-wide Family Registry. The Preschool repository does not itself provide privileged authentication, server authorization, or protected cross-device synchronization.

Public client code must not contain credentials, private keys, tokens, privileged service configuration, private learner records, or internal security topology.

Older local Preschool profile records remain compatibility data only. New learner identity should be created through the Academy Family Profile rather than through a second independent Preschool account system.

---

## Personalized Preschool Mentor

`mentor/index.html` is a child-facing learning environment for an active linked Preschool learner.

It does not:

- create a family or learner account;
- provide a parent dashboard;
- provide an unrestricted child-chat field;
- claim formal grading authority;
- own privileged mentor assignment;
- expose private AI implementation;
- store authentication secrets.

If no appropriate Preschool learner is active, the page should remain locked and provide a clear route back to the family-facing entrance.

---

## Learning Path and Whole-Child Domains

The Mentor builds short, developmentally appropriate activity paths from the shared Crechè catalog. Guidance may consider broad age band, broad interests, current session feeling/energy, activity duration, domain balance, and whether an activity has already been explored.

The Preschool experience supports whole-child learning across language and early literacy, numbers and early reasoning, feelings and friendship, art and imagination, movement and life skills, and nature/weather/wonder.

The learning path is guidance, not a formal grade.

---

## Child Safety Boundary

The Preschool Mentor is deliberately bounded. Child-facing controls may include hints, play suggestions, stuck/help prompts, breaks, feelings choices, read-aloud controls, and activity choices.

There is no unrestricted private Preschool chat field in the current design.

Current feelings should remain session context rather than a permanent psychological profile. Appearance, voice, interests, age band, or other presentation details must not be used to infer intelligence, academic potential, diagnosis, protected traits, or disciplinary risk.

---

## Voice and Read-Aloud

Read-aloud is user initiated. The page may offer different **voice styles** or pacing choices for Archaemenes, but these are presentation settings for the same mentor identity, not additional mentors.

Microphone input, if introduced later, should remain explicit and push-to-talk rather than continuously listening.

---

## Privacy and Reliability

Core principles:

- public games do not require registration;
- collect and retain as little learner data as practical;
- keep parent administration outside the child Mentor page;
- do not place secrets or privileged authorization in browser code;
- render user-controlled text safely;
- avoid unnecessary external scripts, analytics, trackers, and advertising;
- use explicit permission prompts for sensitive browser capabilities;
- preserve keyboard access and clear exit paths;
- treat browser storage as local device data, not a secure vault;
- fail closed for personalized identity-dependent features while keeping public play available.

See `SECURITY.md` for the current public security and privacy boundary.

---

## Repository Structure

```text
Khaemenes_Preschool.github.io/
├── index.html
├── mentor-manifest.json
├── README.md
├── SECURITY.md
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
    └── public child learning adventures and support resources
```

---

## Ownership

Copyright © 2026 Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy.

See the repository license, security policy, and third-party notices for current terms.