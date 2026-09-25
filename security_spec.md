# Security Specification for GSTC Garki Portal

## 1. Data Invariants
- `staff`: Every staff document must contain valid string fields with `username` matching `^[a-zA-Z0-9_/\-]+$` and maximum lengths enforced. Only authorized admins or verified staff can manage records.
- `students`: Admission numbers must adhere to the format `GSTC/YYYY/NNN` and cannot exceed 64 characters.
- `scratchCards`: PINs must be strictly bounded strings (length <= 32). Usage count cannot exceed maxUsage (5).
- `results`: Terminal results contain scores bounded by maximum allocation (CA 40%, Exam 60%, Total 100%).
- `admins`: Privileged access granted to runtime user `freelanderdba@gmail.com` or users explicitly listed in `/admins/{uid}`.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Write to Staff**: Attacker sends a staff payload without an auth token -> DENIED.
2. **Ghost Field Poisoning**: Attacker sends a staff payload with an unauthorized field (`isAdmin: true`) -> DENIED by `hasOnly()`.
3. **Huge ID Injection Attack**: Attacker attempts creating a document with a 2KB string ID -> DENIED by `isValidId(id)`.
4. **Invalid Scratch Card Overuse**: Attacker attempts updating `usageCount` to 999 beyond `maxUsage` -> DENIED.
5. **Score Hijack Beyond 100**: Attacker attempts injecting `total: 1000` into `results` -> DENIED.
6. **Blanket Query Scraping**: Attacker sends an unrestricted list query without filter -> Evaluated against collection constraints.
7. **Unverified Email Privilege Escalation**: Attacker presents an unverified token claiming admin email -> DENIED by `email_verified == true`.
8. **Malicious Array Injection**: Attacker injects 1,000 array items into `subjectsTaught` -> DENIED by `.size() <= 20`.
9. **Student Identity Hijacking**: Attacker attempts altering `admissionNo` on an existing student -> DENIED by immutability check.
10. **Arbitrary Settings Overwrite**: Anonymous user writes to `/settings/config` -> DENIED.
11. **Admin Document Self-Promotion**: Non-admin writes to `/admins/{uid}` to elevate permissions -> DENIED.
12. **Malformed JSON Injection**: Payload containing non-string/non-number types in strict fields -> DENIED by type validation.
