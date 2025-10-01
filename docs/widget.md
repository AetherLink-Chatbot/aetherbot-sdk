# AetherBot Widget Guide

## Overview

The AetherBot web widget is a floating chat surface that renders on any page with a single script include or module import. It bundles session management, chat streaming, and history browsing into a self-contained UI. At runtime the widget mounts a fixed-position FAB (floating action button) and an animated chat panel that streams responses from the AetherBot API.

## Distribution Artifacts

The build pipeline publishes three consumable bundles under `aetherbot-sdk/dist/`:

- `aetherbot-sdk.mjs`: Evergreen ES module for modern bundlers (Vite, Webpack, Next.js, etc.).
- `aetherbot-sdk.cjs`: CommonJS bundle for Node-based build steps or legacy tooling.
- `aetherbot-sdk.umd.js`: Browser-ready UMD bundle that exposes `window.AetherbotWidget` for drop-in script tag usage.

All bundles ship TypeScript declarations, and the `build:widget` script (`npm run build:widget`) regenerates the artifacts plus type output.

## Bootstrapping the Widget

### Script Tag / UMD

```html
<script src="/aetherbot-sdk/dist/aetherbot-sdk.umd.js"></script>
<script>
  const widget = window.AetherbotWidget.create({
    apiKey: 'YOUR_API_KEY',
    avatarId: 'AVATAR_ID',
    apiBaseUrl: 'https://api.aetherbot.ai',
    externalUserId: 'user-123',
    displayName: 'Support Bot',
  });

  document.getElementById('toggle-widget').addEventListener('click', () => {
    widget.toggle();
  });
</script>
```

`window.AetherbotWidget.init` accepts the same options but also maps legacy keys (`colorScheme`, `userId`, `userName`). It automatically reads `window.aetherbotConfig` if defined before the bundle loads.

### ES Module / CommonJS

```ts
import { createWidget } from 'aetherbot-sdk';

const controller = createWidget({
  apiKey: process.env.AETHERBOT_KEY!,
  avatarId: 'AVATAR_ID',
  apiBaseUrl: 'https://api.aetherbot.ai',
  externalUserId: currentUser.id,
  externalUserName: currentUser.name,
  position: 'bottom-right',
});
```

### Controller API

`createWidget` returns a `WidgetController` with the following methods:

- `open()` / `close()` / `toggle()` – control panel visibility.
- `resetConversation()` – clears the active conversation, resets local history state, and forces a history refresh.
- `destroy()` – unmounts the React tree and removes injected DOM/stylesheet nodes.

`window.AetherbotWidget.destroyAll()` applies `destroy()` to every live instance.

## Runtime Behaviour

- The FAB is always positioned according to `position` and remains interactive while the panel is open.
- Chats and transcripts persist per `externalUserId` using `localStorage` (namespace configurable via `session.namespace`).
- History mode determines whether the widget rehydrates prior chats (`'history'`), forces a fresh thread (`'always-new'`), or opens on the history view (`'show-history'`).
- The panel tail automatically follows the chosen position so the speech bubble visually points back to the FAB.
- While idle the header subtitle uses `displayMessage` (default: “Ready to assist you”), switching to the animated “Thinking…” indicator automatically during streaming.
- Providing `firstMessage` renders that text as the opening assistant chat bubble; omit or leave it blank to skip the synthetic reply.

## Widget Options

The table lists every configurable option, required status, default value applied by `normalizeOptions`, and a brief description.

| Option                       | Type                                                      | Required | Default                                                                | Notes                                                                                                                                                                                                                      |
| ---------------------------- | --------------------------------------------------------- | -------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiKey`                   | `string`                                                | Yes      | –                                                                     | Public API key passed as `X-API-Key` header.                                                                                                                                                                             |
| `avatarId`                 | `string`                                                | Yes      | –                                                                     | Target avatar/chatbot identifier.                                                                                                                                                                                          |
| `apiBaseUrl`               | `string`                                                | Yes      | –                                                                     | Base URL for the public API (e.g.`https://api.aetherbot.ai`). Trailing slashes are trimmed.                                                                                                                              |
| `externalUserId`           | `string`                                                | Yes*     | `'guest-user'`                                                       | Required by the client; defaults to `'guest-user'` when omitted. Controls per-user session state.                                                                                                                        |
| `externalUserName`         | `string`                                                | No       | `undefined`                                                          | Optional display name propagated with chat requests and persisted in session storage.                                                                                                                                      |
| `position`                 | `WidgetPosition`                                        | No       | `'bottom-right'`                                                     | Allowed values:`'bottom-right'`, `'bottom-left'`, `'bottom-center'`, `'top-right'`, `'top-left'`, `'top-center'`, `'center'`, `'center-left'`, `'center-right'`. The FAB and panel tail update together. |
| `theme`                    | `WidgetTheme`                                           | No       | `{ primary: '#4f46e5', secondary: '#6366f1', text: '#0f172a' }`      | Colors are normalized to lowercase `#rrggbb`. Theme drives CSS custom properties for gradients, borders, and text.                                                                                                       |
| `welcomeMessage`           | `string`                                                | No       | `undefined`                                                          | Reserved for future welcome banner support. Currently unused by the widget shell.                                                                                                                                          |
| `firstMessage`             | `string`                                                | No       | `undefined`                                                          | Rendered as an assistant chat bubble before any messages exist. Whitespace-only values are ignored.                                                                                                                        |
| `displayMessage`           | `string`                                                | No       | `'Ready to assist you'`                                              | Subtitle shown beneath the assistant name while idle. Blank values fall back to the default.                                                                                                                               |
| `displayName`              | `string`                                                | No       | `'AetherBot'`                                                        | Assistant label used in headers and assistant message metadata.                                                                                                                                                            |
| `autoOpen`                 | `boolean`                                               | No       | `false`                                                              | Convenience flag; when `true` and `autoOpenMode` is not provided the widget uses `'immediate'`.                                                                                                                      |
| `autoOpenMode`             | `'never' \| 'immediate' \| 'delay' \| 'scroll' \| 'manual'` | No       | Derived:`'immediate'` if `autoOpen` truthy, otherwise `'never'`. | `'delay'` uses `autoOpenDelaySeconds`; `'scroll'` waits for the configured scroll percentage; `'manual'` suppresses automatic opening even if `autoOpen` is true.                                                |
| `autoOpenDelaySeconds`     | `number`                                                | No       | `5`                                                                  | Only used when `autoOpenMode === 'delay'`. Values ≤0 fall back to `5`.                                                                                                                                                |
| `autoOpenScrollPercentage` | `number`                                                | No       | `45`                                                                 | Only used when `autoOpenMode === 'scroll'`. Clamped to `0–100` (defaults to `45`).                                                                                                                                  |
| `showAvatars`              | `boolean`                                               | No       | `true`                                                               | Reserved customization toggle. Avatar chips currently always render; flag retained for forward compatibility.                                                                                                              |
| `defaultTopK`              | `number`                                                | No       | `8` applied at send-time                                             | Fallback `k` value when streaming without explicit overrides.                                                                                                                                                            |
| `session`                  | `SessionOptions`                                        | No       | `{}`                                                                 | Supports namespacing (`namespace`) and custom storage adapters (`storage`).                                                                                                                                            |
| `chatHistoryMode`          | `'always-new' \| 'history' \| 'show-history'`             | No       | `'history'`                                                          | Controls whether the widget loads existing chats and which view opens by default.                                                                                                                                          |
| `widthPercent`             | `number`                                                | No       | Panel clamps to `min(75vw, 540px)`                                   | Overrides width as `%` of viewport (clamped between 30–95). Safe max (`calc(100vw - 32px)`) still applies.                                                                                                            |
| `heightPercent`            | `number`                                                | No       | Panel clamps to `min(80vh, 720px)`                                   | Overrides height as `%` of viewport (clamped between 40–95). Safe max (`calc(100vh - 48px)`) still applies.                                                                                                           |

\* `externalUserId` is marked required but is defaulted internally so the widget can run in guest mode when the caller cannot provide a stable identifier.

## History Integration

`chatHistoryMode` combined with `externalUserId` drives history behaviour:

- `'history'`: the widget pulls `/public/avatars-chat/chats` on open and lets users browse prior threads.
- `'always-new'`: forces `resetConversation()` whenever the panel opens, skipping history hydration.
- `'show-history'`: opens the history view first; selecting a chat loads transcript using `/public/avatars-chat/chats/:id`.

Incoming summaries now contain a `title` attribute; the widget surfaces that text on the history cards (falling back to “Untitled chat” when missing). The client also normalizes payloads that still use `chat_id`, so the Past Chats view works with either response shape.

## Theming & Styling

`applyThemeVariables` pushes palette values into CSS custom properties on the root widget container (`--aetherbot-primary`, `--aetherbot-surface`, etc.). This powers gradients, borders, and dynamic states. The FAB, overlay, and panel tail all react to runtime theme changes when a new widget is created.

The chat panel is wrapped in a speech-bubble shell:

- Rounded corners stay consistent because the inner container maintains `overflow: hidden`.
- A rotated square tail on the wrapper aligns with the FAB position (bottom/top/side) while preserving box shadows.

## Build & Local Testing

- `npm run build:widget` — builds the UMD/CJS/ESM bundles and compiles TypeScript declarations.
- `npm run dev` — launches the Vite playground (`public/random.html`) where you can iterate on widget behaviour.

During development the widget injects a scoped stylesheet (`<style id="aetherbot-widget-react-styles">`) once per document. Destroying every instance removes all DOM artifacts, making it safe to re-create the widget repeatedly in sandbox pages.
