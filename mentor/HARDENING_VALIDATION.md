# Preschool Mentor Hardening Validation

Branch: `hardening/archaemenes-preschool`

## Current mentor authority

The child-facing Preschool Mentor presents **Archaemenes** as the current Academy mentor.

The page does not contain a local alternate-mentor table and does not use legacy `mentorId` or `mentorIdentity` fields to choose the active mentor.

The intended public assignment chain is:

```text
linked Preschool learner
        ↓
Academy / NAIB public mentor router
        ↓
Archaemenes
        ↓
age-appropriate Preschool presentation
```

If the router is unavailable, the page may use the bounded Archaemenes fallback only to prevent a blank child interface. The fallback is not a second assignment authority.

## Runtime hardening completed

- Inline application JavaScript moved to `mentor/mentor.js`.
- Inline page CSS moved to `mentor/mentor.css`.
- The page now uses a restrictive meta Content Security Policy suitable for the current static GitHub Pages surface.
- Referrer policy is `no-referrer`.
- Camera, microphone, geolocation, payment, USB, and browsing-topics permissions are disabled at the page boundary.
- The activity iframe is sandboxed and explicitly denies camera, microphone, geolocation, and payment permissions.
- Activity paths are rejected if they are absolute, contain a protocol, contain `..`, or contain query/hash routing before being placed into the iframe.
- Catalog/user-facing dynamic content is rendered with DOM text nodes / `textContent` rather than executable HTML.
- The learner nickname is rendered as text rather than injected into HTML.
- Feelings remain session context and are not written as a psychological profile.
- Voice playback remains user initiated.
- Existing local progress and voice-preference storage remain learner scoped.
- No unrestricted Preschool chat field is introduced.

## Archaemenes presentation

The same mentor identity may use developmentally appropriate presentation modes supplied by the NAIB router. Voice controls are presentation styles only:

- Bright
- Playful
- Warm
- Story

They are not separate AI mentors.

## Future Mentor Adoption boundary

A future responsible Mentor Adoption program may support person/family-created AI avatars and adopted mentors. That capability is intentionally **not active** in the current Preschool page.

Current public Preschool code must not simulate adoption by locally inventing alternate mentor identities.

## Cross-repository dependency

The hardened Preschool page requests the Academy public router at:

```text
https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-naib-mentor-router.js
```

The corresponding hardened router is currently prepared on:

```text
Khaemenes_Academy.github.io
branch: hardening/archaemenes-preschool-router
```

For the complete hardened path, publish the Academy router update before or together with the Preschool Mentor update.

## Deliberate non-claims

This validation does not claim that browser storage is secure server storage, that a static page provides authentication, or that the public router contains private NOEMA implementation.

Protected identity, authorization, synchronization, account services, private AI implementation, and server secrets remain outside this public client boundary.
