import React from "react";
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

export function createWidget(opts: CreateWidgetOptions): WidgetController {
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
  const w = (globalThis as any) || window;
  const cfg = {
    ...(w?.aetherbotConfig || {}),
    ...(opts || {}),
  } as CreateWidgetOptions;
  return createWidget(cfg);
}
export const AetherbotWidget = { createWidget, create, init, destroyAll };
