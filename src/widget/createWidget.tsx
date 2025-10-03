import { createRoot } from 'react-dom/client';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { PublicAvatarChatClient } from '../client/PublicAvatarChatClient';
import type {
  AvatarQueryStreamEvent,
  ClientSessionState,
  PublicChatHistoryResponse,
  PublicChatSummary,
  WidgetChatHistoryMode,
  WidgetController,
  WidgetOptions,
  WidgetPosition,
  WidgetPreviewConfig,
  WidgetPreviewScriptMessage,
  WidgetTheme,
} from '../types';
import { useWidgetChat, type WidgetChatClient } from './useWidgetChat';
import type { TranscriptMessage } from './chatReducer';
import type { ContactMethod, ContactCreatePublic } from '../types';

const STYLE_ELEMENT_ID = 'aetherbot-widget-react-styles';
const DEFAULT_THEME: WidgetTheme = {
  primary: '#4f46e5',
  secondary: '#6366f1',
  text: '#0f172a',
};
const DEFAULT_POSITION: WidgetPosition = 'bottom-right';
const DEFAULT_DISPLAY_MESSAGE = 'Ready to assist you';

const clamp = (value: number): number => Math.min(255, Math.max(0, value));

const normalizeHex = (value?: string | null): string | null => {
  if (!value) return null;
  const hex = value.trim();
  if (/^#([A-Fa-f0-9]{6})$/.test(hex)) return hex;
  if (/^([A-Fa-f0-9]{6})$/.test(hex)) return `#${hex}`;
  return null;
};

const parseHex = (hex: string): [number, number, number] | null => {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const numeric = parseInt(normalized.slice(1), 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  return [r, g, b];
};

const toHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, '0'))
    .join('')}`;

const lightenHex = (hex: string, amount: number): string => {
  const parsed = parseHex(hex);
  if (!parsed) return hex;
  const [r, g, b] = parsed;
  const result = [
    clamp(Math.round(r + (255 - r) * amount)),
    clamp(Math.round(g + (255 - g) * amount)),
    clamp(Math.round(b + (255 - b) * amount)),
  ];
  return toHex(result[0], result[1], result[2]);
};

const darkenHex = (hex: string, amount: number): string => {
  const parsed = parseHex(hex);
  if (!parsed) return hex;
  const [r, g, b] = parsed;
  const result = [
    clamp(Math.round(r * (1 - amount))),
    clamp(Math.round(g * (1 - amount))),
    clamp(Math.round(b * (1 - amount))),
  ];
  return toHex(result[0], result[1], result[2]);
};

const PREVIEW_CHAT_ID = 'widget-preview-chat';
const PREVIEW_SESSION_ID = 'widget-preview-session';
const DEFAULT_PREVIEW_MESSAGES: WidgetPreviewScriptMessage[] = [
  {
    role: 'USER',
    content: 'What can this assistant help me with?',
  },
  {
    role: 'ASSISTANT',
    content:
      "I'm your on-page copilot. In production I'd tap into your docs, knowledge base, and APIs to bring answers straight to visitors without leaving the page.",
  },
  {
    role: 'USER',
    content: 'Can it hand off to my human support team?',
  },
  {
    role: 'ASSISTANT',
    content:
      'Absolutely. I can gather context, create tickets, or ping your preferred channel so teammates step in with full conversation history.',
  },
];

const DEFAULT_CANNED_RESPONSES = [
  'Hi there! I\'m {name}, your preview co-pilot. Once you connect your sources I\'ll tailor responses to real product questions — this sandbox just shows the vibe.',
  'Everything here is running locally with demo data. In your live widget I\'ll search docs, reference guides, and FAQs before replying.',
  'Try tweaking the controls on the left — colors, layout, and placement all refresh instantly so you can ship the exact experience you want.',
  'Need a human touch? I can capture contact details and send a summary through Slack, email, or your CRM. You decide the workflow.',
];

const DEFAULT_PREVIEW_DELAY_MS = 650;

const previewWait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface NormalizedPreviewConfig {
  initialMessages: WidgetPreviewScriptMessage[];
  cannedResponses: string[];
  answerDelayMs: number;
  personaName: string;
}

const normalizePreviewConfig = (
  config: WidgetPreviewConfig | undefined,
  fallbackName: string,
): NormalizedPreviewConfig => ({
  initialMessages: config?.initialMessages?.length ? config.initialMessages : DEFAULT_PREVIEW_MESSAGES,
  cannedResponses: config?.cannedResponses?.length ? config.cannedResponses : DEFAULT_CANNED_RESPONSES,
  answerDelayMs:
    typeof config?.answerDelayMs === 'number' && config.answerDelayMs > 0
      ? config.answerDelayMs
      : DEFAULT_PREVIEW_DELAY_MS,
  personaName: config?.personaName?.trim().length ? config.personaName : fallbackName || 'AetherBot',
});

type PreviewHistoryMessage = PublicChatHistoryResponse['messages'][number];

class PreviewChatClient implements WidgetChatClient {
  private readonly config: NormalizedPreviewConfig;
  private readonly createdAt: string;
  private readonly session: ClientSessionState;
  private history: PublicChatHistoryResponse;
  private messageSerial = 0;
  private responseIndex = 0;

  constructor(config: WidgetPreviewConfig | undefined, personaName: string) {
    this.config = normalizePreviewConfig(config, personaName);
    this.createdAt = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    this.session = {
      chatId: PREVIEW_CHAT_ID,
      sessionId: PREVIEW_SESSION_ID,
      externalUserId: 'visitor-preview',
      externalUserName: this.config.personaName,
    };
    this.history = {
      chat_id: PREVIEW_CHAT_ID,
      avatar_id: 'preview-avatar',
      title: `${this.config.personaName} • Live Preview`,
      external_user_id: this.session.externalUserId,
      external_user_name: this.session.externalUserName,
      messages: [],
    };
    this.resetConversation();
  }

  getSessionState(): ClientSessionState {
    return { ...this.session };
  }

  resetConversation(): void {
    this.history = {
      ...this.history,
      chat_id: PREVIEW_CHAT_ID,
      messages: this.config.initialMessages.map((message, index) =>
        this.buildMessage(message.role, message.content, message.reasoning, index),
      ),
    };
    this.session.chatId = null;
    this.messageSerial = this.history.messages.length;
  }

  setActiveChat(chatId: string | null): void {
    this.session.chatId = chatId;
  }

  async listChats(): Promise<{ items?: PublicChatSummary[] }> {
    return {
      items: [
        {
          id: PREVIEW_CHAT_ID,
          title: `${this.config.personaName} Preview`,
          avatar_id: 'preview-avatar',
          project_name: 'Live Preview',
          external_user_id: this.session.externalUserId,
          created_at: this.createdAt,
          updated_at: new Date().toISOString(),
        },
      ],
    };
  }

  async getChatHistory(chatId?: string): Promise<PublicChatHistoryResponse> {
    const activeChatId = chatId ?? this.session.chatId ?? PREVIEW_CHAT_ID;
    return {
      ...this.history,
      chat_id: activeChatId,
      messages: [...this.history.messages],
    };
  }

  async *streamQuery(
    query: string,
  ): AsyncGenerator<AvatarQueryStreamEvent, void, unknown> {
    const trimmed = query.trim();
    if (!trimmed.length) {
      return;
    }

    const userMessage = this.buildMessage('USER', trimmed);
    this.history.messages.push(userMessage);
    this.trimHistory();

    const firstInteraction = !this.session.chatId;
    const activeChatId = this.session.chatId ?? PREVIEW_CHAT_ID;
    this.session.chatId = activeChatId;
    this.history.chat_id = activeChatId;

    yield { type: 'status', status: `${this.config.personaName} is thinking…` };
    await previewWait(this.config.answerDelayMs);

    const answer = this.pickResponse(trimmed);
    const tokens = this.tokenise(answer);
    for (const token of tokens) {
      await previewWait(18 + Math.random() * 24);
      yield { type: 'token', token };
    }

    const assistantMessage = this.buildMessage('ASSISTANT', answer);
    this.history.messages.push(assistantMessage);
    this.trimHistory();

    yield {
      type: 'final',
      payload: {
        chat_id: activeChatId,
        answer,
        context: [],
        created_new_chat: firstInteraction,
      },
    } satisfies AvatarQueryStreamEvent;
  }

  private buildMessage(
    role: Extract<PreviewHistoryMessage['role'], 'USER' | 'ASSISTANT'>,
    content: string,
    reasoning?: string[],
    index?: number,
  ): PreviewHistoryMessage {
    const timestampOffset = index !== undefined ? (this.config.initialMessages.length - index) * 45_000 : 0;
    const createdAt = new Date(Date.now() - timestampOffset).toISOString();
    return {
      id: `preview-${role.toLowerCase()}-${this.messageSerial++}`,
      role,
      content,
      created_at: createdAt,
      message_metadata: reasoning?.length ? { reasoning } : undefined,
    };
  }

  private trimHistory(): void {
    const maxMessages = 12;
    if (this.history.messages.length > maxMessages) {
      this.history.messages = this.history.messages.slice(-maxMessages);
    }
  }

  private pickResponse(question: string): string {
    if (!this.config.cannedResponses.length) {
      return `This is a sandbox reply for "${question}". Connect live data sources to unlock tailored answers.`;
    }
    const template = this.config.cannedResponses[this.responseIndex % this.config.cannedResponses.length];
    this.responseIndex += 1;
    return template
      .replace('{question}', question)
      .replace('{name}', this.config.personaName);
  }

  private tokenise(answer: string): string[] {
    const parts = answer.split(/(\s+)/).filter(Boolean);
    return parts.length ? parts : [answer];
  }
}

const ensureStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `
    .aetherbot-widget-root {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      pointer-events: none;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--aetherbot-text);
    }
    .aetherbot-widget-shell {
      position: fixed;
      inset: 0;
      pointer-events: none;
    }
    .aetherbot-widget-shell.open {
      pointer-events: auto;
    }
    .aetherbot-widget-fab {
      position: fixed;
      pointer-events: auto;
      border: none;
      border-radius: 9999px;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--aetherbot-primary-strong), var(--aetherbot-primary));
      color: #fff;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.28);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 1;
    }
    .aetherbot-widget-fab:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 24px 55px rgba(15, 23, 42, 0.32);
    }
    .aetherbot-widget-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      z-index: 1;
    }
    .aetherbot-widget-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
    .aetherbot-widget-panel-wrapper {
      position: fixed;
      width: 75vw;
      max-width: calc(100vw - 32px);
      height: 80vh;
      max-height: calc(100vh - 48px);
      display: flex;
      transform: var(--aetherbot-panel-transform-hidden, translateY(16px) scale(0.96));
      opacity: 0;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
      pointer-events: auto;
      z-index: 2;
    }
    .aetherbot-widget-panel-wrapper::after {
      content: '';
      position: absolute;
      width: 28px;
      height: 28px;
      background: var(--aetherbot-surface);
      border: 1px solid var(--aetherbot-border);
      box-shadow: 0 24px 45px rgba(15, 23, 42, 0.22);
      transform: rotate(45deg);
      pointer-events: none;
      opacity: 0;
      z-index: 0;
    }
    .aetherbot-widget-panel-wrapper.open {
      transform: var(--aetherbot-panel-transform-visible, translateY(0) scale(1));
      opacity: 1;
    }
    .aetherbot-widget-panel-wrapper.tail-bottom-right::after {
      opacity: 1;
      bottom: -14px;
      right: 72px;
    }
    .aetherbot-widget-panel-wrapper.tail-bottom-left::after {
      opacity: 1;
      bottom: -14px;
      left: 72px;
    }
    .aetherbot-widget-panel-wrapper.tail-bottom-center::after {
      opacity: 1;
      bottom: -14px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
    .aetherbot-widget-panel-wrapper.tail-top-right::after {
      opacity: 1;
      top: -14px;
      right: 72px;
    }
    .aetherbot-widget-panel-wrapper.tail-top-left::after {
      opacity: 1;
      top: -14px;
      left: 72px;
    }
    .aetherbot-widget-panel-wrapper.tail-top-center::after {
      opacity: 1;
      top: -14px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
    .aetherbot-widget-panel-wrapper.tail-center-left::after {
      opacity: 1;
      left: -14px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
    .aetherbot-widget-panel-wrapper.tail-center-right::after {
      opacity: 1;
      right: -14px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
    .aetherbot-widget-panel {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: var(--aetherbot-panel-radius, 28px);
      background: var(--aetherbot-surface);
      border: 1px solid var(--aetherbot-border);
      box-shadow: 0 32px 90px rgba(15, 23, 42, 0.35);
      backdrop-filter: blur(22px);
      overflow: hidden;
      pointer-events: auto;
      z-index: 1;
    }
    .aetherbot-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px;
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(255, 255, 255, 0.1));
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: var(--aetherbot-panel-radius, 28px) var(--aetherbot-panel-radius, 28px) 0 0;
      backdrop-filter: blur(12px);
      flex-shrink: 0;
    }
    .aetherbot-header-info { display: flex; align-items: center; gap: 16px; }
    .aetherbot-header-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--aetherbot-primary), var(--aetherbot-primary-strong));
      color: #fff;
      font-weight: 600;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);
    }
    .aetherbot-status-dot {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #22c55e;
      border: 2px solid #fff;
      bottom: -2px;
      right: -2px;
      animation: aetherbot-pulse 2s infinite;
    }
    .aetherbot-header-text h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      background: linear-gradient(135deg, #0f172a, rgba(15, 23, 42, 0.7));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .aetherbot-header-text span {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: rgba(15, 23, 42, 0.6);
      margin-top: 2px;
    }
    .aetherbot-header-actions { display: flex; align-items: center; gap: 8px; }
    .aetherbot-header-button {
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(15, 23, 42, 0.1);
      border-radius: 8px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.8);
      color: #0f172a;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
    }
    .aetherbot-header-button:hover {
      background: rgba(15, 23, 42, 0.05);
      border-color: rgba(79, 70, 229, 0.2);
      transform: translateY(-1px);
    }
    .aetherbot-header-icon { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
    .aetherbot-panel-body {
      flex: 1;
      position: relative;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(79, 70, 229, 0.02));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }
    .aetherbot-message-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: relative;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(15, 23, 42, 0.02));
    }
    .aetherbot-message-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .aetherbot-message-scroll::-webkit-scrollbar-thumb {
      background: rgba(15, 23, 42, 0.2);
      border-radius: 6px;
    }
    .aetherbot-message-row {
      display: flex;
      gap: 16px;
      max-width: 80%;
      animation: aetherbot-fade-in 0.3s ease-out;
    }
    .aetherbot-message-row.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .aetherbot-message-row.assistant {
      align-self: flex-start;
    }
    .aetherbot-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.1));
      color: var(--aetherbot-primary);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
      flex-shrink: 0;
    }
    .aetherbot-message-row.user .aetherbot-avatar {
      background: linear-gradient(135deg, var(--aetherbot-primary), var(--aetherbot-primary-strong));
      color: #fff;
      border-color: rgba(79, 70, 229, 0.2);
    }
    .aetherbot-message-bubble {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
      border-radius: 16px;
      padding: 16px 20px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      backdrop-filter: blur(8px);
      position: relative;
    }
    .aetherbot-message-row.user .aetherbot-message-bubble {
      background: linear-gradient(135deg, var(--aetherbot-primary), var(--aetherbot-primary-strong));
      color: #fff;
      border-color: rgba(79, 70, 229, 0.2);
    }
    .aetherbot-message-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: rgba(15, 23, 42, 0.6);
      margin-bottom: 8px;
    }
    .aetherbot-message-row.user .aetherbot-message-meta {
      color: rgba(255, 255, 255, 0.8);
    }
    .aetherbot-message-meta .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.5;
    }
    .aetherbot-pending-label {
      padding: 2px 6px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.1);
      font-size: 10px;
      text-transform: none;
      letter-spacing: 0;
    }
    .aetherbot-message-row.user .aetherbot-pending-label {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    .aetherbot-message-content {
      font-size: 14px;
      line-height: 1.6;
      color: #0f172a;
      word-wrap: break-word;
    }
    .aetherbot-message-row.user .aetherbot-message-content {
      color: #fff;
    }
    .aetherbot-message-content p {
      margin: 0 0 8px 0;
    }
    .aetherbot-message-content pre {
      background: rgba(15, 23, 42, 0.08);
      padding: 12px 14px;
      border-radius: 12px;
      overflow-x: auto;
    }
    .aetherbot-message-content code {
      font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      font-size: 12px;
    }
    .aetherbot-empty-state {
      margin: auto;
      text-align: center;
      padding: 48px 24px;
      border-radius: 24px;
      border: 1px dashed var(--aetherbot-border);
      color: var(--aetherbot-muted);
      background: rgba(255, 255, 255, 0.7);
    }
    .aetherbot-empty-state h3 { margin: 12px 0 8px 0; color: var(--aetherbot-text); font-size: 18px; }
    .aetherbot-empty-state p { margin: 0; font-size: 14px; line-height: 1.6; }
    .aetherbot-reasoning {
      margin-bottom: 16px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: rgba(15, 23, 42, 0.03);
      backdrop-filter: blur(8px);
    }
    .aetherbot-reasoning.streaming {
      border-style: dashed;
      border-color: rgba(79, 70, 229, 0.2);
    }
    .aetherbot-reasoning-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }
    .aetherbot-reasoning-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: #0f172a;
    }
    .aetherbot-brain-icon {
      width: 24px;
      height: 24px;
      border-radius: 8px;
      background: rgba(79, 70, 229, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--aetherbot-primary);
    }
    .aetherbot-reasoning-toggle {
      border: none;
      background: transparent;
      color: var(--aetherbot-primary);
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    .aetherbot-reasoning-toggle:hover {
      color: var(--aetherbot-primary-strong);
    }
    .aetherbot-reasoning-summary {
      font-size: 12px;
      color: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .aetherbot-streaming-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--aetherbot-primary);
      animation: aetherbot-pulse 1.2s infinite;
      margin-top: 4px;
    }
    .aetherbot-reasoning-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 192px;
      overflow-y: auto;
      padding-right: 8px;
    }
    .aetherbot-reasoning-step {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      font-size: 12px;
      color: rgba(15, 23, 42, 0.6);
    }
    .aetherbot-reasoning-bullet {
      width: 6px;
      height: 6px;
      margin-top: 8px;
      border-radius: 50%;
      background: var(--aetherbot-primary);
      flex-shrink: 0;
    }
    .aetherbot-reasoning-bullet.pulsing {
      animation: aetherbot-pulse 1.2s infinite;
    }
    .aetherbot-input-area {
      border-top: 1px solid rgba(15, 23, 42, 0.08);
      padding: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.8));
      backdrop-filter: blur(12px);
      flex-shrink: 0;
    }
    .aetherbot-input-form {
      display: flex;
      align-items: end;
      gap: 16px;
      max-width: none;
    }
    .aetherbot-input-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .aetherbot-textarea {
      width: 100%;
      min-height: 60px;
      max-height: 120px;
      resize: none;
      border-radius: 12px;
      padding: 16px;
      border: 2px solid rgba(15, 23, 42, 0.08);
      font-size: 16px;
      line-height: 1.5;
      color: #0f172a;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      transition: border-color 0.2s ease;
    }
    .aetherbot-textarea:focus {
      outline: none;
      border-color: rgba(79, 70, 229, 0.5);
    }
    .aetherbot-input-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .aetherbot-depth-control {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: rgba(15, 23, 42, 0.6);
    }
    .aetherbot-depth-control input {
      width: 64px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 0 8px;
      text-align: center;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.8);
    }
    .aetherbot-send-button {
      border: none;
      border-radius: 12px;
      padding: 16px 24px;
      background: linear-gradient(135deg, var(--aetherbot-primary), var(--aetherbot-primary-strong));
      color: #fff;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
      min-height: 56px;
    }
    .aetherbot-send-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .aetherbot-send-button:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
    }
    .aetherbot-footer-hint {
      font-size: 12px;
      color: rgba(15, 23, 42, 0.5);
      text-align: right;
    }
    @keyframes aetherbot-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .aetherbot-history-grid {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .aetherbot-history-card {
      border: 1px solid var(--aetherbot-border);
      border-radius: 18px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .aetherbot-history-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.18);
      border-color: rgba(99, 102, 241, 0.45);
    }
    .aetherbot-history-card.active {
      border-color: var(--aetherbot-primary);
      box-shadow: 0 18px 42px rgba(79, 70, 229, 0.28);
    }
    .aetherbot-history-card h4 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--aetherbot-text);
    }
    .aetherbot-history-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--aetherbot-muted);
      flex-wrap: wrap;
    }
    .aetherbot-chip {
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.1);
      font-size: 12px;
      color: var(--aetherbot-muted);
    }
    .aetherbot-loader {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: var(--aetherbot-primary);
      animation: aetherbot-spin 0.9s linear infinite;
      margin: 0 auto;
    }
    .aetherbot-skeleton {
      width: 100%;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
      background-size: 200px 100%;
      animation: aetherbot-shimmer 1.6s infinite;
    }
    .aetherbot-error-banner {
      margin: 16px 20px 0 20px;
      padding: 12px 16px;
      border-radius: 14px;
      border: 1px solid rgba(239, 68, 68, 0.35);
      background: rgba(239, 68, 68, 0.12);
      color: #b91c1c;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .aetherbot-error-banner button {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-weight: 600;
    }
    .aetherbot-contact-form {
      margin-top: 16px;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid var(--aetherbot-border);
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.92));
      box-shadow: 0 8px 24px rgba(15,23,42,0.12);
      backdrop-filter: blur(8px);
    }
    .aetherbot-contact-form-header {
      font-size: 15px;
      font-weight: 600;
      color: var(--aetherbot-text);
      margin-bottom: 18px;
      line-height: 1.4;
    }
    .aetherbot-contact-form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .aetherbot-form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .aetherbot-form-label {
      font-size: 13px;
      font-weight: 500;
      color: rgba(15, 23, 42, 0.7);
    }
    .aetherbot-form-input, .aetherbot-form-textarea {
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(15, 23, 42, 0.15);
      background: rgba(255, 255, 255, 0.9);
      color: var(--aetherbot-text);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
      outline: none;
    }
    .aetherbot-form-input:focus, .aetherbot-form-textarea:focus {
      border-color: var(--aetherbot-primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
      background: rgba(255, 255, 255, 1);
    }
    .aetherbot-form-textarea {
      resize: vertical;
      min-height: 80px;
      line-height: 1.5;
    }
    .aetherbot-radio-group {
      display: flex;
      gap: 20px;
    }
    .aetherbot-radio-option {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--aetherbot-text);
      cursor: pointer;
    }
    .aetherbot-radio-option input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: var(--aetherbot-primary);
    }
    .aetherbot-form-error {
      font-size: 13px;
      color: #dc2626;
      padding: 8px 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
    }
    .aetherbot-form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .aetherbot-form-button {
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid;
      min-width: 100px;
    }
    .aetherbot-form-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .aetherbot-form-button-secondary {
      background: transparent;
      border-color: rgba(15, 23, 42, 0.2);
      color: rgba(15, 23, 42, 0.7);
    }
    .aetherbot-form-button-secondary:hover:not(:disabled) {
      background: rgba(15, 23, 42, 0.05);
      border-color: rgba(15, 23, 42, 0.3);
    }
    .aetherbot-form-button-primary {
      background: linear-gradient(135deg, var(--aetherbot-primary), var(--aetherbot-primary-strong));
      border-color: var(--aetherbot-primary);
      color: white;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
    }
    .aetherbot-form-button-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
    .aetherbot-contact-form-success {
      margin-top: 16px;
      padding: 18px 20px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
      border: 1px solid rgba(34, 197, 94, 0.2);
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .aetherbot-success-icon {
      width: 32px;
      height: 32px;
      background: #22c55e;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      flex-shrink: 0;
    }
    .aetherbot-success-title {
      font-size: 15px;
      font-weight: 600;
      color: #166534;
      margin-bottom: 2px;
    }
    .aetherbot-success-text {
      font-size: 13px;
      color: #15803d;
      line-height: 1.4;
    }
    @keyframes aetherbot-spin { to { transform: rotate(360deg); } }
    @keyframes aetherbot-pulse { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.2); opacity: 1; } }
    @keyframes aetherbot-shimmer { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }
  `;
  document.head.appendChild(style);
};

type ChatHistoryMode = WidgetChatHistoryMode | 'history';

interface NormalizedWidgetOptions extends WidgetOptions {
  theme: WidgetTheme;
  position: WidgetPosition;
  externalUserId: string;
  displayName: string;
  displayMessage: string;
  autoOpenMode: 'never' | 'immediate' | 'delay' | 'scroll' | 'manual';
  autoOpen: boolean;
  autoOpenDelaySeconds: number;
  autoOpenScrollPercentage: number;
  chatHistoryMode: ChatHistoryMode;
}

const normalizeOptions = (options: WidgetOptions): NormalizedWidgetOptions => {
  const theme: WidgetTheme = {
    primary:
      normalizeHex(options.theme?.primary)?.toLowerCase() ??
      options.theme?.primary ??
      DEFAULT_THEME.primary,
    secondary:
      normalizeHex(options.theme?.secondary)?.toLowerCase() ??
      options.theme?.secondary ??
      DEFAULT_THEME.secondary,
    text:
      normalizeHex(options.theme?.text)?.toLowerCase() ??
      options.theme?.text ??
      DEFAULT_THEME.text,
  };

  const trimmedFirstMessage = typeof options.firstMessage === 'string' ? options.firstMessage.trim() : undefined;
  const firstMessage = trimmedFirstMessage && trimmedFirstMessage.length ? trimmedFirstMessage : undefined;

  const trimmedDisplayMessage = typeof options.displayMessage === 'string' ? options.displayMessage.trim() : undefined;
  const displayMessage = trimmedDisplayMessage && trimmedDisplayMessage.length
    ? trimmedDisplayMessage
    : DEFAULT_DISPLAY_MESSAGE;

  const autoOpenMode = options.autoOpenMode ?? (options.autoOpen ? 'immediate' : 'never');
  const autoOpenDelaySeconds = options.autoOpenDelaySeconds && options.autoOpenDelaySeconds > 0
    ? options.autoOpenDelaySeconds
    : 5;
  const autoOpenScrollPercentage = options.autoOpenScrollPercentage && options.autoOpenScrollPercentage > 0
    ? Math.min(100, options.autoOpenScrollPercentage)
    : 45;

  return {
    ...options,
    theme,
    position: options.position ?? DEFAULT_POSITION,
    externalUserId: options.externalUserId ?? 'guest-user',
    displayName: options.displayName ?? 'AetherBot',
    displayMessage,
    autoOpenMode,
    autoOpen: options.autoOpen ?? false,
    autoOpenDelaySeconds,
    autoOpenScrollPercentage,
    chatHistoryMode: options.chatHistoryMode ?? 'history',
    firstMessage,
  };
};

const applyThemeVariables = (element: HTMLElement, theme: WidgetTheme) => {
  element.style.setProperty('--aetherbot-primary', theme.primary);
  element.style.setProperty('--aetherbot-primary-strong', darkenHex(theme.primary, 0.18));
  element.style.setProperty('--aetherbot-primary-soft', lightenHex(theme.primary, 0.65));
  element.style.setProperty('--aetherbot-text', theme.text);
  element.style.setProperty('--aetherbot-muted', 'rgba(15, 23, 42, 0.6)');
  element.style.setProperty('--aetherbot-border', 'rgba(15, 23, 42, 0.12)');
  element.style.setProperty('--aetherbot-surface', 'rgba(255, 255, 255, 0.98)');
  element.style.setProperty('--aetherbot-surface-alt', 'rgba(248, 250, 252, 0.92)');
};

type PanelStyle = CSSProperties & Record<string, string | number>;

const getPositionStyles = (position: WidgetPosition): { fab: CSSProperties; panel: PanelStyle } => {
  const offset = 24;
  const fab: CSSProperties = {};
  const panel: PanelStyle = {};

  switch (position) {
    case 'bottom-left':
      fab.left = `${offset}px`;
      fab.bottom = `${offset}px`;
      panel.left = `${offset}px`;
      panel.bottom = `${offset + 80}px`;
      break;
    case 'bottom-center':
      fab.left = '50%';
      fab.bottom = `${offset}px`;
      fab.transform = 'translateX(-50%)';
      panel.left = '50%';
      panel.bottom = `${offset + 80}px`;
      panel['--aetherbot-panel-transform-hidden'] = 'translate(-50%, 16px) scale(0.96)';
      panel['--aetherbot-panel-transform-visible'] = 'translate(-50%, 0) scale(1)';
      break;
    case 'top-right':
      fab.right = `${offset}px`;
      fab.top = `${offset}px`;
      panel.right = `${offset}px`;
      panel.top = `${offset + 80}px`;
      panel['--aetherbot-panel-transform-hidden'] = 'translateY(-16px) scale(0.96)';
      panel['--aetherbot-panel-transform-visible'] = 'translateY(0) scale(1)';
      break;
    case 'top-left':
      fab.left = `${offset}px`;
      fab.top = `${offset}px`;
      panel.left = `${offset}px`;
      panel.top = `${offset + 80}px`;
      panel['--aetherbot-panel-transform-hidden'] = 'translateY(-16px) scale(0.96)';
      panel['--aetherbot-panel-transform-visible'] = 'translateY(0) scale(1)';
      break;
    case 'top-center':
      fab.left = '50%';
      fab.top = `${offset}px`;
      fab.transform = 'translateX(-50%)';
      panel.left = '50%';
      panel.top = `${offset + 80}px`;
      panel['--aetherbot-panel-transform-hidden'] = 'translate(-50%, -16px) scale(0.96)';
      panel['--aetherbot-panel-transform-visible'] = 'translate(-50%, 0) scale(1)';
      break;
    case 'center':
      fab.right = `${offset}px`;
      fab.bottom = `${offset}px`;
      panel.left = '50%';
      panel.top = '50%';
      panel['--aetherbot-panel-transform-hidden'] = 'translate(-50%, -40%) scale(0.9)';
      panel['--aetherbot-panel-transform-visible'] = 'translate(-50%, -50%) scale(1)';
      break;
    case 'center-left':
      fab.left = `${offset}px`;
      fab.bottom = `${offset}px`;
      panel.left = `${offset}px`;
      panel.top = '50%';
      panel['--aetherbot-panel-transform-hidden'] = 'translateY(-40%) scale(0.9)';
      panel['--aetherbot-panel-transform-visible'] = 'translateY(-50%) scale(1)';
      break;
    case 'center-right':
      fab.right = `${offset}px`;
      fab.bottom = `${offset}px`;
      panel.right = `${offset}px`;
      panel.top = '50%';
      panel['--aetherbot-panel-transform-hidden'] = 'translateY(-40%) scale(0.9)';
      panel['--aetherbot-panel-transform-visible'] = 'translateY(-50%) scale(1)';
      break;
    default:
      fab.right = `${offset}px`;
      fab.bottom = `${offset}px`;
      panel.right = `${offset}px`;
      panel.bottom = `${offset + 80}px`;
      break;
  }

  return { fab, panel };
};

const getPanelTailClass = (position: WidgetPosition): string | null => {
  switch (position) {
    case 'bottom-left':
      return 'tail-bottom-left';
    case 'bottom-center':
      return 'tail-bottom-center';
    case 'bottom-right':
      return 'tail-bottom-right';
    case 'top-left':
      return 'tail-top-left';
    case 'top-center':
      return 'tail-top-center';
    case 'top-right':
      return 'tail-top-right';
    case 'center-left':
      return 'tail-center-left';
    case 'center-right':
      return 'tail-center-right';
    case 'center':
      return 'tail-bottom-right';
    default:
      return null;
  }
};

const formatTime = (iso: string | undefined): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (iso: string | undefined): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ChatBubbleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3.5L9 21v-5H7a3 3 0 0 1-3-3V5Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 6h14" /><path d="M5 12h14" /><path d="M5 18h9" />
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v6h-6" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" /><path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3" /><path d="M9 12h6" /><path d="M9 16h6" /><path d="M5 12v.01" /><path d="M19 12v.01" />
  </svg>
);

const BrainIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

interface ReasoningBlockProps {
  steps: string[];
  streaming?: boolean;
  defaultExpanded?: boolean;
}

const ReasoningBlock = ({ steps, streaming, defaultExpanded = false }: ReasoningBlockProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  if (!steps.length) return null;
  const latest = steps[steps.length - 1];

  return (
    <div className={`aetherbot-reasoning${streaming ? ' streaming' : ''}`}>
      <div className="aetherbot-reasoning-header">
        <div className="aetherbot-reasoning-title">
          <div className="aetherbot-brain-icon">
            <BrainIcon />
          </div>
          <span>{streaming ? 'Reasoning Process' : 'Reasoning Process'}</span>
        </div>
        <button
          type="button"
          className="aetherbot-reasoning-toggle"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              <ChevronUpIcon />
              Hide
            </>
          ) : (
            <>
              <ChevronDownIcon />
              Show
            </>
          )}
        </button>
      </div>
      {expanded ? (
        <div className="aetherbot-reasoning-list">
          {steps.map((step, idx) => (
            <div key={idx} className="aetherbot-reasoning-step">
              <span className={`aetherbot-reasoning-bullet${streaming && idx === steps.length - 1 ? ' pulsing' : ''}`} />
              <div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{step}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="aetherbot-reasoning-summary">
          <span className="aetherbot-streaming-dot" />
          <span>{latest}</span>
        </div>
      )}
    </div>
  );
};

interface MessageBubbleProps {
  message: TranscriptMessage;
  displayName: string;
  chatId?: string | null;
  avatarId?: string;
  client?: WidgetChatClient;
  updateContactForm?: (messageId: string, patch: Partial<NonNullable<TranscriptMessage['contactForm']>>) => void;
}

interface ExtendedMessageBubbleProps extends MessageBubbleProps {
  chatId?: string | null;
  avatarId?: string;
  client?: WidgetChatClient;
  updateContactForm?: (messageId: string, patch: Partial<NonNullable<TranscriptMessage['contactForm']>>) => void;
}

const MessageBubble = ({ message, displayName, chatId, avatarId, client, updateContactForm }: MessageBubbleProps) => {
  const isUser = message.role === 'USER';
  const pending = message.state !== 'persisted';
  const timeLabel = formatTime(message.createdAt);
  const hasContactForm = message.role === 'ASSISTANT' && message.contactForm && !message.contactForm.dismissed;

  return (
    <div className={`aetherbot-message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className="aetherbot-avatar">{isUser ? <UserIcon /> : <BotIcon />}</div>
      <div className="aetherbot-message-bubble">
        <div className="aetherbot-message-meta">
          <span>{isUser ? 'You' : displayName}</span>
          {pending && <span className="aetherbot-pending-label">pending</span>}
          <span className="dot" />
          {timeLabel && <span>{timeLabel}</span>}
        </div>
        {message.reasoning?.length && message.role === 'ASSISTANT' ? (
          <ReasoningBlock steps={message.reasoning} />
        ) : null}
        <div className="aetherbot-message-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>
        {hasContactForm && chatId && avatarId && client && updateContactForm ? (
          <ContactFormCard
            prompt={message.contactForm.prompt}
            chatId={chatId}
            avatarId={avatarId}
            messageId={message.id}
            client={client}
            onSubmitted={(id) => updateContactForm(id, { submitted: true })}
            onDismiss={(id) => updateContactForm(id, { dismissed: true })}
          />
        ) : null}
      </div>
    </div>
  );
};

interface ContactFormCardProps {
  prompt: string;
  chatId: string | null;
  avatarId: string;
  messageId: string;
  client: WidgetChatClient;
  onSubmitted: (messageId: string) => void;
  onDismiss: (messageId: string) => void;
}

const ContactFormCard = ({ prompt, chatId, avatarId, messageId, client, onSubmitted, onDismiss }: ContactFormCardProps) => {
  const [name, setName] = useState('');
  const [method, setMethod] = useState<ContactMethod>('email');
  const [value, setValue] = useState('');
  const [concern, setConcern] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !!chatId && name.trim().length > 0 && concern.trim().length > 0;

  const isUuid = (v: string): boolean => /^(?:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$/.test(v);

  const submit = async () => {
    setError(null);
    if (!chatId) {
      setError('Preparing conversation. Please try again in a moment.');
      return;
    }
    const base: any = {
      chat_id: chatId,
      avatar_id: avatarId,
      name: name.trim(),
      contact_method: method,
      contact_value: value.trim().length ? value.trim() : null,
      concern_text: concern.trim(),
    };
    if (isUuid(messageId)) {
      base.message_id = messageId;
    }
    const payload: ContactCreatePublic = base as ContactCreatePublic;
    setSubmitting(true);
    try {
      if ('submitContact' in client && typeof (client as any).submitContact === 'function') {
        await (client as any).submitContact(payload);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setSubmitted(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to submit. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      onSubmitted(messageId);
    }
  }, [submitted, messageId, onSubmitted]);

  return (
    <div style={{ marginTop: 12, padding: 16, borderRadius: 14, border: '1px solid var(--aetherbot-border)', background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(248,250,252,0.9))', boxShadow: '0 6px 18px rgba(15,23,42,0.08)' }}>
      <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>{prompt}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        <label style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)' }}>Your name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--aetherbot-border)', background: '#fff' }}
        />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 6 }}>
          <label style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)' }}>Preferred contact</label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input type="radio" name="contact-method" value="email" checked={method === 'email'} onChange={() => setMethod('email')} /> Email
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input type="radio" name="contact-method" value="call" checked={method === 'call'} onChange={() => setMethod('call')} /> Call
          </label>
        </div>
        <label style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)' }}>{method === 'email' ? 'Email address (optional)' : 'Phone number (optional)'}</label>
        <input
          type={method === 'email' ? 'email' : 'tel'}
          placeholder={method === 'email' ? 'you@example.com' : '555‑123‑4567'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--aetherbot-border)', background: '#fff' }}
        />
        <label style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)' }}>What’s the concern?</label>
        <textarea
          placeholder="Tell us briefly what you need help with…"
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          rows={3}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--aetherbot-border)', resize: 'vertical', background: '#fff' }}
        />
        {error ? (
          <div style={{ fontSize: 12, color: '#b91c1c' }}>{error}</div>
        ) : null}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <button
            type="button"
            onClick={() => onDismiss(messageId)}
            className="aetherbot-header-button"
            style={{ background: 'transparent', borderColor: 'rgba(15,23,42,0.15)' }}
          >
            Not now
          </button>
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={submit}
            className="aetherbot-header-button"
          >
            {submitting ? 'Submitting…' : 'Send to team'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface StreamingAssistantProps {
  displayName: string;
  reasoning: string[];
  answer: string;
  streaming: boolean;
}

const StreamingAssistant = ({ displayName, reasoning, answer, streaming }: StreamingAssistantProps) => (
  <div className="aetherbot-message-row assistant">
    <div className="aetherbot-avatar">
      {streaming ? (
        <div style={{ animation: 'aetherbot-pulse 1.2s infinite' }}>
          <BotIcon />
        </div>
      ) : (
        <BotIcon />
      )}
    </div>
    <div className="aetherbot-message-bubble">
      <div className="aetherbot-message-meta">
        <span>{displayName}</span>
        {streaming && (
          <>
            <span className="dot" />
            <span className="aetherbot-pending-label">responding…</span>
          </>
        )}
      </div>
      {reasoning.length ? <ReasoningBlock steps={reasoning} streaming /> : null}
      {answer ? (
        <div className="aetherbot-message-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
          {streaming && <span style={{ display: 'inline-block', width: '2px', height: '16px', background: 'var(--aetherbot-primary)', marginLeft: '4px', animation: 'aetherbot-pulse 1s infinite' }} />}
        </div>
      ) : null}
    </div>
  </div>
);

interface EmptyStateProps {
  firstMessage?: string;
}

const EmptyState = ({ firstMessage }: EmptyStateProps) => (
  <div className="aetherbot-empty-state">
    <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' }}>
      <ChatBubbleIcon />
    </div>
    <h3>Start a conversation</h3>
    {firstMessage ? (
      <p>{firstMessage}</p>
    ) : (
      <p>Ask your avatar anything. It will use its knowledge base and reasoning to provide thoughtful, helpful answers.</p>
    )}
  </div>
);

interface ChatHistoryListProps {
  chats: PublicChatSummary[];
  loading: boolean;
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
  onRefresh: () => void;
  previews?: Record<string, { role: 'USER' | 'ASSISTANT'; content: string }[]>;
}

const ChatHistoryList = ({ chats, loading, activeChatId, onSelect, onRefresh, previews }: ChatHistoryListProps) => {
  if (loading) {
    return (
      <div className="aetherbot-history-grid">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="aetherbot-skeleton" key={idx} />
        ))}
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className="aetherbot-history-grid">
        <div className="aetherbot-empty-state">
          <h3>No saved chats yet</h3>
          <p>Start a conversation to see it appear here. We keep your sessions tied to this browser.</p>
          <button type="button" className="aetherbot-header-button" onClick={onRefresh}>
            <RefreshIcon />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aetherbot-history-grid">
      {chats.map((chat) => (
        <button
          key={chat.id}
          type="button"
          className={`aetherbot-history-card${chat.id === activeChatId ? ' active' : ''}`}
          onClick={() => onSelect(chat.id)}
        >
          <h4>{chat.title || 'Untitled chat'}</h4>
          <div className="aetherbot-history-meta">
            <span className="aetherbot-chip">{chat.id.slice(0, 8)}</span>
            <span>{formatDate(chat.updated_at)}</span>
          </div>
          {previews && previews[chat.id] && previews[chat.id].length ? (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {previews[chat.id].map((m, i) => (
                <div key={`${chat.id}-preview-${i}`} style={{ display: 'flex', justifyContent: m.role === 'USER' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '85%', fontStyle: 'italic', fontSize: 12, padding: '8px 10px', borderRadius: 12, border: '1px solid rgba(15,23,42,0.12)', background: m.role === 'USER' ? 'rgba(79,70,229,0.08)' : 'rgba(147,51,234,0.08)', color: '#0f172a' }}>
                    <span style={{ opacity: 0.7, marginRight: 6 }}>{m.role === 'USER' ? 'You:' : 'AI:'}</span>
                    <span style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.content}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </button>
      ))}
      <button type="button" className="aetherbot-header-button" onClick={onRefresh}>
        <RefreshIcon />
        Refresh
      </button>
    </div>
  );
};

interface ChatViewProps {
  messages: TranscriptMessage[];
  ephemeralUser: TranscriptMessage | null;
  showStreamingAssistant: boolean;
  liveAnswer: string;
  reasoning: string[];
  streaming: boolean;
  loading: boolean;
  displayName: string;
  firstMessage?: string;
  bottomAnchor: React.RefObject<HTMLDivElement | null>;
  chatId: string | null;
  avatarId: string;
  client: WidgetChatClient;
  updateContactForm: (messageId: string, patch: { submitted?: boolean; dismissed?: boolean }) => void;
}

const ChatView = ({
  messages,
  ephemeralUser,
  showStreamingAssistant,
  liveAnswer,
  reasoning,
  streaming,
  loading,
  displayName,
  firstMessage,
  bottomAnchor,
  chatId,
  avatarId,
  client,
  updateContactForm,
}: ChatViewProps) => {
  const isInitialState = !messages.length && !ephemeralUser && !showStreamingAssistant;
  const trimmedFirstMessage = firstMessage?.trim() ?? '';
  const syntheticInitialMessage: TranscriptMessage | null = isInitialState && trimmedFirstMessage.length
    ? {
        id: 'synthetic-initial-assistant',
        role: 'ASSISTANT',
        content: trimmedFirstMessage,
        createdAt: '',
        state: 'persisted',
      }
    : null;

  return (
    <div className="aetherbot-message-scroll">
      {loading ? (
        <div className="aetherbot-loader" />
      ) : (
        <>
          {messages.map((message) => {
            const effectiveChatId = chatId ?? ((message as any).contactForm?.chatId ?? null);
            return (
              <MessageBubble 
                key={message.id} 
                message={message} 
                displayName={displayName}
                chatId={effectiveChatId}
                avatarId={avatarId}
                client={client}
                updateContactForm={updateContactForm}
              />
            );
          })}
          {ephemeralUser ? (
            <MessageBubble key={ephemeralUser.id} message={ephemeralUser} displayName={displayName} />
          ) : null}
          {showStreamingAssistant ? (
            <StreamingAssistant
              displayName={displayName}
              reasoning={reasoning}
              answer={liveAnswer}
              streaming={streaming}
            />
          ) : null}
          {syntheticInitialMessage ? (
            <MessageBubble
              key={syntheticInitialMessage.id}
              message={syntheticInitialMessage}
              displayName={displayName}
            />
          ) : null}
          {isInitialState && !syntheticInitialMessage ? <EmptyState firstMessage={firstMessage} /> : null}
          <div ref={bottomAnchor as React.RefObject<HTMLDivElement>} />
        </>
      )}
    </div>
  );
};

interface InputAreaProps {
  query: string;
  setQuery: (value: string) => void;
  onSend: () => void;
  sending: boolean;
}

const InputArea = ({ query, setQuery, onSend, sending }: InputAreaProps) => (
  <div className="aetherbot-input-area">
    <div className="aetherbot-input-form">
      <div className="aetherbot-input-column">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="aetherbot-textarea"
          placeholder="Ask your avatar anything..."
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <div className="aetherbot-input-footer">
          <div className="aetherbot-footer-hint">Press Enter to send, Shift+Enter for new line</div>
        </div>
      </div>
      <button
        type="button"
        className="aetherbot-send-button"
        disabled={!query.trim().length || sending}
        onClick={onSend}
      >
        {sending ? <div className="aetherbot-loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <SendIcon />}
      </button>
    </div>
  </div>
);

interface WidgetHostProps {
  client: WidgetChatClient;
  options: NormalizedWidgetOptions;
  controller: WidgetController;
  destroySelf: () => void;
  positionStyles: { fab: CSSProperties; panel: PanelStyle };
}

const WidgetHost = ({ client, options, controller, destroySelf, positionStyles }: WidgetHostProps) => {
  const [open, setOpen] = useState(options.autoOpenMode === 'immediate');
  const [view, setView] = useState<'chat' | 'history'>(options.chatHistoryMode === 'show-history' ? 'history' : 'chat');
  const [query, setQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const autoOpenedRef = useRef(options.autoOpenMode === 'immediate');
  const [chatPreviews, setChatPreviews] = useState<Record<string, { role: 'USER' | 'ASSISTANT'; content: string }[]>>({});

  const {
    state,
    chatId,
    chats,
    loadingChats,
    loadingHistory,
    sending,
    error,
    setError,
    refreshChats,
    selectChat,
    sendMessage,
    resetConversation,
    updateContactForm,
  } = useWidgetChat(client);

  useEffect(() => {
    controller.open = () => setOpen(true);
    controller.close = () => setOpen(false);
    controller.toggle = () => setOpen((prev) => !prev);
    controller.resetConversation = () => {
      resetConversation();
      setView('chat');
      refreshChats().catch(() => {});
    };
    controller.destroy = () => {
      setOpen(false);
      setTimeout(() => destroySelf(), 200);
    };
  }, [controller, destroySelf, resetConversation, refreshChats]);

  useEffect(() => {
    if (autoOpenedRef.current) return;
    if (options.autoOpenMode === 'delay') {
      const timeout = window.setTimeout(() => {
        setOpen(true);
        autoOpenedRef.current = true;
      }, (options.autoOpenDelaySeconds || 3) * 1000);
      return () => window.clearTimeout(timeout);
    }
    if (options.autoOpenMode === 'scroll') {
      const handleScroll = () => {
        const doc = document.documentElement;
        if (!doc) return;
        const scrolled = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
        if (scrolled >= (options.autoOpenScrollPercentage || 50)) {
          setOpen(true);
          autoOpenedRef.current = true;
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [options.autoOpenMode, options.autoOpenDelaySeconds, options.autoOpenScrollPercentage]);

  useEffect(() => {
    if (!open) return;
    refreshChats().catch(() => {});
    if (options.chatHistoryMode === 'always-new') {
      resetConversation();
    }
  }, [open, refreshChats, resetConversation, options.chatHistoryMode]);

  // Load last two messages for chat history view
  useEffect(() => {
    if (view !== 'history' || !open) return;
    let cancelled = false;
    const run = async () => {
      const targets = chats.slice(0, 12); // cap previews
      const previews: Record<string, { role: 'USER' | 'ASSISTANT'; content: string }[]> = {};
      for (const chat of targets) {
        if (cancelled || chatPreviews[chat.id]) continue;
        try {
          // eslint-disable-next-line no-await-in-loop
          const history = await client.getChatHistory(chat.id);
          const lastTwo = history.messages.filter((m) => m.role === 'USER' || m.role === 'ASSISTANT').slice(-2);
          previews[chat.id] = lastTwo.map((m) => ({ role: m.role as 'USER' | 'ASSISTANT', content: m.content }));
        } catch {
          // ignore
        }
      }
      if (!cancelled && Object.keys(previews).length) {
        setChatPreviews((prev) => ({ ...prev, ...previews }));
      }
    };
    run();
    return () => { cancelled = true; };
  }, [view, open, chats, client, chatPreviews]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.liveAnswer, state.reasoning, state.ephemeralUser, state.showEphemeralAssistant, open]);

  const handleSend = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed.length) return;
    setQuery('');
    try {
      await sendMessage(trimmed, { k: options.defaultTopK || 8 });
    } catch {
      // error already captured in hook state
    }
  }, [query, options.defaultTopK, sendMessage]);

  const handleSelectChat = useCallback(
    (id: string) => {
      void selectChat(id);
      setView('chat');
    },
    [selectChat],
  );

  const handleNewChat = useCallback(() => {
    resetConversation();
    setView('chat');
    setQuery('');
    refreshChats().catch(() => {});
  }, [resetConversation, refreshChats]);

  const panelStyle = useMemo(() => {
    const style: PanelStyle = { ...positionStyles.panel };
    if (options.widthPercent) {
      const clamped = Math.max(30, Math.min(95, options.widthPercent));
      style.width = `${clamped}vw`;
      style.maxWidth = 'calc(100vw - 32px)';
    }
    if (options.heightPercent) {
      const clamped = Math.max(40, Math.min(95, options.heightPercent));
      style.height = `${clamped}vh`;
      style.maxHeight = 'calc(100vh - 48px)';
    }
    return style;
  }, [options.widthPercent, options.heightPercent, positionStyles.panel]);

  const panelTailClass = useMemo(() => getPanelTailClass(options.position), [options.position]);
  const panelWrapperClassName = `aetherbot-widget-panel-wrapper${open ? ' open' : ''}${panelTailClass ? ` ${panelTailClass}` : ''}`;

  const isGuestUser = options.externalUserId === 'guest-user';

  return (
    <div className={`aetherbot-widget-shell${open ? ' open' : ''}`}>
      <button
        type="button"
        className="aetherbot-widget-fab"
        style={{
          ...positionStyles.fab,
          ...(options.showAvatars !== false && options.avatarImage
            ? { background: 'transparent', boxShadow: 'none' }
            : {}),
        }}
        onClick={() => setOpen(true)}
        aria-label={`Open ${options.displayName} chat`}
      >
        {options.showAvatars !== false && options.avatarImage ? (
          <img
            src={options.avatarImage}
            alt={options.displayName || 'Avatar'}
            style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }}
          />
        ) : (
          <ChatBubbleIcon />
        )}
      </button>

      <div
        className={`aetherbot-widget-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        role="presentation"
      />

      <div
        className={panelWrapperClassName}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
      >
        <div className="aetherbot-widget-panel">
          <div className="aetherbot-panel-header">
            <div className="aetherbot-header-info">
          <div
            className="aetherbot-header-avatar"
            style={
              options.showAvatars !== false && options.avatarImage
                ? { background: 'transparent', boxShadow: 'none' }
                : undefined
            }
          >
            {options.showAvatars !== false && options.avatarImage ? (
                  <img src={options.avatarImage} alt={options.displayName || 'Avatar'} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
                ) : (
                  <ChatBubbleIcon />
                )}
            <span className="aetherbot-status-dot" />
          </div>
            <div className="aetherbot-header-text">
              <h2>{options.displayName || 'Chat Assistant'}</h2>
              {options.organizationName ? (
                <div style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)' }}>{options.organizationName}</div>
              ) : null}
              <span>
                {state.streaming ? (
                  <>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--aetherbot-primary)', animation: 'aetherbot-pulse 1.2s infinite', display: 'inline-block', marginRight: '6px' }} />
                    Thinking...
                  </>
                ) : (
                  <>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', marginRight: '6px' }} />
                    {options.displayMessage}
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="aetherbot-header-actions">
            {state.streaming && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '20px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(79, 70, 229, 0.3)', borderTop: '2px solid var(--aetherbot-primary)', borderRadius: '50%', animation: 'aetherbot-spin 0.9s linear infinite' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--aetherbot-primary)' }}>Thinking...</span>
              </div>
            )}
            <button
              type="button"
              className="aetherbot-header-button"
              onClick={() => refreshChats()}
            >
              <span className="aetherbot-header-icon"><RefreshIcon /></span>
              Refresh
            </button>
            {!isGuestUser && (
              <button
                type="button"
                className="aetherbot-header-button"
                onClick={() => setView((prev) => (prev === 'chat' ? 'history' : 'chat'))}
              >
                <span className="aetherbot-header-icon">{view === 'chat' ? <HistoryIcon /> : <BackIcon />}</span>
                {view === 'chat' ? 'Past Chats' : 'Back'}
              </button>
            )}
            <button type="button" className="aetherbot-header-button" onClick={handleNewChat}>
              <span className="aetherbot-header-icon"><RefreshIcon /></span>
              New Chat
            </button>
            <button type="button" className="aetherbot-header-button" onClick={() => setOpen(false)} aria-label="Close chat">
              <span className="aetherbot-header-icon"><CloseIcon /></span>
            </button>
          </div>
          </div>

          {error ? (
            <div className="aetherbot-error-banner">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}>Dismiss</button>
            </div>
          ) : null}

          <div className="aetherbot-panel-body">
            {view === 'history' ? (
              <ChatHistoryList
                chats={chats}
                loading={loadingChats}
                activeChatId={chatId}
                onSelect={handleSelectChat}
                onRefresh={() => refreshChats().catch(() => {})}
                previews={chatPreviews}
              />
            ) : (
              <ChatView
                messages={state.messages}
                ephemeralUser={state.ephemeralUser}
                showStreamingAssistant={state.showEphemeralAssistant}
                liveAnswer={state.liveAnswer}
                reasoning={state.reasoning}
                streaming={state.streaming}
                loading={loadingHistory}
                displayName={options.displayName || 'Assistant'}
                firstMessage={options.firstMessage}
                bottomAnchor={bottomRef}
                chatId={chatId}
                avatarId={options.avatarId}
                client={client}
                updateContactForm={updateContactForm}
              />
            )}
          </div>

          {view === 'chat' ? (
            <InputArea
              query={query}
              setQuery={setQuery}
              onSend={handleSend}
              sending={sending}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const createWidget = (rawOptions: WidgetOptions): WidgetController => {
  if (typeof document === 'undefined') {
    throw new Error('createWidget can only be used in a browser environment.');
  }

  ensureStyles();

  const options = normalizeOptions(rawOptions);

  // Prepare client early to support A/B calls prior to mounting
  const client: WidgetChatClient = options.__preview
    ? new PreviewChatClient(options.__preview, options.displayName)
    : new PublicAvatarChatClient({
        apiKey: options.apiKey,
        avatarId: options.avatarId,
        apiBaseUrl: options.apiBaseUrl,
        externalUserId: options.externalUserId,
        externalUserName: options.externalUserName,
        defaultTopK: options.defaultTopK,
        session: options.session,
      });

  // Controller is returned synchronously; methods become active once mounted
  const controller: WidgetController = {
    open: () => {},
    close: () => {},
    toggle: () => {},
    resetConversation: () => client.resetConversation(),
    destroy: () => {
      // no-op until mounted
    },
  };

  // Decide visibility via A/B testing. Preview always shows.
  const decideAndMount = async () => {
    const ab = rawOptions.abTesting;
    let shouldShow = true;

    if (!options.__preview && ab && typeof ab.testPercentage === 'number') {
      const pct = Math.max(0, Math.min(100, ab.testPercentage));
      if (pct <= 0) {
        shouldShow = false;
      } else if (pct >= 100) {
        shouldShow = true;
      } else if (ab.persistAssignment) {
        try {
          const resp = await (client as PublicAvatarChatClient).assignAb(pct, options.externalUserId);
          shouldShow = !!resp.show;
        } catch {
          // On failure, fall back to client-side decision to avoid blocking render
          const buf = new Uint32Array(1);
          const r = (typeof window !== 'undefined' && 'crypto' in window && window.crypto?.getRandomValues)
            ? (window.crypto.getRandomValues(buf), buf[0] / 0xffffffff)
            : Math.random();
          shouldShow = r < pct / 100;
        }
      } else {
        // Guest/random branch
        const buf = new Uint32Array(1);
        const r = (typeof window !== 'undefined' && 'crypto' in window && window.crypto?.getRandomValues)
          ? (window.crypto.getRandomValues(buf), buf[0] / 0xffffffff)
          : Math.random();
        shouldShow = r < pct / 100;
      }
    }

    if (!shouldShow) {
      return; // Do not mount; controller remains a no-op
    }

    const container = document.createElement('div');
    container.className = 'aetherbot-widget-root';
    applyThemeVariables(container, options.theme);
    document.body.appendChild(container);

    const root = createRoot(container);

    controller.destroy = () => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    const destroySelf = () => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    const positionStyles = getPositionStyles(options.position);

    root.render(
      <WidgetHost
        client={client}
        options={options}
        controller={controller}
        destroySelf={destroySelf}
        positionStyles={positionStyles}
      />
    );
  };

  // Fire and forget; decision + mount happens asynchronously
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  decideAndMount();

  return controller;
};
