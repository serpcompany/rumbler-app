
# Rumbler App Monorepo

This repository hosts the engineering handoff for the Rumbler MVP. It contains:

- `apps/api` – Cloudflare Workers (Hono) API with `/health`, `/deck`, `/deck/{id}/like|pass`, `/matches`, and `/me/profile` (Zod validation + 18+ gate, in-memory storage for now).
- `apps/mobile` – Expo React Native client that gates navigation on profile completion, persists onboarding forms via the API, and implements a swipeable deck with optimistic match tracking.
- `design/` – TypeScript design tokens generated from the Figma `globals.css`.
- `docs/` – Product requirements, architecture notes, and API spec.
- Root `src/` – Existing Vite design prototype for desktop review of the Figma flows.

## Getting Started

```bash
npm install
```

### Design prototype (web)

```bash
npm run dev
```

### Cloudflare API (Workers)

```bash
npm run dev:api
```

Served on <http://localhost:8787> by default. Update `apps/api/wrangler.toml` with real bindings when provisioning infrastructure.

### Mobile app (Expo)

```bash
npm run dev:mobile
```

This launches Expo Dev Tools and points to the API base URL defined in `apps/mobile/app.json` (`http://localhost:8787` by default).

## Shared Tokens

Tokens live in `design/rumbler_tokens.ts` and export `colors`, `spacing`, `radii`, `typography`, `shadows`, and motion primitives. Import them from packages via relative paths or the `@design/*` tsconfig alias.

Refer to `docs/00_README.md` for a directory index of the broader product documentation.
  
