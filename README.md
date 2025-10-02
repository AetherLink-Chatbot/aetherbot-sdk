## AetherBot Widget SDK

Embeddable chat widget and client for integrating AetherBot into any website or app. Ships ESM, CJS, and UMD bundles, plus TypeScript types.

### Installation

- NPM: `npm install @aetherbot/widget`

Or use the standalone UMD bundle in a script tag from your own hosting:

```
<script src="/path/to/aetherbot-sdk.umd.js"></script>
<script>
  const { AetherbotWidget } = window;
  // Use AetherbotWidget.createWidget(...)
  // or new AetherbotWidget.PublicAvatarChatClient(...)
  // See Usage below.
  
</script>
```

### Builds and Files

- ESM: `dist/aetherbot-sdk.mjs`
- CJS: `dist/aetherbot-sdk.cjs`
- UMD: `dist/aetherbot-sdk.umd.js` (global: `AetherbotWidget`)
- Types: `dist/types/`

### Styles

- When using the UMD bundle, the SDK will automatically inject `dist/style.css` from the same folder as the script. No extra `<link>` tag is required when files are colocated (e.g., CDN paths like `/dist/aetherbot-sdk.umd.js` and `/dist/style.css`).
- If you host files separately, either colocate `style.css` next to the UMD file, or include it yourself:

```
<link rel="stylesheet" href="/path/to/style.css" />
```

### Scripts

- `npm run build` — build JS bundles and types
- `npm run build:widget` — build JS bundles only
- `npm run build:types` — emit type declarations only

### Usage (UMD / Script Tag)

```
<script src="/path/to/aetherbot-sdk.umd.js"></script>
<script>
  const { createWidget } = AetherbotWidget;
  const controller = createWidget({
    apiKey: '<your-public-api-key>',
    apiBaseUrl: 'https://api.yourdomain.com',
    avatarId: '<avatar-id>',
    externalUserId: '<unique-user-id>',
    // Optional
    externalUserName: 'Ada Lovelace',
    defaultTopK: 8,
    theme: {
      primary: '#3B82F6',
      brandName: 'AetherBot',
    },
    position: 'bottom-right',
  });

  // Programmatic control
  // controller.open();
  // controller.close();
  // controller.toggle();
</script>
```

### Usage (ESM / npm)

```
import { createWidget, PublicAvatarChatClient } from '@aetherbot/widget';

// Drop-in widget
const widget = createWidget({
  apiKey: process.env.PUBLIC_API_KEY!,
  apiBaseUrl: 'https://api.yourdomain.com',
  avatarId: 'avatar_123',
  externalUserId: 'user_456',
});

// Or use the client directly
const client = new PublicAvatarChatClient({
  apiKey: '...',
  apiBaseUrl: 'https://api.yourdomain.com',
  avatarId: 'avatar_123',
  externalUserId: 'user_456',
});

const res = await client.sendQuery('Hello!');
console.log(res);
```

### Public API

- `createWidget(options: WidgetOptions): WidgetController`
  - Renders an interactive chat widget into the page and returns controls.
  - Key options: `apiKey`, `apiBaseUrl`, `avatarId`, `externalUserId`, optional `externalUserName`, `defaultTopK`, `theme`, `position`.
  - Controller methods: `open()`, `close()`, `toggle()`, `resetConversation()`, `setActiveChat(chatId | null)`.

- `class PublicAvatarChatClient`
  - Construct with: `{ apiKey, apiBaseUrl, avatarId, externalUserId, externalUserName?, defaultTopK? }`.
  - Methods:
    - `assignAb(testPercentage: number, userId?: string)` → `{ show: boolean }`
    - `streamQuery(query: string, opts?)` → async generator of stream events
    - `sendQuery(query: string, opts?)` → `PublicAvatarQueryResponse`
    - `listChats(externalUserId?: string)` → `PublicChatListResponse`
    - `getChatHistory(chatId?: string)` → `PublicChatHistoryResponse`
    - `getWidgetMessages(chatId?: string)` → widget-shaped messages
    - `submitContact(request)` → `ContactOut`

### Security & Privacy

- No secrets are committed in this repo. The SDK expects a public API key and base URL to be provided by the integrator at runtime; nothing is hard-coded.
- Local storage usage is guarded with safe fallbacks and try/catch. Session and chat IDs are stored under a namespaced key.
- Network calls use `fetch` to the provided `apiBaseUrl`; error responses are surfaced with status codes and sanitized messages.
- No use of `eval` or dynamic code execution.

### Development

```
npm install
npm run build
```

### License

MIT
