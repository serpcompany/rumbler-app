# Analytics Event Dictionary

| Event | Properties | Trigger |
|------|------------|---------|
| signup_completed | method | registration done |
| kyc_passed | vendor | identity verified |
| profile_completed | fields_count, experience_level, has_records | profile >= min completeness |
| deck_viewed | candidates_count | deck fetched |
| intent_sent | action, target_user_id, exp_align | like/pass sent |
| match_created | match_id, distance_km, exp_pair | mutual like created |
| message_sent | match_id | chat message sent |
| booking_created | gym_id, ruleset | session booked |
| checked_in | lat, lon | geofence arrival |
| session_rated | rating | post-session rating |
