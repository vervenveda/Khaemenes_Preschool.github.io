# NAIB Mentor Assignment Architecture

## Canonical hierarchy

```text
Person
  ↓
Current page / app / game / school / service
  ↓
NAIB
  ↓
mentor assignment
  ↓
assigned Mentor AI
  ↓
context-specific mentoring
```

NAIB is the assignment and routing authority.

A page must not decide the person's mentor from its own local character table.

## Transitional young-learner policy

Until the full AI Adoption application is available:

```text
Preschool    → NAIB assigns Archaemenes
Kindergarten → NAIB assigns Archaemenes
Elementary   → NAIB assigns Archaemenes
```

Archaemenes is one stable mentor identity. Presentation changes with developmental context:

```text
Preschool 2–3  → Nestling
Preschool 3–5  → Storybook
Kindergarten   → Early Scholar
Elementary     → Young Scholar
```

These are presentation modes, not separate AI personalities.

## Authority boundaries

**Person / Family Registry owns:** stable learner identity, stage, broad age band, permissions, broad interests, and later the adopted-mentor identity reference.

**NAIB owns:** mentor assignment, routing to the appropriate specialist, assignment continuity, and future adopted-mentor routing.

**Assigned mentor owns:** mentoring behavior inside its authorized domain, context-appropriate wording, clue-first guidance, and approved resource suggestions.

**Page owns:** current UI, current task context, bounded controls, local progress display, accessibility presentation, and contained workspace behavior.

**Page does not own:** mentor identity assignment, cross-ecosystem identity, or private AI implementation.

## Future AI Adoption

```text
Person
  ↓
AI Adoption Account
  ↓
NAIB
  ├── reads adopted mentor identity
  ├── reads current context
  └── assigns/routes that mentor
       ↓
same person-owned mentor across school · career · gaming · art · writing · crisis support · veterans · research · etc.
```

Archaemenes remains available to learners who want to keep him.

## Public/private boundary

`khaemenes-naib-mentor-router.js` is only a public transitional contract. It must never contain private Noema implementation, credentials, server secrets, model keys, private reasoning, or unrestricted child-chat endpoints.
