# MVP Roadmap (Draft)

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Planning & Design | 2w | PRD, wireframes, API schema |
| Core Backend | 3w | Auth, Profiles, Deck, Matchmaking, Chat infra |
| Mobile App | 4w | RN screens: onboarding, deck, chat, booking |
| QA & Beta | 2w | E2E tests, app store compliance |
| Soft Launch | 2w | Invite-only rollout, analytics tuning |

Milestones
- M1: Design complete
- M2: API ready
- M3: Mobile Alpha
- M4: Beta launch

## Sprint 0 Progress (2025-10-23)

- ✅ Monorepo scaffolding live (`apps/api`, `apps/mobile`, shared tokens) with tooling (`pnpm` workspaces, Wrangler 4, Expo SDK 51).
- ✅ Cloudflare Worker exposes `/health`, `/deck`, and `/me/profile` with Zod validation and 18+ guard (in-memory persistence for now).
- ✅ Expo app gates navigation on profile completion, implements profile setup form using `react-hook-form` + `zod`, and persists to the Worker API.
- ✅ Deck swipe loop wired: Worker now supports `/deck/:id/like|pass` with mocked match creation, Expo deck uses gesture-based cards + optimistic analytics, and Matches tab renders fake data from `/matches`.
- ⏳ Next up: replace in-memory storage with D1 tables, add real matchmaking logic/Durable Objects, and build chat UI fed by `/matches/:id/chat`.
