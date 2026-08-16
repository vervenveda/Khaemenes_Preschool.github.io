# Preschool Mentor — NAIB → Archaemenes integration

Target: `mentor/index.html`

Current authority model:

```text
Preschool Mentor Page
        ↓
       NAIB
        ↓
mentor assignment
        ↓
   Archaemenes
        ↓
age/stage-adaptive presentation
```

The page owns child-safe controls, learner-scoped progress, activity recommendations, session feelings, contained activity presentation, accessibility, and read-aloud controls. The page does **not** own privileged mentor assignment.

## Required public dependencies

The Mentor page should load the shared Preschool catalog, Academy Family Registry, and the Academy public NAIB mentor router.

The public router is a transitional contract only. It must not expose credentials, server secrets, private AI implementation, unrestricted child-chat endpoints, or privileged authorization logic.

## Remove local alternate mentor authority

The old local mentor table must be removed from the production Mentor page. The page should not select a mentor from local learner fields or a local character list.

Use a single safe visual fallback only to avoid a blank interface if the public router does not load:

```js
const ARCHAEMENES_FALLBACK=Object.freeze({
  id:"archaemenes",
  name:"Archaemenes",
  title:"Scholar Owl",
  avatar:"🦉",
  colors:["#48baf0","#6bd8e7"],
  intro:"I am Archaemenes the Owl. Let’s look closely, wonder together, and choose one good next step.",
  presentationMode:"preschool-fallback",
  assignedBy:"NAIB"
});
```

The fallback is presentation continuity, not a second assignment authority.

## Ask NAIB for the mentor

The page should call the public router with only the minimum context required for the educational presentation. Do not pass private account data or privileged identifiers merely to style the Mentor.

Conceptually:

```js
const assignment=window.KhaemenesNAIB?.assignMentor?.({
  stage:learner?.stage||"preschool",
  ageBand:currentAgeBand(),
  surface:"khaemenes-preschool-mentor",
  intent:"learning-mentor"
});

const mentor=(assignment?.status==="assigned"&&assignment.mentor)
  ? assignment.mentor
  : ARCHAEMENES_FALLBACK;
```

The current Academy policy returns Archaemenes for Preschool learners.

## Presentation modes

Developmental presentation may adapt Archaemenes for younger or older Preschool learners. These modes are not different AI identities.

Voice choices should likewise be labeled as **voice styles** or pacing/tone options for Archaemenes. They must not appear to the child or documentation as separate mentors.

## Future Mentor Adoption

A future responsible Mentor Adoption program may permit a person or family to design and adopt an AI avatar/mentor under Academy safety, privacy, identity, guardian, and continuity rules.

That program is not active yet. The current Preschool page must not simulate future adoption through local alternate mentor characters or locally self-assigned custom mentors.

When the future service is introduced, Preschool should continue asking NAIB for the authorized mentor. The implementation behind the router can change without transferring mentor authority to the page.

## Hardening requirements for the production page

Before merging the Mentor integration to production:

- remove the local alternate mentor table;
- do not use legacy `mentorId` or `mentorIdentity` as assignment authority;
- validate activity routes against the approved Preschool catalog;
- sandbox the contained activity iframe as tightly as practical;
- render learner-controlled text safely;
- keep microphone use explicit and non-continuous;
- preserve keyboard escape and guardian exit paths;
- keep personalized identity-dependent features fail-closed;
- do not embed secrets or private topology in public code.
