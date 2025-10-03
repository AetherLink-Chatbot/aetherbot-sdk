# AetherBot Web Widget

This document explains how to embed and configure the AetherBot web widget, including theming, behavior, A/B testing, and guest-user history behavior.

## Quick Start (UMD)

Add the UMD bundle and initialize the widget. The `apiBaseUrl` is fixed to `https://aetherbot.dev` and does not need to be provided.

```html
<!-- AetherBot Widget -->
<script>window.process = { env: { NODE_ENV: "production" } };</script>
<script src="https://cdn.jsdelivr.net/gh/AetherLink-Chatbot/aetherbot-sdk@main/dist/aetherbot-sdk.umd.js"></script>
<script>
  (function () {
    const API_KEY = 'YOUR_PUBLIC_API_KEY';
    const AVATAR_ID = 'e2c12fe6-1958-4320-b358-b3e78b65beff';
    const API_BASE = 'https://aetherbot.dev';
    const ORG_NAME = 'Droidor';

    function createWidget(avatarImage) {
      window.AetherbotWidget.create({
        // Required for live behavior
        apiKey: API_KEY,
        avatarId: AVATAR_ID,
        externalUserId: 'guest-user',      // special: see Guest Users below
        externalUserName: '',

        // Presentation
        displayName: 'AetherBot Assistant',
        organizationName: ORG_NAME,
        avatarImage: avatarImage || null,
        bannerImageUrl: '',                // optional

        // Behavior/UX
        autoOpenMode: 'manual',            // 'manual' | 'delay' | 'scroll' | 'hybrid'
        autoOpenDelaySeconds: 5,
        autoOpenScrollPercentage: 45,
        chatHistoryMode: 'show-history',   // 'history' | 'always-new' | 'show-history'

        // Theme
        theme: {
          text: '#0f172a',                 // global text color
          background: '#ffffff',           // widget background
          secondary: '#6366f1',            // FAB, icons, user bubble, send button
          aiMessageBg: '#f6f6f7',          // assistant message bubble background
          bannerText: '#ffffff'            // banner text color
        },

        // Copy
        firstMessage: '',
        welcomeMessage: 'Ready to assist you',
        strings: {
          launcherTitle: "Let's Chat, Your Way",
          launcherSubtitle: 'This chatbot adapts to your style of conversation.',
          bannerTagline: 'Every conversation matters, and this chatbot makes it worthwhile.',
          inputPlaceholder: 'Type message...',
          thinkingLabel: 'Thinking…',
        },

        // A/B testing (optional; see below)
        // abTesting: { testPercentage: 50, persistAssignment: true },
      });
    }

    // Optional: fetch avatar image first to display in the widget
    fetch(`${API_BASE}/public/avatars-chat/${AVATAR_ID}/image`, {
      headers: { 'X-API-Key': API_KEY }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => createWidget(json && json.avatar_image ? json.avatar_image : null))
      .catch(() => createWidget(null));
  })();
  </script>
```

## Options Reference

- Required

  - `apiKey`: Public API key.
  - `avatarId`: The avatar UUID to connect.
  - `externalUserId`: Your user identifier; use `'guest-user'` when you do not have a signed-in user.
- Presentation

  - `avatarName` | `displayName`: Visible assistant name (aliases; either works).
  - `companyName` | `organizationName`: Organization name (aliases; either works).
  - `avatarImageUrl` | `avatarImage`: Assistant avatar image URL (aliases).
  - `bannerImageUrl`: Optional banner image URL.
  - `versionTag`: Small version string shown in the footer.
  - `firstMessage`: Initial assistant message shown in a new chat.
  - `welcomeMessage`: Subtitle in the header while idle.
- Behavior/UX

  - `autoOpenMode`: `'manual' | 'delay' | 'scroll' | 'hybrid'`.
  - `autoOpenDelaySeconds`, `autoOpenScrollPercentage`.
  - `chatHistoryMode`: `'history' | 'always-new' | 'show-history'`.
  - `position`: `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'` — controls where the launcher and chat window appear. Default: `'bottom-right'`.
- Theme

  - `theme.text`: Global text color.
  - `theme.background`: Widget background color.
  - `theme.secondary`: Accent color (FAB, icons, user bubble, send button).
  - `theme.aiMessageBg`: Assistant message bubble background.
  - `theme.bannerText`: Banner text color.
- Copy

  - `firstMessage`, `welcomeMessage`, and `strings` for small UI text overrides.
  - `strings` fields include: `launcherTitle`, `launcherSubtitle`, `headerSubtitle`, `bannerTagline`, `inputPlaceholder`, `thinkingLabel`, `poweredByPrefix`, `poweredByBrand`, `splashPoweredByBrand`.
- A/B Testing (optional)

  - `abTesting: { testPercentage: number; persistAssignment?: boolean }`.
  - When provided, the widget requests an assignment decision and only renders if `show === true`.
  - When omitted, A/B testing is skipped and the widget always shows.

## A/B Testing Behavior

- Endpoint: `POST /public/ab/{avatar_id}/assign` (see `docs/public_ab.md`).
- If `externalUserId` is provided and is not `'guest-user'`, the assignment is sticky server-side per user.
- If `externalUserId` equals `'guest-user'`:
  - The server treats guests as non-persisted; the SDK can optionally persist the decision locally when `persistAssignment: true`.
  - If `abTesting` is omitted, the widget always shows.

## Guest Users and Chat History

- When `externalUserId === 'guest-user'`, the widget does not fetch historical chats from the backend (multiple callers may share this id).
- During a session, when the backend returns a `chat_id` for a conversation, the widget stores that id and title locally and shows those chats in the history drawer. Selecting an item retrieves the full conversation by `chat_id`.

## Programmatic Control (onReady)

When the widget mounts, it exposes control methods:

```ts
onReady?: (controls: {
  open: () => void;
  close: () => void;
  toggle: () => void;
  resetConversation: () => void;
}) => void;
```

Use these to open/close or reset the widget from your host page.
