import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createWidget, destroyAll } from "../src/widget";

type Ctl = ReturnType<typeof createWidget> | null;

const defaults = {
  apiKey: "",
  avatarId: "",
  externalUserId: "guest-user",
  externalUserName: "",
  displayName: "AetherBot Assistant",
  organizationName: "Droidor",
  avatarImage: "",
  bannerImageUrl: "",
  firstMessage: "",
  welcomeMessage: "Ready to assist you",
  versionTag: "v1.0  .", // static; not used from UI
  autoOpenMode: "manual" as const,
  autoOpenDelaySeconds: 5,
  autoOpenScrollPercentage: 45,
  chatHistoryMode: "history" as const,
  widthPercent: 75,
  heightPercent: 78,
  theme: {
    mode: "light" as const,
    text: "#0f172a",
    background: "#ffffff",
    secondary: "#6366f1",
    aiMessageBg: "#f6f6f7",
    bannerText: "#ffffff",
  },
  strings: {
    launcherTitle: "Let's Chat, Your Way",
    launcherSubtitle: "This chatbot adapts to your style of conversation.",
    bannerTagline: "Every conversation matters, and this chatbot makes it worthwhile.",
    inputPlaceholder: "Type message...",
    thinkingLabel: "Thinking…",
    splashPoweredByBrand: "AetherLink",
  },
};

function Field({ label, children }: any) {
  return (
    <label className="flex items-center gap-3 py-1.5">
      <span className="w-52 text-sm text-zinc-600">{label}</span>
      <div className="flex-1">{children}</div>
    </label>
  );
}

const App = () => {
  const [ctl, setCtl] = useState<Ctl>(null);
  const [cfg, setCfg] = useState<any>(defaults);
  const [creating, setCreating] = useState(false);

  const apply = () => {
    if (ctl) ctl.destroy();
    const next = createWidget({ ...cfg });
    setCtl(next);
  };

  useEffect(() => {
    // create initial widget
    apply();
    return () => destroyAll();
  }, []);

  const onFetchAvatar = async () => {
    const API_BASE = 'https://aetherbot.dev';
    if (!cfg.avatarId || !cfg.apiKey) return;
    try {
      const res = await fetch(`${API_BASE}/public/avatars-chat/${cfg.avatarId}/image`, {
        headers: { "X-API-Key": cfg.apiKey },
      });
      if (!res.ok) return;
      const json = await res.json();
      setCfg((x: any) => ({ ...x, avatarImage: json?.avatar_image || x.avatarImage }));
    } catch {}
  };

  return (
    <div className="h-full">
      <div className="p-6 max-w-6xl">
        <h1 className="text-xl font-semibold text-zinc-800">Aetherbot Widget Configurator</h1>
        <p className="text-zinc-500">Update options and re-create the widget live.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 p-4">
            <h3 className="font-medium mb-3">API</h3>
            {/* API Base URL is static */}
            <Field label="API Key">
              <input className="w-full border rounded px-2 py-1" value={cfg.apiKey} onChange={(e)=>setCfg({...cfg, apiKey: e.target.value})} />
            </Field>
            <Field label="Avatar ID">
              <input className="w-full border rounded px-2 py-1" value={cfg.avatarId} onChange={(e)=>setCfg({...cfg, avatarId: e.target.value})} />
            </Field>
            <Field label="External User ID">
              <input className="w-full border rounded px-2 py-1" value={cfg.externalUserId} onChange={(e)=>setCfg({...cfg, externalUserId: e.target.value})} />
            </Field>
            <Field label="External User Name">
              <input className="w-full border rounded px-2 py-1" value={cfg.externalUserName} onChange={(e)=>setCfg({...cfg, externalUserName: e.target.value})} />
            </Field>
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1.5 rounded bg-indigo-600 text-white" onClick={onFetchAvatar}>Fetch Avatar Image</button>
              <button className="px-3 py-1.5 rounded border" onClick={()=>setCfg({...cfg, avatarImage: ""})}>Clear Avatar</button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4">
            <h3 className="font-medium mb-3">Presentation</h3>
            <Field label="Display Name">
              <input className="w-full border rounded px-2 py-1" value={cfg.displayName} onChange={(e)=>setCfg({...cfg, displayName: e.target.value})} />
            </Field>
            <Field label="Organization Name">
              <input className="w-full border rounded px-2 py-1" value={cfg.organizationName} onChange={(e)=>setCfg({...cfg, organizationName: e.target.value})} />
            </Field>
            <Field label="Avatar Image URL">
              <input className="w-full border rounded px-2 py-1" value={cfg.avatarImage} onChange={(e)=>setCfg({...cfg, avatarImage: e.target.value})} />
            </Field>
            <Field label="Banner Image URL">
              <input className="w-full border rounded px-2 py-1" value={cfg.bannerImageUrl} onChange={(e)=>setCfg({...cfg, bannerImageUrl: e.target.value})} />
            </Field>
            <Field label="Version Tag">
              <input className="w-full border rounded px-2 py-1" value={cfg.versionTag} onChange={(e)=>setCfg({...cfg, versionTag: e.target.value})} />
            </Field>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4">
            <h3 className="font-medium mb-3">Behavior</h3>
            <Field label="Auto Open Mode">
              <select className="w-full border rounded px-2 py-1" value={cfg.autoOpenMode} onChange={(e)=>setCfg({...cfg, autoOpenMode: e.target.value})}>
                <option value="manual">manual</option>
                <option value="delay">delay</option>
                <option value="scroll">scroll</option>
                <option value="hybrid">hybrid</option>
              </select>
            </Field>
            <Field label="Open Delay (s)">
              <input type="number" className="w-full border rounded px-2 py-1" value={cfg.autoOpenDelaySeconds} onChange={(e)=>setCfg({...cfg, autoOpenDelaySeconds: Number(e.target.value)})} />
            </Field>
            <Field label="Open Scroll (%)">
              <input type="number" className="w-full border rounded px-2 py-1" value={cfg.autoOpenScrollPercentage} onChange={(e)=>setCfg({...cfg, autoOpenScrollPercentage: Number(e.target.value)})} />
            </Field>
            <Field label="Chat History Mode">
              <select className="w-full border rounded px-2 py-1" value={cfg.chatHistoryMode} onChange={(e)=>setCfg({...cfg, chatHistoryMode: e.target.value})}>
                <option value="history">history</option>
                <option value="always-new">always-new</option>
                <option value="show-history">show-history</option>
              </select>
            </Field>
            <Field label="Width (%)">
              <input type="number" className="w-full border rounded px-2 py-1" value={cfg.widthPercent} onChange={(e)=>setCfg({...cfg, widthPercent: Number(e.target.value)})} />
            </Field>
            <Field label="Max Height (%)">
              <input type="number" className="w-full border rounded px-2 py-1" value={cfg.heightPercent} onChange={(e)=>setCfg({...cfg, heightPercent: Number(e.target.value)})} />
            </Field>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4">
            <h3 className="font-medium mb-3">Theme</h3>
            <Field label="Text color">
              <input type="color" className="h-9 w-14 border rounded" value={cfg.theme.text} onChange={(e)=>setCfg({...cfg, theme: { ...cfg.theme, text: e.target.value }})} />
            </Field>
            <Field label="Background color">
              <input type="color" className="h-9 w-14 border rounded" value={cfg.theme.background} onChange={(e)=>setCfg({...cfg, theme: { ...cfg.theme, background: e.target.value }})} />
            </Field>
            <Field label="Secondary color (FAB, user bubble, send)">
              <input type="color" className="h-9 w-14 border rounded" value={cfg.theme.secondary} onChange={(e)=>setCfg({...cfg, theme: { ...cfg.theme, secondary: e.target.value }})} />
            </Field>
            <Field label="AI message box color">
              <input type="color" className="h-9 w-14 border rounded" value={cfg.theme.aiMessageBg} onChange={(e)=>setCfg({...cfg, theme: { ...cfg.theme, aiMessageBg: e.target.value }})} />
            </Field>
            <Field label="Banner text color">
              <input type="color" className="h-9 w-14 border rounded" value={cfg.theme.bannerText} onChange={(e)=>setCfg({...cfg, theme: { ...cfg.theme, bannerText: e.target.value }})} />
            </Field>
            <Field label="Mode">
              <select className="w-full border rounded px-2 py-1" value={cfg.theme.mode} onChange={(e)=>setCfg({...cfg, theme: { ...cfg.theme, mode: e.target.value }})}>
                <option value="light">light</option>
                <option value="dark">dark</option>
              </select>
            </Field>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-4 md:col-span-2">
            <h3 className="font-medium mb-3">Text</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="First Message">
                <input className="w-full border rounded px-2 py-1" value={cfg.firstMessage} onChange={(e)=>setCfg({...cfg, firstMessage: e.target.value})} />
              </Field>
              <Field label="Welcome Message">
                <input className="w-full border rounded px-2 py-1" value={cfg.welcomeMessage} onChange={(e)=>setCfg({...cfg, welcomeMessage: e.target.value})} />
              </Field>
              <Field label="Launcher Title">
                <input className="w-full border rounded px-2 py-1" value={cfg.strings.launcherTitle} onChange={(e)=>setCfg({...cfg, strings: { ...cfg.strings, launcherTitle: e.target.value }})} />
              </Field>
              <Field label="Launcher Subtitle">
                <input className="w-full border rounded px-2 py-1" value={cfg.strings.launcherSubtitle} onChange={(e)=>setCfg({...cfg, strings: { ...cfg.strings, launcherSubtitle: e.target.value }})} />
              </Field>
              <Field label="Banner Tagline">
                <input className="w-full border rounded px-2 py-1" value={cfg.strings.bannerTagline} onChange={(e)=>setCfg({...cfg, strings: { ...cfg.strings, bannerTagline: e.target.value }})} />
              </Field>
              <Field label="Input Placeholder">
                <input className="w-full border rounded px-2 py-1" value={cfg.strings.inputPlaceholder} onChange={(e)=>setCfg({...cfg, strings: { ...cfg.strings, inputPlaceholder: e.target.value }})} />
              </Field>
              <Field label="Thinking Label">
                <input className="w-full border rounded px-2 py-1" value={cfg.strings.thinkingLabel} onChange={(e)=>setCfg({...cfg, strings: { ...cfg.strings, thinkingLabel: e.target.value }})} />
              </Field>
              {/* Powered-by copy is static */}
              {/* History title and new chat title are provided by API */}
              {/* Splash brand is static */}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={apply} disabled={creating}>Create/Update Widget</button>
          <button className="px-3 py-2 rounded border" onClick={()=>ctl?.open?.()}>Open</button>
          <button className="px-3 py-2 rounded border" onClick={()=>ctl?.close?.()}>Close</button>
          <button className="px-3 py-2 rounded border" onClick={()=>ctl?.toggle?.()}>Toggle</button>
          <button className="px-3 py-2 rounded border" onClick={()=>ctl?.resetConversation?.()}>Reset Conversation</button>
          <button className="px-3 py-2 rounded border" onClick={()=>{ ctl?.destroy?.(); setCtl(null); }}>Destroy</button>
          <button className="px-3 py-2 rounded border" onClick={()=>{ destroyAll(); setCtl(null); }}>Destroy All</button>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
