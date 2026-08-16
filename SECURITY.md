# Khaemenes Preschool Security & Privacy

Khaemenes Preschool is a public educational surface of Khaemenes Academy. This document describes the public security and privacy expectations for the preschool website and its learner-facing applications.

## Public security boundary

This repository is a public client surface. It must not contain credentials, private keys, access tokens, server secrets, private API configuration, privileged administrative logic, private learner records, or internal security topology.

Any protected account, identity, synchronization, or administrative capability must be enforced by an authorized server-side service. Browser-side controls are never treated as authentication or authorization boundaries.

## Child and family privacy

Preschool experiences should minimize personal data. Learner-facing pages should collect only information necessary for the immediate educational experience and should avoid requesting sensitive information from children.

Where local browser storage is used, it may hold items such as preferences, progress, selected activities, or locally created work. Local browser storage is device data, not a secure vault, and should not be used for passwords, authentication secrets, government identifiers, financial information, medical records, or other highly sensitive information.

Parents, guardians, and educators should remain able to review and remove locally stored learner information.

## Mentor and AI boundary

Learner-facing mentor pages may present an approved Academy mentor and age-appropriate educational guidance. Public pages do not own privileged mentor assignment, cross-system identity, private AI implementation, or unrestricted child-chat authority.

Mentor behavior for young learners should remain bounded, clue-first, age-appropriate, educational, and non-coercive. A mentor should not claim to diagnose a child, determine intelligence or ability from appearance or demographics, or make high-stakes decisions for a learner or family.

## Network behavior

Pages should prefer local assets and narrowly scoped, approved network requests. External scripts, trackers, analytics, advertising, unnecessary third-party embeds, and silent background collection should not be introduced into child-facing pages.

Any future authenticated network feature must use secure transport and server-side authorization. Public JavaScript must never embed privileged credentials.

## Content and rendering safety

User-controlled text should be rendered as text rather than executable HTML. Dynamic HTML insertion should be avoided for untrusted content. URLs, imported files, and cross-window messages should be validated before use.

Child-facing pages should avoid `eval`, dynamically constructed executable code, unsafe inline event handlers, and unrestricted remote content.

## Permissions

Microphone, camera, geolocation, notifications, clipboard, and similar browser capabilities should remain off unless a specific feature requires them. When a capability is needed, activation should be explicit, visible, and initiated by the user.

Voice input, when available, should be push-to-talk or similarly explicit rather than continuous listening.

## Accessibility and safety

Security changes should preserve keyboard access, screen-reader compatibility, readable text, reduced-motion preferences, and the ability for a child or guardian to exit an activity easily.

Safety controls must not rely on color alone and should not trap the learner inside a modal or activity.

## Reporting a security concern

Please report security concerns privately through an official Verve N Veda or Khaemenes Academy contact channel. Include the affected page, a concise description, reproduction steps, and the browser/device involved when relevant.

Do not include passwords, tokens, private keys, student records, or unrelated personal information in a report.

Responsible reports should avoid destructive testing, denial-of-service activity, social engineering, credential attacks, or accessing information that does not belong to the reporter.

## Supported surface

Security work is focused on the current published version of Khaemenes Preschool. Archived or copied versions may not receive current fixes.

## Public documentation rule

Public documentation may describe learner-facing behavior, privacy expectations, accessibility, and general safety principles. Private implementation details, protected routing, privileged service contracts, credentials, and internal security controls do not belong in this repository.
