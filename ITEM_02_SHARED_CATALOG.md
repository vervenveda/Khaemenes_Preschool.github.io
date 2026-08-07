# Item 02 · Shared Preschool Activity Catalog

## Goal

Crechè and Guided Preschool currently describe the same applications in two independent arrays.

This update creates:

```text
assets/preschool-catalog.js
```

as the single source of truth.

The root Crechè page keeps its current canonical activity IDs, because those IDs already power:

- Favorites
- Visits
- Child-profile pins
- Continuity exports
- Search
- Daily adventures

The Mentor keeps its current activity IDs through `mentor.legacyId` compatibility aliases so existing mentor progress does not reset.

---

## Verified catalog totals

The generated catalog validates:

```text
53 total catalog entries
52 child adventures
1 grown-up support resource
36 mentor-eligible activities
0 duplicate canonical IDs
0 duplicate file paths
0 duplicate mentor legacy IDs
```

Mentor metadata is validated for:

- Known domain
- Known age bands
- Known energy level
- Station duration of 1–12 minutes

---

## Upload

Add:

```text
Khaemenes_Preschool.github.io/
└── assets/
    └── preschool-catalog.js
```

Then make the two small page edits described in:

```text
ROOT_INDEX_CATALOG_PATCH.txt
mentor/MENTOR_INDEX_CATALOG_PATCH.txt
```

No app files move or change.

---

## Architecture after Item 02

```text
                         assets/preschool-catalog.js
                                  │
                     ┌────────────┴────────────┐
                     │                         │
                     ▼                         ▼
            Crechè Adventure Garden      Guided Preschool
                index.html               mentor/index.html
                     │                         │
          canonical catalog IDs       compatibility mentor IDs
                     │                         │
                     └────────────┬────────────┘
                                  │
                             same app files
                                  │
                               apps/
```

---

## Shared data shape

Each catalog item now has the stable Crechè fields:

```js
{
  id,
  title,
  file,
  category,
  icon,
  desc,
  tags,
  mentor
}
```

A mentor-eligible activity additionally has:

```js
mentor: {
  eligible: true,
  legacyId,
  domain,
  ages,
  minutes,
  energy,
  interests,
  desc
}
```

An activity not currently used by Guided Preschool has:

```js
mentor: {
  eligible: false
}
```

This makes mentor eligibility an explicit property of the same activity
record instead of requiring a second catalog.

---

## Runtime API

The global API is:

```js
window.KhaemenesPreschoolCatalog
```

Available members:

```text
version
categories
mentorDomains
activities
byId(id)
byFile(file)
byMentorId(id)
childActivities()
grownupActivities()
mentorActivities(options)
validate()
```

Example:

```js
const catalog = window.KhaemenesPreschoolCatalog;

console.log(catalog.validate());
console.log(catalog.childActivities().length);      // 52
console.log(catalog.mentorActivities().length);     // 36
```

---

## Why a normal script instead of an ES module?

The repository currently consists largely of standalone HTML applications.

Using a normal browser script:

```html
<script src="./assets/preschool-catalog.js"></script>
```

keeps the integration simple, works with the current static hosting model,
and avoids forcing every existing page into module syntax.

The shared Sovereign Agent can remain an ES-module import because that engine
already has a module architecture of its own.

---

## Important compatibility rule

Do not rename the canonical `id` values casually.

They are already used by learner favorites and continuity records.

Do not remove `mentor.legacyId` until a deliberate progress-data migration
has been written and tested.

---

## Next item

After both pages consume this catalog, Item 03 can build one shared learner
profile/storage API without also having to reconcile two independent activity
lists.
