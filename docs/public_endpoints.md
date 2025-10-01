# Public API Endpoints

This guide describes the public endpoints that external integrators can call when they embed an AetherBot avatar behind an API key. All endpoints live under the `/public` prefix and require the `X-API-Key` header (`ak_<prefix>_<secret>`).

> For API key lifecycle operations (create/update/delete), refer to `docs/api_keys.md`.

---

## 1. Stream Query An Avatar

**POST** `/public/avatars-chat/{avatar_id}/query`

Headers:

- `X-API-Key: ak_<prefix>_<secret>`
- `Content-Type: application/json`

Body (`PublicAvatarQueryRequest`):

```json
{
  "query": "How do I reset my password?",
  "external_user_id": "customer-123",
  "external_user_name": "Jane Doe",
  "chat_id": null,
  "session_id": null,
  "k": 6
}
```

| Field                  | Type   | Required | Notes                                                                           |
| ---------------------- | ------ | -------- | ------------------------------------------------------------------------------- |
| `query`              | string | ✓       | User utterance.                                                                 |
| `external_user_id`   | string | ✓       | Stable user identifier supplied by the integrator.                              |
| `external_user_name` | string |          | Optional friendly name stored on the chat session.                              |
| `chat_id`            | UUID   |          | Provide to continue an existing chat. Omit/null to start a new one.             |
| `session_id`         | string |          | Optional memory session token (used only if the avatar enables session memory). |
| `k`                  | int    |          | Overrides API key default `top_k` (must be > 0).                              |

Flow:

1. The backend validates the API key and avatar access.
2. Chats are uniquely scoped per `(api_key_id, external_user_id)`.
   - Creating a new chat with an external user that already has one returns HTTP 409.
   - Reusing `chat_id` enforces both API key and avatar ownership.
3. The same retrieval + LLM pipelines as the private endpoints run, so previous turns are loaded and persisted automatically.
4. Response streams NDJSON chunks (token deltas, optional reasoning, final payload). Media type `application/x-ndjson`.

Streaming example (each line is a JSON object):

```json
{"final_answer": "Here"}
{"final_answer": " is"}
{"final_answer": " your answer."}
{"chat_id": "...", "answer": "Here is your answer.", "context": [...], "created_new_chat": false}
```

Errors:

| Code | Reason                                                             |
| ---- | ------------------------------------------------------------------ |
| 400  | Validation error (bad `k`, mismatched avatar, etc.)              |
| 401  | Missing/invalid API key                                            |
| 403  | Avatar restricted for key or chat does not belong to external user |
| 404  | Avatar/chat not found                                              |
| 409  | External user already has a chat for this API key                  |

---

## 2. List Chats For An API Key

**GET** `/public/avatars-chat/chats`

Headers: `X-API-Key`

Query params:

- `external_user_id` — filter to a single external user.

Response (`PublicChatListOut`):

```json
{
  "items": [
    {
      "chat_id": "d2f4…",
      "avatar_id": "be8c…",
      "external_user_id": "customer-123",
      "external_user_name": "Jane Doe",
      "project_name": "web-widget",
      "last_user_message": "I forgot my password.",
      "last_ai_message": "Thanks! I've reset your password.",
      "created_at": "2024-09-16T09:23:11Z",
      "updated_at": "2024-09-16T09:24:36Z"
    }
  ]
}
```

---

## 3. Fetch Chat History

**GET** `/public/avatars-chat/chats/{chat_id}`

Headers: `X-API-Key`

Response (`PublicChatHistoryOut`):

```json
{
  "chat_id": "d2f4…",
  "avatar_id": "be8c…",
  "external_user_id": "customer-123",
  "external_user_name": "Jane Doe",
  "project_name": "web-widget",
  "messages": [
    { "id": "…", "role": "USER", "content": "Hello", "created_at": "…" },
    { "id": "…", "role": "ASSISTANT", "content": "Hello there!", "created_at": "…" }
  ]
}
```
