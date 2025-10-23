import Constants from 'expo-constants';

const API_BASE_URL =
  (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ??
  'http://localhost:8787';

export interface ApiProfile {
  photoUrl?: string;
  gender: 'male' | 'female' | 'nonbinary' | 'prefer_not_to_say';
  dob: string;
  disciplines: string[];
  stance?: string;
  heightCm?: number;
  reachCm?: number;
  weightClass: string;
  experienceLevel: 'amateur' | 'pro';
  amateurWins: number;
  amateurLosses: number;
  amateurDraws: number;
  proWins: number;
  proLosses: number;
  proDraws: number;
  gymAffiliation?: string;
  bio?: string;
  availability: string[];
  profileCompleted: boolean;
  kycVerified: boolean;
  updatedAt: string;
}

export interface ProfileResponse {
  profileCompleted: boolean;
  kycVerified: boolean;
  updatedAt?: string;
  gender?: ApiProfile['gender'];
  dob?: string;
  disciplines?: string[];
  stance?: string;
  heightCm?: number;
  reachCm?: number;
  weightClass?: string;
  experienceLevel?: ApiProfile['experienceLevel'];
  amateurWins?: number;
  amateurLosses?: number;
  amateurDraws?: number;
  proWins?: number;
  proLosses?: number;
  proDraws?: number;
  gymAffiliation?: string;
  bio?: string;
  availability?: string[];
  photoUrl?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && (data as any).error) ||
      `Request failed with status ${response.status}`;
    throw new Error(String(message));
  }

  return data as T;
}

export function fetchProfile(): Promise<ProfileResponse> {
  return request<ProfileResponse>('/me/profile');
}

export type UpdateProfilePayload = Omit<
  ApiProfile,
  'profileCompleted' | 'kycVerified' | 'updatedAt' | 'availability'
> & {
  availability?: string[];
};

export function updateProfile(payload: UpdateProfilePayload): Promise<ApiProfile> {
  return request<ApiProfile>('/me/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function fetchDeck(query: Record<string, string | number> = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    params.set(key, String(value));
  });

  return request<{
    query: Record<string, unknown>;
    results: DeckFighter[];
  }>(`/deck${params.toString() ? `?${params.toString()}` : ''}`);
}

export const ApiConfig = {
  baseUrl: API_BASE_URL,
};

export interface DeckFighter {
  fighterId: string;
  name: string;
  age: number;
  gender: string;
  disciplines: string[];
  weightClass: string;
  experience: string;
  record: {
    amateur: string;
    professional?: string;
  };
  distanceKm: number;
  avatarUrl?: string;
}

export function likeFighter(fighterId: string) {
  return request<{ liked: boolean; match: { fighterId: string; createdAt: string } | null }>(
    `/deck/${fighterId}/like`,
    {
      method: 'POST',
    },
  );
}

export function passFighter(fighterId: string) {
  return request<{ passed: boolean }>(`/deck/${fighterId}/pass`, {
    method: 'POST',
  });
}

export function fetchMatches() {
  return request<{ results: Array<{ fighterId: string; lastMessage: string; matchedAt: string }> }>(
    '/matches',
  );
}
