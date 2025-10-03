# Public Contact Form Endpoint

Documentation for the public Contact Request submission used by embedded avatars. This endpoint accepts contact form submissions from your frontend and notifies the avatar’s configured recipients.

All public endpoints require an API key and are available under both prefixes:
- `/public/...`
- `/api/public/...`

---

## Submit Contact Request

POST `/public/contacts`

Headers:
- `X-API-Key: ak_<prefix>_<secret>`
- `Content-Type: application/json`

Body (`ContactCreatePublic`):

```json
{
  "chat_id": "00000000-0000-0000-0000-000000000000",
  "avatar_id": "00000000-0000-0000-0000-000000000000",
  "message_id": null,
  "name": "Jane Doe",
  "contact_method": "email",
  "contact_value": "jane@example.com",
  "concern_text": "I need help upgrading my plan."
}
```

Field details:

| Field            | Type   | Required | Notes                                                                   |
| ---------------- | ------ | -------- | ----------------------------------------------------------------------- |
| `chat_id`        | UUID   | ✓        | Must belong to the same API key.                                        |
| `avatar_id`      | UUID   | ✓        | Must be accessible to the API key.                                      |
| `message_id`     | UUID   |          | Optional; must belong to the `chat_id` when provided.                   |
| `name`           | string | ✓        | Sender’s name.                                                           |
| `contact_method` | string | ✓        | One of `email` or `call` (case-insensitive).                            |
| `contact_value`  | string |          | Email address or phone number; optional if known via other channels.    |
| `concern_text`   | string | ✓        | Free-form description of the issue/request.                              |

Behavior:
- Validates API key via `X-API-Key` and enforces avatar access for that key.
- Verifies the `chat_id` belongs to the API key; optional `message_id` must belong to the same chat.
- Persists a `ContactRequest` in `pending` status.
- Sends notification emails to recipients listed in the avatar’s `config.contact.emails`.
- If no recipients are configured, returns HTTP 400 `contact_not_enabled_for_avatar`.

Example success response (`ContactOut`):

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "avatar_id": "00000000-0000-0000-0000-000000000000",
  "chat_id": "00000000-0000-0000-0000-000000000000",
  "message_id": null,
  "api_key_id": "22222222-2222-2222-2222-222222222222",
  "name": "Jane Doe",
  "contact_method": "email",
  "contact_value": "jane@example.com",
  "concern_text": "I need help upgrading my plan.",
  "status": "pending",
  "email_sent_at": "2024-09-16T09:25:00Z",
  "created_at": "2024-09-16T09:25:00Z",
  "updated_at": "2024-09-16T09:25:00Z"
}
```

Errors:

| Code | Detail                                  | When                                                                 |
| ---- | --------------------------------------- | -------------------------------------------------------------------- |
| 400  | `contact_method must be 'email' or 'call'` | `contact_method` not one of the allowed values.                      |
| 400  | `contact_not_enabled_for_avatar`        | Avatar has no `config.contact.emails` configured.                    |
| 401  | `Missing API key` / `Invalid API key`   | `X-API-Key` absent/invalid or wrong format (`ak_<prefix>_<secret>`). |
| 403  | `Avatar not accessible for this API key`| API key not allowed to use the avatar.                               |
| 404  | `Avatar not found`                      | Avatar does not exist or not in the API key’s org.                   |
| 404  | `Chat not found for this API key`       | `chat_id` not found for this API key.                                |
| 404  | `message_not_found_for_chat`            | `message_id` present but not part of the given chat.                 |

Avatar contact configuration:

To enable email notifications, store recipients under the avatar’s `config.contact.emails` property (string or array of strings). Presence of at least one non-empty email enables the feature.

```json
{
  "contact": {
    "emails": ["owner@example.com", "support@example.com"]
  }
}
```

