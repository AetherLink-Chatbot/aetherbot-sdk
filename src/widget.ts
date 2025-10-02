import React from "react";
import type { ThemeConfig } from "./ui/types";
import { createRoot, Root } from "react-dom/client";
import AetherChatWidget from "./ui/AetherChatWidget";
import type { TextOverrides } from "./ui/types";

export type CreateWidgetOptions = {
  // Required for live behaviour
  apiKey?: string;
  avatarId?: string;
  externalUserId?: string;
  externalUserName?: string;

  // Presentation
  avatarName?: string;
  displayName?: string;
  avatarImageUrl?: string;
  avatarImage?: string;
  bannerImageUrl?: string;
  companyName?: string;
  organizationName?: string;
  theme?: {
    text?: string;
    background?: string;
    secondary?: string;
    aiMessageBg?: string;
    bannerText?: string;
  };
  versionTag?: string;
  firstMessage?: string;
  welcomeMessage?: string;

  // Behavior/UX
  autoOpenMode?: "manual" | "delay" | "scroll" | "hybrid";
  autoOpenDelaySeconds?: number;
  autoOpenScrollPercentage?: number;
  chatHistoryMode?: "history" | "always-new" | "show-history";
  widthPercent?: number;
  heightPercent?: number;
  showAvatars?: boolean;

  // Copy overrides
  strings?: TextOverrides;

  // A/B testing (widget visibility)
  abTesting?: {
    testPercentage: number;
    persistAssignment?: boolean;
  };
};

export type WidgetController = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  resetConversation: () => void;
  destroy: () => void;
};

const registry = new Set<WidgetController>();

let __aether_styles_injected = false;
function ensureAetherStylesInjected() {
  if (typeof document === "undefined" || __aether_styles_injected) return;
  // Skip if aether style already present
  if (document.querySelector('link[data-aetherbot-style], style[data-aetherbot-style]')) {
    __aether_styles_injected = true;
    return;
  }
  try {
    const scripts = Array.from(document.getElementsByTagName("script"));
    const self = scripts.find((s) => (s as HTMLScriptElement).src && (s as HTMLScriptElement).src.includes("aetherbot-sdk") );
    let base = "";
    if (self) {
      const url = new URL((self as HTMLScriptElement).src, window.location.href);
      base = url.href.slice(0, url.href.lastIndexOf("/") + 1);
    }
    const href = base + "style.css";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-aetherbot-style", "");
    document.head.appendChild(link);
    __aether_styles_injected = true;
  } catch {
    // no-op
  }
}

const DEFAULT_THEME: ThemeConfig = {
  text: "#111111",
  background: "#ffffff",
  secondary: "#7c3aed",
  aiMessageBg: "#f6f6f7",
  bannerText: "#ffffff",
};

function applyThemeVars(theme?: Partial<ThemeConfig>) {
  if (typeof document === "undefined") return;
  const merged: ThemeConfig = { ...DEFAULT_THEME, ...(theme || {}) } as ThemeConfig;
  const root = document.documentElement;
  try {
    root.style.setProperty("--aether-text", merged.text);
    root.style.setProperty("--aether-bg", merged.background);
    root.style.setProperty("--aether-secondary", merged.secondary);
    root.style.setProperty("--aether-ai-bg", merged.aiMessageBg);
    root.style.setProperty("--aether-banner-text", merged.bannerText);
  } catch {}
  try {
    // Sync to localStorage so first render in AetherChatWidget picks it up even if user had prior theme stored
    localStorage.setItem("aether.widget.theme", JSON.stringify(merged));
  } catch {}
}

export function createWidget(opts: CreateWidgetOptions): WidgetController {
  ensureAetherStylesInjected();
  if (opts?.theme) applyThemeVars(opts.theme as Partial<ThemeConfig>);
  const container = document.createElement("div");
  container.setAttribute("data-aetherbot-widget", "");
  document.body.appendChild(container);

  let root: Root | null = createRoot(container);

  // Filled by AetherChatWidget via onReady
  let controls: Omit<WidgetController, "destroy"> | null = null;

  function render() {
    if (!root) return;
    root.render(
      React.createElement(AetherChatWidget, {
        avatarName: opts.avatarName,
        displayName: opts.displayName,
        avatarImageUrl: opts.avatarImageUrl,
        avatarImage: opts.avatarImage,
        bannerImageUrl: opts.bannerImageUrl,
        companyName: opts.companyName,
        organizationName: opts.organizationName,
        theme: opts.theme,
        versionTag: opts.versionTag,
        firstMessage: opts.firstMessage,
        welcomeMessage: opts.welcomeMessage,
        apiKey: opts.apiKey,
        avatarId: opts.avatarId,
        externalUserId: opts.externalUserId,
        externalUserName: opts.externalUserName,
        autoOpenMode: opts.autoOpenMode,
        autoOpenDelaySeconds: opts.autoOpenDelaySeconds,
        autoOpenScrollPercentage: opts.autoOpenScrollPercentage,
        chatHistoryMode: opts.chatHistoryMode,
        widthPercent: opts.widthPercent,
        heightPercent: opts.heightPercent,
        strings: opts.strings,
        abTesting: opts.abTesting,
        onReady: (c: any) => {
          controls = c;
        },
      })
    );
  }

  render();

  const controller: WidgetController = {
    open: () => controls?.open?.(),
    close: () => controls?.close?.(),
    toggle: () => controls?.toggle?.(),
    resetConversation: () => controls?.resetConversation?.(),
    destroy: () => {
      try {
        root?.unmount();
      } catch {}
      root = null;
      container.remove();
      registry.delete(controller);
    },
  };

  registry.add(controller);
  return controller;
}

export function destroyAll() {
  for (const c of Array.from(registry)) c.destroy();
}

// UMD convenience aliases for legacy docs
export const create = createWidget;
export function init(opts?: CreateWidgetOptions): WidgetController {
  ensureAetherStylesInjected();
  const w = (globalThis as any) || window;
  const cfg = {
    ...(w?.aetherbotConfig || {}),
    ...(opts || {}),
  } as CreateWidgetOptions;
  if (cfg?.theme) applyThemeVars(cfg.theme as Partial<ThemeConfig>);
  return createWidget(cfg);
}
export const AetherbotWidget = { createWidget, create, init, destroyAll };
