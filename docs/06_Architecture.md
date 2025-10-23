# Architecture (Cloudflare-First)

- **Mobile**: React Native (Expo)
- **API**: Cloudflare Workers + Hono (TS)
- **Stateful**: Durable Objects (per-chat room; rate limiters)
- **DB**: Cloudflare D1 (SQLite)
- **Cache/Config**: KV
- **Media**: R2 (presigned URLs); Images service for transforms
- **Background**: Queues (moderation, notifications)
- **Realtime**: WebSockets to Durable Objects
- **Analytics**: PostHog or Mixpanel SDK
- **Payments**: Stripe (real-world services)

Environments: staging / production via Wrangler + GitHub Actions.
