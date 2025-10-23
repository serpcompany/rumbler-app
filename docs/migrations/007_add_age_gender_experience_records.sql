ALTER TABLE fighter_profiles ADD COLUMN experience_level TEXT CHECK (experience_level IN ('amateur','pro')) NOT NULL DEFAULT 'amateur';
ALTER TABLE fighter_profiles ADD COLUMN dob TEXT;
ALTER TABLE fighter_profiles ADD COLUMN gender TEXT CHECK (gender IN ('male','female','nonbinary','prefer_not_to_say'));
ALTER TABLE fighter_profiles ADD COLUMN amateur_wins INTEGER NOT NULL DEFAULT 0;
ALTER TABLE fighter_profiles ADD COLUMN amateur_losses INTEGER NOT NULL DEFAULT 0;
ALTER TABLE fighter_profiles ADD COLUMN amateur_draws INTEGER NOT NULL DEFAULT 0;
ALTER TABLE fighter_profiles ADD COLUMN pro_wins INTEGER NOT NULL DEFAULT 0;
ALTER TABLE fighter_profiles ADD COLUMN pro_losses INTEGER NOT NULL DEFAULT 0;
ALTER TABLE fighter_profiles ADD COLUMN pro_draws INTEGER NOT NULL DEFAULT 0;
