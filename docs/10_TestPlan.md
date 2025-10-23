# Test Plan

## Flows
- Register → KYC → profile complete (with DOB, gender, experience, records)
- Deck → like/pass → match
- Chat send/receive
- Booking → geofence check-in
- Report/block

## Validation
- Must be 18+ (DOB)
- Records non-negative
- Experience enum enforced

## Performance
- Deck p95 < 300ms (within 200km filter)
- Chat send/receive p95 < 200ms
