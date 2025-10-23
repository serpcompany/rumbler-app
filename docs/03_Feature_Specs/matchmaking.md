# Feature: Matchmaking Deck

**Goal**
Surface nearby fighters filtered by discipline, weight class, distance, experience, and optional gender.

**Flow**
1) Open Home → deck fetched
2) Swipe right (like) or left (pass)
3) Mutual like → match → chat room opens

**Scoring (MVP heuristic)**
- Distance (non-linear decay)
- Weight class proximity (exact > ±1)
- Experience alignment (amateur vs pro)
- Discipline overlap
- Record parity (use higher of amateur/pro winrate; penalize large deltas)
- Safety/reliability rating

**Empty States**
- Out of cards → broaden filters / extend radius
