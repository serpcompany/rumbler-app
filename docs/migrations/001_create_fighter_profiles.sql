CREATE TABLE IF NOT EXISTS fighter_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  photo_url TEXT,
  disciplines TEXT,
  stance TEXT,
  height_cm INTEGER,
  reach_cm INTEGER,
  weight_class TEXT NOT NULL,
  experience_level TEXT CHECK (experience_level IN ('amateur','pro')) NOT NULL DEFAULT 'amateur',
  dob TEXT,
  gender TEXT CHECK (gender IN ('male','female','nonbinary','prefer_not_to_say')),
  amateur_wins INTEGER NOT NULL DEFAULT 0,
  amateur_losses INTEGER NOT NULL DEFAULT 0,
  amateur_draws INTEGER NOT NULL DEFAULT 0,
  pro_wins INTEGER NOT NULL DEFAULT 0,
  pro_losses INTEGER NOT NULL DEFAULT 0,
  pro_draws INTEGER NOT NULL DEFAULT 0,
  gym_affiliation TEXT,
  bio TEXT,
  availability TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_profiles_weight ON fighter_profiles(weight_class);
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON fighter_profiles(experience_level);
