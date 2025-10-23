# Feature: Chat

**Trigger**: Mutual like.

**MVP Capabilities**
- Text (links allowed; redact phone/email until later)
- Optional media upload (moderated)
- Report/block user

**Tech**
- WebSockets on Workers; Durable Object per-room
- D1 for messages, R2 for media (presigned URLs)
