# Rumbler API (Cloudflare Workers)

## Getting Started

```bash
npm install
npm run dev --workspace @rumbler/api
```

This starts `wrangler dev` using the local Hono server. The default entry point is `src/index.ts`.

## Routes

- `GET /health` – Basic liveness probe for monitoring.
- `GET /deck` – Placeholder implementation returning a mocked fighter deck. Replace with D1-backed matchmaking logic.

## Environment Bindings

Bindings are declared in `src/index.ts` and should align with `wrangler.toml`:

- `DB` – Cloudflare D1 database (primary relational store).
- `MATCHMAKER_DO` – Durable Object coordinating swipe/match state.
- `CHAT_DO` – Durable Object for chat rooms (WebSocket fan-out).
- `MEDIA_BUCKET` – R2 bucket for user-uploaded media.
- `ANALYTICS_QUEUE` – Cloudflare Queue for async analytics fan-out.

Populate secrets via `wrangler secret put` as endpoints come online.
