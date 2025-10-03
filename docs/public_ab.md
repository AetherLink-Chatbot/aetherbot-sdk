# Public A/B Assignment (Widget Visibility)

This endpoint decides whether to show the widget for a given user, with sticky assignments for known users and per‑call randomness for guests. It targets a requested percentage while correcting drift over time.

- Source: `app/routes/public_ab.py`
- Mount path: under the public app (`/public` and `/api/public`)
- Full route: `POST /public/ab/{avatar_id}/assign`

---

## Authentication

- Header `X-API-Key: ak_<prefix>_<secret>` is required.
- The key must belong to the same organization as the target avatar.
- If the key does not allow all avatars, it must be explicitly linked to the avatar.
  - Access check: `app/routes/public_ab.py:22`–`app/routes/public_ab.py:38`.

Errors:
- `401` Missing/invalid API key
- `403` Avatar not accessible for this API key
- `404` Avatar not found or belongs to a different organization

---

## Request

Path params:
- `avatar_id` — UUID of the avatar to scope the assignment.

Body (`AbAssignRequest`):

```jsonc
{
  "userId": "external-user-123",  // omit/null/"guest-user" for guests
  "testPercentage": 30             // integer in [0, 100]
}
```

Notes:
- Accepts either camelCase (shown above) or snake_case (`user_id`, `test_percentage`).
- Validation range for `testPercentage` enforced in code: `0..100`.
  - See: `app/routes/public_ab.py:76`–`app/routes/public_ab.py:79` and schema: `app/schemas/public_ab.py:7`–`app/schemas/public_ab.py:16`.

---

## Response

Body (`AbAssignResponse`):

```json
{ "show": true }
```

- `show` — boolean decision whether to show the widget.

---

## Behavior and Flow

1) Access check
- Validates API key and that the avatar is accessible for the key.
- See: `app/routes/public_ab.py:73`–`app/routes/public_ab.py:74`.

2) Normalize inputs
- Extracts `testPercentage` and validates bounds.
- Determines if the caller is a “guest”: `userId` is omitted, empty, or equals `"guest-user"`.
- See: `app/routes/public_ab.py:76`–`app/routes/public_ab.py:83`.

3) Guests: random, no persistence
- For guests, decides per call using secure randomness and does not write to the database.
- See: `app/routes/public_ab.py:84`–`app/routes/public_ab.py:90`.

4) External users: sticky assignment
- Checks for an existing assignment for `(api_key_id, avatar_id, external_user_id)`.
  - If found, returns the stored value.
  - See: `app/routes/public_ab.py:91`–`app/routes/public_ab.py:105`.

5) New external user: drift‑aware probability
- Computes current bucket counts for the `(api_key_id, avatar_id)` scope.
  - `total_count`, `show_count`, `no_show_count`.
  - See: `app/routes/public_ab.py:106`–`app/routes/public_ab.py:129`.
- Calculates a probability that keeps the overall show ratio close to `testPercentage`, starting aggressively at 100% until doing so would overshoot the target, then adapting.
  - Helper: `app/routes/public_ab.py:41`–`app/routes/public_ab.py:63`.
- Flips a secure coin (`secrets.randbelow`) at micro‑granularity and persists the decision.
  - See: `app/routes/public_ab.py:131`–`app/routes/public_ab.py:144`.

6) Concurrency safety
- On unique constraint conflicts (two parallel requests for the same user), the code falls back to the stored row.
- See: `app/routes/public_ab.py:145`–`app/routes/public_ab.py:163` and model index `app/models/ab_test.py:17`–`app/models/ab_test.py:33`.

---

## Scoping and Stickiness

- Assignments are unique per `(api_key_id, avatar_id, external_user_id)` for active rows.
- Guests are never persisted and may get different answers across calls.
- External users always get the same answer after their first assignment.

---

## Error Summary

- `400` Invalid `testPercentage` value (must be `0..100`).
- `401` Missing/invalid API key.
- `403` Avatar restricted for this API key.
- `404` Avatar not found or not in organization.
- `500` Rare fallback if assignment could not be read after a concurrency conflict.

---

## Examples

Request (guest):

```http
POST /public/ab/be8c…-avatar/assign
X-API-Key: ak_<prefix>_<secret>
Content-Type: application/json

{ "testPercentage": 30 }
```

Response:

```json
{ "show": false }
```

Request (external user):

```http
POST /public/ab/be8c…-avatar/assign
X-API-Key: ak_<prefix>_<secret>
Content-Type: application/json

{ "userId": "customer-123", "testPercentage": 30 }
```

Response (sticky on subsequent calls):

```json
{ "show": true }
```
