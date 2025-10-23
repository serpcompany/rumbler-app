import type {
  DurableObjectNamespace,
  Queue,
  R2Bucket,
  D1Database,
} from '@cloudflare/workers-types';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';

const USER_ID = 'demo-user';

const profileSchema = z
  .object({
    photoUrl: z.string().url().optional(),
    gender: z.enum(['male', 'female', 'nonbinary', 'prefer_not_to_say']),
    dob: z.string().refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }, 'Invalid date'),
    disciplines: z.array(z.string().min(1)).min(1, 'Select at least one discipline'),
    stance: z.string().optional(),
    heightCm: z.coerce.number().int().min(0).optional(),
    reachCm: z.coerce.number().int().min(0).optional(),
    weightClass: z.string().min(1),
    experienceLevel: z.enum(['amateur', 'pro']),
    amateurWins: z.coerce.number().int().min(0),
    amateurLosses: z.coerce.number().int().min(0),
    amateurDraws: z.coerce.number().int().min(0),
    proWins: z.coerce.number().int().min(0).optional(),
    proLosses: z.coerce.number().int().min(0).optional(),
    proDraws: z.coerce.number().int().min(0).optional(),
    gymAffiliation: z.string().optional(),
    bio: z.string().max(500).optional(),
    availability: z.array(z.string()).optional(),
  })
  .refine(
    ({ dob }) => {
      const birthDate = new Date(dob);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age -= 1;
      }
      return age >= 18;
    },
    {
      message: 'Must be 18 or older to use Rumbler.',
      path: ['dob'],
    },
  );

type Profile = z.infer<typeof profileSchema> & {
  profileCompleted: boolean;
  kycVerified: boolean;
  updatedAt: string;
};

const profiles = new Map<string, Profile>();
const likes = new Map<string, Set<string>>();
const matches = new Map<string, Set<string>>();

type EnvBindings = {
  DB: D1Database;
  MATCHMAKER_DO: DurableObjectNamespace;
  CHAT_DO: DurableObjectNamespace;
  MEDIA_BUCKET: R2Bucket;
  ANALYTICS_QUEUE: Queue;
  APP_NAME: string;
};

type AppEnv = {
  Bindings: EnvBindings;
};

const app = new Hono<AppEnv>();

app.use('*', logger());
app.use('*', cors());

const deckFiltersSchema = z.object({
  distance: z.coerce.number().positive().max(100).default(25),
  discipline: z.string().trim().min(1).optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced', 'pro']).optional(),
  gender: z.enum(['male', 'female', 'non-binary']).optional(),
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    region: c.env?.APP_NAME ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
});

app.get('/me/profile', (c) => {
  const profile = profiles.get(USER_ID);
  if (!profile) {
    return c.json({
      profileCompleted: false,
      kycVerified: false,
    });
  }
  return c.json(profile);
});

app.put('/me/profile', async (c) => {
  let payload: unknown;
  try {
    payload = await c.req.json();
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const result = profileSchema.safeParse(payload);
  if (!result.success) {
    return c.json(
      {
        error: 'Validation failed',
        details: result.error.format(),
      },
      422,
    );
  }

  const profile: Profile = {
    ...result.data,
    proWins: result.data.proWins ?? 0,
    proLosses: result.data.proLosses ?? 0,
    proDraws: result.data.proDraws ?? 0,
    availability: result.data.availability ?? [],
    profileCompleted: true,
    kycVerified: true,
    updatedAt: new Date().toISOString(),
  };

  profiles.set(USER_ID, profile);

  return c.json(profile);
});

app.get('/deck', async (c) => {
  const query = deckFiltersSchema.parse(
    Object.fromEntries(new URL(c.req.url).searchParams.entries()),
  );

  // TODO: replace with real D1 query & matchmaking logic.
  const mockDeck = [
    {
      fighterId: 'ftr_001',
      name: 'Kai Nakamura',
      age: 27,
      gender: 'male',
      disciplines: ['Muay Thai', 'Boxing'],
      weightClass: 'Lightweight',
      experience: 'advanced',
      record: { amateur: '12-3-0', professional: '4-1-0' },
      distanceKm: 5,
      avatarUrl: 'https://cdn.rumbler.example/fighters/kai.png',
    },
    {
      fighterId: 'ftr_002',
      name: 'Lola Reyes',
      age: 25,
      gender: 'female',
      disciplines: ['BJJ', 'Wrestling'],
      weightClass: 'Featherweight',
      experience: 'advanced',
      record: { amateur: '20-5-0' },
      distanceKm: 11,
      avatarUrl: 'https://cdn.rumbler.example/fighters/lola.png',
    },
    {
      fighterId: 'ftr_003',
      name: 'Marcus Silva',
      age: 31,
      gender: 'male',
      disciplines: ['MMA'],
      weightClass: 'Welterweight',
      experience: 'pro',
      record: { amateur: '15-3-1', professional: '10-2-0' },
      distanceKm: 2,
      avatarUrl: 'https://cdn.rumbler.example/fighters/marcus.png',
    },
  ];

  return c.json({
    query,
    results: mockDeck,
  });
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.post('/deck/:fighterId/like', async (c) => {
  const { fighterId } = c.req.param();
  if (!fighterId) {
    return c.json({ error: 'fighterId required' }, 400);
  }

  const userLikes = likes.get(USER_ID) ?? new Set<string>();
  userLikes.add(fighterId);
  likes.set(USER_ID, userLikes);

  const fighterLikesUser = Math.random() > 0.6;

  if (fighterLikesUser) {
    const userMatches = matches.get(USER_ID) ?? new Set<string>();
    userMatches.add(fighterId);
    matches.set(USER_ID, userMatches);
  }

  return c.json({
    liked: true,
    match: fighterLikesUser ? { fighterId, createdAt: new Date().toISOString() } : null,
  });
});

app.post('/deck/:fighterId/pass', async (c) => {
  const { fighterId } = c.req.param();
  if (!fighterId) {
    return c.json({ error: 'fighterId required' }, 400);
  }

  const userLikes = likes.get(USER_ID);
  if (userLikes) {
    userLikes.delete(fighterId);
  }

  return c.json({ passed: true });
});

app.get('/matches', (c) => {
  const userMatches = matches.get(USER_ID) ?? new Set<string>();
  const results = Array.from(userMatches.values()).map((fighterId) => ({
    fighterId,
    lastMessage: 'You both liked each other! Say hi and set up a session.',
    matchedAt: new Date().toISOString(),
  }));

  return c.json({ results });
});

export default app;
