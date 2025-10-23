# Feature: Profiles

**Fields**
- Photos, **gender**, **age (via DOB)**, stance
- Disciplines[]
- Height (cm), reach (cm), **weight class**
- **Experience level**: amateur | pro
- **Amateur record**: wins/losses/draws
- **Professional record**: wins/losses/draws
- Gym affiliation, bio, availability windows

**Rules**
- Collect DOB; compute age server-side; enforce 18+.
- Photos moderated; explicit sexual content / shocking gore blocked.
- Required for discovery: weight class, at least one discipline, experience level.

**Privacy**
- Show distance only; never exact coordinates.
