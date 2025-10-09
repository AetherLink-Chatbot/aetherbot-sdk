import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { AetherChatWidgetProps, Chat, ThemeConfig, TextOverrides } from "./types";
import { useChime, useLocalStorage } from "./hooks";
import { defaultAvatar, defaultBanner } from "./utils";
import Launcher from "./components/Launcher";
import { ChatWindow } from "./components/ChatWindow";
import { createPublicApiClient } from "../api/public";
import "./styles/theme.css";
import "./styles/utilities.css";

const initialTheme: ThemeConfig = {
  text: "#111111",
  background: "#ffffff",
  secondary: "#7c3aed",
  aiMessageBg: "#f6f6f7",
  bannerText: "#ffffff",
};

export default function AetherChatWidget({
  avatarName,
  displayName,
  avatarImageUrl,
  avatarImage,
  bannerImageUrl = defaultBanner,
  companyName,
  organizationName,
  theme: themeProp,
  versionTag = "v1.01",
  firstMessage = "Hey! I'm here to help. Ask me anything — product info, policies, or troubleshooting.",
  welcomeMessage,
  avatarId,
  externalUserId,
  externalUserName,
  onReady,
  autoOpenMode = "manual",
  autoOpenDelaySeconds = 0,
  autoOpenScrollPercentage = 0,
  chatHistoryMode = "history",
  strings,
  abTesting,
  position = 'bottom-right',
  mode = 'overlay',
  launcherContainer,
}: AetherChatWidgetProps) {
  const resolvedName = avatarName || displayName || "Aetherbot";
  const resolvedCompany = companyName || organizationName || "Aetherlink";
  const resolvedAvatar = avatarImageUrl || avatarImage || defaultAvatar;

  const [theme, setTheme] = useLocalStorage<ThemeConfig>(
    "aether.widget.theme",
    { ...initialTheme, ...(themeProp || {}) }
  );

  const [open, setOpen] = useLocalStorage<boolean>("aether.widget.open", mode === 'inline' ? true : false);
  const [animTick, setAnimTick] = useState<number>(0);
  const [muted, setMuted] = useLocalStorage<boolean>("aether.widget.muted", false);
  const { chord, play } = useChime(!muted);

  const [chats, setChats] = useLocalStorage<Chat[]>("aether.widget.chats", [
    {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      title: "Untitled chat",
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: firstMessage,
          createdAt: Date.now(),
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useLocalStorage<string>(
    "aether.widget.active",
    ""
  );

  const activeChat = chats.find((c) => c.id === activeId) || chats[0];
  const [historyTitle, setHistoryTitle] = useState<string>("Past chats");

  useEffect(() => {
    if (!activeChat && chats.length) setActiveId(chats[0].id);
  }, [chats, activeChat, setActiveId]);

  const cssVars = useMemo(
    () => ({
      "--aether-text": theme.text || '#ffffff',
      "--aether-bg": theme.background || '#000000',
      "--aether-secondary": theme.secondary || '#783990',
      "--aether-ai-bg": theme.aiMessageBg || '#f60000ff',
      "--aether-banner-text": theme.bannerText || '#00ff6aff',
    }),
    [theme.text, theme.background, theme.secondary, theme.aiMessageBg, theme.bannerText]
  );

  const toggleOpen = () => {
    setOpen((o) => {
      if (!o) chord();
      return !o;
    });
  };

  // Auto open behaviors (disabled in inline mode)
  useEffect(() => {
    if (mode === 'inline') return;
    if (autoOpenMode === "manual") return;
    let opened = false;
    const maybeOpen = () => {
      if (opened) return;
      opened = true;
      setOpen(true);
    };
    const tasks: Array<() => void> = [];
    if (autoOpenMode === "delay" || autoOpenMode === "hybrid") {
      const t = window.setTimeout(maybeOpen, Math.max(0, autoOpenDelaySeconds) * 1000);
      tasks.push(() => clearTimeout(t));
    }
    if (autoOpenMode === "scroll" || autoOpenMode === "hybrid") {
      const onScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const pct = total > 0 ? (scrolled / total) * 100 : 0;
        if (pct >= Math.max(0, Math.min(100, autoOpenScrollPercentage))) {
          maybeOpen();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll);
      tasks.push(() => window.removeEventListener("scroll", onScroll));
    }
    return () => tasks.forEach((fn) => fn());
  }, [mode, autoOpenMode, autoOpenDelaySeconds, autoOpenScrollPercentage, setOpen]);

  const API_BASE = "http://localhost:8000";
  const canLive = Boolean(avatarId && externalUserId);
  const guestMode = (externalUserId || "").toLowerCase() === "guest-user";
  const client = useMemo(() => {
    if (!canLive) return null;
    return createPublicApiClient({
      apiBaseUrl: API_BASE,
      avatarId: avatarId!,
      externalUserId: externalUserId!,
      externalUserName,
    });
  }, [avatarId, externalUserId, externalUserName, canLive]);

  // Expose controls to outer controller
  useEffect(() => {
    if (!onReady) return;
    const controls = {
      open: () => mode === 'overlay' && setOpen(true),
      close: () => mode === 'overlay' && setOpen(false),
      toggle: () => mode === 'overlay' && setOpen((v) => !v),
      resetConversation: () => {
        const id = crypto.randomUUID();
        const now = Date.now();
        const chat: Chat = {
          id,
          createdAt: now,
          title: "New chat",
          messages: [
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: firstMessage,
              createdAt: now,
            },
          ],
        };
        setChats([chat]);
        setActiveId(id);
      },
    };
    onReady(controls);
  }, [onReady, mode, setOpen, setChats, setActiveId, firstMessage]);

  const isPristine = useMemo(() => {
    if (!chats || chats.length !== 1) return false;
    const c = chats[0];
    if ((c as any).serverId) return false;
    if (!c.messages || c.messages.length !== 1) return false;
    const m = c.messages[0];
    return m.role === 'assistant' && typeof m.content === 'string' && m.content === firstMessage;
  }, [chats, firstMessage]);

  useEffect(() => {
    let cancelled = false;
    if (!client) return;
    if (guestMode) return;
    if (!isPristine) return;
    (async () => {
      try {
        const list = await client.listChats();
        const items: any[] = list.items || [];
        const mapped: Chat[] = items.map((it) => ({
          id: it.chat_id,
          serverId: it.chat_id,
          createdAt: Date.parse(it.updated_at || it.created_at) || Date.now(),
          title: (it.title || "Untitled chat"),
          messages: [],
        }));
        const proj = items[0]?.project_name;
        if (proj) setHistoryTitle(proj);
        if (cancelled) return;
        if (mapped.length === 0) return;

        const latest = mapped[0];
        const hist = await client.getChat(latest.serverId!);
        const msgs = (hist.messages || []).map((m: any) => ({
          id: m.chat_id || crypto.randomUUID(),
          role: (m.role || "ASSISTANT").toString().toLowerCase(),
          content: m.content || "",
          createdAt: Date.parse(m.created_at || new Date().toISOString()) || Date.now(),
        }));
        latest.messages = msgs.length
          ? msgs
          : [
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: firstMessage,
                createdAt: Date.now(),
              },
            ];
        if (cancelled) return;
        setChats([latest, ...mapped.slice(1)]);
        setActiveId(latest.id);
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client, setChats, setActiveId, firstMessage, guestMode, isPristine]);

  const [abShow, setAbShow] = useState<boolean>(() => (abTesting ? false : true));
  useEffect(() => {
    let cancelled = false;
    const cfg = abTesting;
    if (!cfg || typeof cfg.testPercentage !== 'number') {
      setAbShow(true);
      return;
    }
    const pct = Math.max(0, Math.min(100, Math.floor(cfg.testPercentage)));
    const lsKey = avatarId ? `aether.widget.ab.${avatarId}.${guestMode ? 'guest' : (externalUserId || 'anon')}` : `aether.widget.ab.default`;

    if (guestMode && cfg.persistAssignment) {
      try {
        const raw = localStorage.getItem(lsKey);
        if (raw) {
          const parsed = JSON.parse(raw || '{}');
          if (typeof parsed.show === 'boolean') {
            setAbShow(parsed.show);
            return;
          }
        }
      } catch {}
    }

    (async () => {
      try {
        let show: boolean;
        if (client) {
          const res = await (client as any).assignAb?.({ testPercentage: pct, userId: externalUserId || null });
          show = typeof res?.show === 'boolean' ? !!res.show : true;
        } else {
          const roll = Math.floor(Math.random() * 100) + 1;
          show = roll <= pct;
        }
        if (cancelled) return;
        setAbShow(show);
        if (guestMode && abTesting?.persistAssignment) {
          try { localStorage.setItem(lsKey, JSON.stringify({ show })); } catch {}
        }
      } catch {
        if (!cancelled) setAbShow(true);
      }
    })();

    return () => { cancelled = true; };
  }, [abTesting, client, avatarId, externalUserId, guestMode]);

  const onSendMessage = client
    ? async ({ text, chat, updateThinking }: { text: string; chat: Chat; thinkingId: string; updateThinking: (content: string, done?: boolean, options?: { contactForm?: { promptText: string; chatId?: string; messageId?: string } }) => void }) => {
        let acc = "";
        try {
          const result = await client.streamQuery(
            { query: text, chat_id: chat.serverId || null },
            {
              onToken: (delta) => {
                acc += delta;
                updateThinking(acc, false);
              },
              onStatus: (s: string) => {
                if (!acc) updateThinking(s, false);
              },
            }
          );
          if ((result as any).contact_form) {
            const cfText = (result as any).contact_form as string;
            updateThinking(cfText, true, {
              contactForm: {
                promptText: cfText,
                chatId: (result as any).chat_id,
                messageId: (result as any).message_id,
              },
            });
          } else {
            const finalText = result.answer || acc || "(no answer)";
            updateThinking(finalText, true);
          }
          if (result.chat_id) {
            setChats((xs) => xs.map((c) => (c.id === chat.id ? { ...c, serverId: result.chat_id, title: (result as any).title || c.title } : c)));
          }
        } catch (e) {
          updateThinking("Sorry, I couldn't reach the server.", true);
        }
      }
    : undefined;

  const root = document.documentElement;
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value as string);
  });

  if (abTesting && !abShow) return null;

  // Inline mode: show launcher (bottom) and always show chat window (centered)
  if (mode === 'inline') {
    const launcherNode = (
      <Launcher
        open={false}
        onToggle={() => setAnimTick((n) => n + 1)}
        avatarImageUrl={resolvedAvatar}
        titleText={strings?.launcherTitle}
        subtitleText={strings?.launcherSubtitle}
        position={position}
        mode={mode}
      />
    );
    let portalEl: HTMLElement | null = null;
    if (launcherContainer) {
      if (typeof launcherContainer === 'string') {
        portalEl = document.querySelector(launcherContainer) as HTMLElement | null;
      } else {
        portalEl = launcherContainer as HTMLElement;
      }
    }
    return (
      <div style={cssVars as React.CSSProperties} className="w-full h-full relative">
        {portalEl ? createPortal(launcherNode, portalEl) : launcherNode}
        <ChatWindow
          key={`inline-${animTick}`}
          avatarName={resolvedName}
          avatarImageUrl={resolvedAvatar}
          bannerImageUrl={bannerImageUrl}
          companyName={resolvedCompany}
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
          setActiveId={setActiveId}
          versionTag={"v1.0  ."}
          muted={muted}
          setMuted={setMuted}
          play={play}
          onSendMessage={onSendMessage}
          onSubmitContact={client ? async (payload) => client.submitContact(payload) : undefined}
          guestMode={guestMode}
          position={position}
          mode={mode}
          strings={{
            headerSubtitle: strings?.headerSubtitle || welcomeMessage,
            bannerTagline: strings?.bannerTagline,
            inputPlaceholder: strings?.inputPlaceholder || "Type message...",
            thinkingLabel: strings?.thinkingLabel || "Thinking…",
            poweredByPrefix: "Powered by",
            poweredByBrand: "AetherLink",
            splashPoweredByBrand: "AetherLink",
            initialAssistantMessage: firstMessage,
          } as TextOverrides & { initialAssistantMessage?: string }}
          initialShowHistory={chatHistoryMode === "show-history"}
          historyTitle={historyTitle}
          onSelectHistoryChat={client ? async (c) => {
            try {
              if (!c.serverId) return;
              const hist = await client.getChat(c.serverId);
              const msgs = (hist.messages || []).map((m: any) => ({
                id: m.id || crypto.randomUUID(),
                role: (m.role || "ASSISTANT").toString().toLowerCase(),
                content: m.content || "",
                createdAt: Date.parse(m.created_at || new Date().toISOString()) || Date.now(),
              }));
              setChats((xs) => xs.map((x) => (x.id === c.id ? { ...x, messages: msgs, title: hist.title || x.title } : x)));
              setActiveId(c.id);
            } catch {}
          } : undefined}
        />
      </div>
    );
  }

  // Overlay mode: show launcher + animated chat window
  return (
    <div
      style={cssVars as React.CSSProperties}
      className={`fixed inset-0 pointer-events-none z-[60]`}
    >
      <Launcher open={open} onToggle={toggleOpen} avatarImageUrl={resolvedAvatar} titleText={strings?.launcherTitle} subtitleText={strings?.launcherSubtitle} position={position} mode={mode} />
      <AnimatePresence initial={false}>
        {open && (
          <ChatWindow
            avatarName={resolvedName}
            avatarImageUrl={resolvedAvatar}
            bannerImageUrl={bannerImageUrl}
            companyName={resolvedCompany}
            chats={chats}
            setChats={setChats}
            activeChat={activeChat}
            setActiveId={setActiveId}
            versionTag={"v1.0  ."}
            muted={muted}
            setMuted={setMuted}
            onClose={() => setOpen(false)}
            play={play}
            onSendMessage={onSendMessage}
            onSubmitContact={client ? async (payload) => client.submitContact(payload) : undefined}
            guestMode={guestMode}
            position={position}
            mode={mode}
            strings={{
              headerSubtitle: strings?.headerSubtitle || welcomeMessage,
              bannerTagline: strings?.bannerTagline,
              inputPlaceholder: strings?.inputPlaceholder || "Type message...",
              thinkingLabel: strings?.thinkingLabel || "Thinking…",
              poweredByPrefix: "Powered by",
              poweredByBrand: "AetherLink",
              splashPoweredByBrand: "AetherLink",
              initialAssistantMessage: firstMessage,
            } as TextOverrides & { initialAssistantMessage?: string }}
            initialShowHistory={chatHistoryMode === "show-history"}
            historyTitle={historyTitle}
            onSelectHistoryChat={client ? async (c) => {
              try {
                if (!c.serverId) return;
                const hist = await client.getChat(c.serverId);
                const msgs = (hist.messages || []).map((m: any) => ({
                  id: m.id || crypto.randomUUID(),
                  role: (m.role || "ASSISTANT").toString().toLowerCase(),
                  content: m.content || "",
                  createdAt: Date.parse(m.created_at || new Date().toISOString()) || Date.now(),
                }));
                setChats((xs) => xs.map((x) => (x.id === c.id ? { ...x, messages: msgs, title: hist.title || x.title } : x)));
                setActiveId(c.id);
              } catch {}
            } : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
