# Project Overview

**Kippenstummel** is a community-driven platform for collaboratively mapping and
rating cigarette vending machines (CVMs). Users can register CVM locations,
verify and correct positions, and rate machines based on availability and
functionality. A reputation system based on karma and trust scores ensures
data quality through swarm intelligence — rewarding reliable contributors and
surfacing inaccurate or outdated entries.

The platform consists of four components:

- **API** — backend service providing the core business logic, data persistence,
  and REST API consumed by all other components
- **Web** — browser-based map frontend for end users; allows registering, locating,
  and rating CVMs, and manages anonymous user identities and karma
- **KMC** _(Kippenstummel Management Console)_ — internal tooling for moderators
  to review reported machines, manage trust scores, and handle abuse cases
- **CredLib** — utility library containing algorithms for calculating
  an user's credibility.

This repository contains the **Web** component of the Kippenstummel project.

## Functionality

Kippenstummel is a crowd-sourced map of cigarette vending machines (CVMs). The
core use case is simple: users report CVM locations, and the community
collectively verifies and maintains their accuracy over time.

**Map & Discovery**
The map displays all registered CVMs, clustered at lower zoom levels for
clarity. Each machine is represented by a badge-coded marker reflecting its
current trust level, derived from its score (ranging from -10 to +10):

- **Top Rated** (+5 to +10) — repeatedly confirmed as working and correctly located
- **Neutral** (0 to +4) — not yet well-verified or mixed feedback
- **Bad** (-1 to -7) — frequently reported as missing or defective
- **For Deletion** (-8 to -10) — likely invalid; pending removal

**CVM Lifecycle**
Any registered user can submit a new CVM location. When submitting, the
reporter provides the exact coordinates (typically via GPS). From that point,
the community takes over: users who encounter the machine in the real world can
upvote it (working, correctly placed) or downvote it (missing, broken, wrong
location). If a machine's position is slightly off, any user can propose a
coordinate correction without re-registering it. In severe cases — spam,
abuse, or gross misplacement — machines can be flagged for moderator review.

**Identity & Anonymity**
Active participation requires an account, but Kippenstummel avoids traditional
registration. Instead, users receive an anonymous identity — no email, no phone
number. This identity is personal and persistent, and tied to all interactions
on the platform.

**Karma & Permissions**
Every user accumulates karma based on the quality and reception of their
contributions. Registering machines that other users confirm as accurate
increases karma; contributing low-quality or incorrect data decreases it.
Karma directly influences a user's permissions and ability to act on the
platform, creating a self-regulating trust hierarchy.

**Moderation**
Moderators operate independently of the crowd-rating system and handle
escalated cases — abuse reports, spam, or systematic data manipulation — that
fall outside what swarm intelligence alone can resolve reliably.

## Tech Stack

- **Runtime**: Node.js 24+, TypeScript 5+
- **Framework**: Next.js 15+ (App Router) with React 19+
- **Styling**: Tailwind CSS v4+, `tailwind-variants` for component variants
- **UI Components**: React Aria Components with `tailwindcss-react-aria-components`
- **Map**: MapLibre GL via `react-map-gl`, map tiles from OpenFreeMap
- **State Management**: Redux Toolkit with `redux-persist` for client-side
  persistence; SWR for server-state / data fetching
- **Forms**: Formik + Yup
- **i18n**: `next-intl` (currently `de` and `en`)
- **PWA**: Serwist (service worker, offline fallback, map tile caching)
- **Animation**: Motion
- **Analytics**: Ackee (privacy-friendly, self-hosted)
- **Testing**: Vitest (unit), Playwright (e2e), Storybook + Chromatic (UI)

## Project Structure

```
.
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   ├── bff/                  # BFF proxy routes forwarding to the API
│   │   │   ├── geocoding/            # Geocoding API route
│   │   │   └── runtime-config/       # Runtime config endpoint for CSR
│   │   ├── layout.tsx
│   │   └── [locale]/                 # Localized pages (de/en)
│   │       ├── map/                  # Main map view
│   │       ├── cvms/                 # CVM detail pages
│   │       ├── leaderboard/          # Karma leaderboard
│   │       ├── transfer/             # Identity transfer flow
│   │       ├── home/                 # Landing/home page
│   │       ├── @modal/               # Parallel route for modal overlays
│   │       └── globals.css           # Tailwind base styles and customizations
│   ├── components/                   # UI components (Atomic Design)
│   │   ├── atoms/                    # Single-purpose base components
│   │   ├── molecules/                # Composed components
│   │   ├── organisms/                # Full sections and feature blocks
│   │   └── templates/                # Page-level layout templates
│   ├── contexts/                     # React context providers
│   ├── hooks/                        # Custom React hooks
│   ├── store/                        # Redux store and slices
│   │   └── slices/                   # ident, session, location, privacy, usability
│   ├── lib/                          # Utilities and shared logic
│   │   ├── bff/                      # BFF proxy helper (server-side)
│   │   ├── types/                    # Shared TypeScript types
│   │   ├── utils/                    # General utility functions
│   │   ├── constants.ts
│   │   ├── geo.ts                    # Geospatial helpers
│   │   └── encrypt.ts                # Client-side encryption utilities
│   ├── api/                          # Typed API client
│   ├── i18n/                         # next-intl routing and config
│   ├── middleware.ts                  # next-intl i18n middleware
│   └── sw.ts                         # Serwist service worker
├── messages/                         # Localization files (de.json, en.json)
├── data/                             # Static data (e.g. region definitions)
├── scripts/                          # Code generation scripts
├── public/                           # Static assets
├── tests/                            # Playwright e2e tests
├── .storybook/                       # Storybook configuration
├── next.config.ts
├── tailwind.config.mjs
├── playwright.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Design Decisions

- **Atomic Design**: Components are structured following atomic design
  principles — atoms, molecules, organisms, templates. This promotes
  reusability and makes composing complex UIs from simple, well-tested
  building blocks straightforward.
- **BFF Proxy**: The web frontend never talks directly to the Kippenstummel
  API from the browser. All API requests are routed through Next.js API routes
  acting as a Backend-for-Frontend proxy. This keeps the backend URL
  server-side only and allows adding auth headers, caching, or rate limiting
  transparently.
- **PWA with Offline Support**: The app is a fully installable PWA via
  Serwist. A service worker pre-caches the app shell and serves an offline
  fallback page for navigation requests. Map tiles from OpenFreeMap are cached
  client-side (CacheFirst, 30 days) to support offline or low-connectivity map
  browsing.
- **Redux for Client State, SWR for Server State**: Persistent client-side
  state (identity, session, user preferences) lives in Redux with
  `redux-persist`. Remote data (CVMs, leaderboard) is fetched and cached via
  SWR. The two concerns are kept strictly separate.
- **Anonymous Identity on the Client**: Identity credentials are stored
  client-side (persisted via Redux). Device-to-device transfer is handled via
  an encrypted token flow; the secret is encrypted in the browser before being
  sent to the server and decrypted only on the receiving device.
- **Parallel Routes for Modals**: Sheet/modal overlays (e.g. CVM detail,
  registration flow) use Next.js parallel routes (`@modal`) so they are
  deep-linkable, respect browser history, and don't require client-side modal
  state management.
- **Strict Typing**: The project targets strict TypeScript throughout. Shared
  types live in `src/lib/types`, API response shapes are typed at the API
  client layer, and no `any` escapes into component code.
- **Barrel Exports per Module**: Each component group and library module
  exposes a clean public API via `index.ts`. Internal implementation details
  are not directly importable from outside.
- **Storybook for UI Development**: Components are developed and tested in
  isolation via Storybook. This ensures visual consistency and documents
  component APIs independently of the application.
- **i18n from the start**: All user-facing strings are externalized into
  `messages/` via `next-intl`. No hardcoded UI strings exist in component
  code.
