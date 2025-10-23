# Data Model (ERD)

User (id, email, kyc_status, display_name, photo_url, created_at)

FighterProfile (
  user_id [PK, FK User],
  gender, dob, disciplines[], stance,
  height_cm, reach_cm, weight_class,
  experience_level (amateur|pro),
  amateur_wins, amateur_losses, amateur_draws,
  pro_wins, pro_losses, pro_draws,
  gym_affiliation, bio, availability,
  created_at, updated_at
)

MatchIntent (id, actor_user_id, target_user_id, action like|pass, created_at)

Match (id, user_a, user_b, created_at, status)

Message (id, match_id, sender_id, body, media_url?, created_at)

Gym (id, name, address, lat, lon, verified_status)

Booking (id, match_id, gym_id, start_time, end_time, ruleset, fee_cents, status, checkin_latlon, checkout_latlon)

Waiver (id, version, signed_by_user_id, booking_id, signed_at)

Rating (id, booking_id, rater_user_id, safety_stars, sportsmanship_stars, notes)
