# Rumbler Mobile (Expo)

## Running the app

```bash
npm install
npm run start --workspace @rumbler/mobile
```

Use `npm run ios --workspace @rumbler/mobile` or `npm run android --workspace @rumbler/mobile` to launch the corresponding simulator.

## Structure

- `App.tsx` wires up React Navigation, React Query, and pulls shared tokens from `design/rumbler_tokens.ts`.
- `app.json` includes the Expo manifest and a placeholder `apiBaseUrl` pointing to the local Cloudflare Worker (`http://localhost:8787`).
- `package.json` depends on Expo SDK 51, React Navigation, and React Query per the tech stack notes.

Replace the mocked deck data once the `/deck` endpoint is implemented in the Worker. Connect authentication, onboarding, profile setup, and chat flows in follow-up issues.
