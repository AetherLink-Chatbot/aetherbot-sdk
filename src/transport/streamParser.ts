import {
  AvatarQueryStreamEvent,
  PublicAvatarQueryResponse,
} from '../types';

const tryParseJson = (input: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(input) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const mapObjectToEvent = (obj: Record<string, unknown>): AvatarQueryStreamEvent | null => {
  if (typeof obj.status === 'string') {
    return { type: 'status', status: obj.status };
  }
  if (typeof obj.reasoning === 'string') {
    return { type: 'reasoning', reasoning: obj.reasoning };
  }
  if (typeof obj.final_answer === 'string') {
    return { type: 'token', token: obj.final_answer };
  }
  if ((obj as any).contact_form !== undefined) {
    const raw = (obj as any).contact_form;
    let message: string | null = null;
    let messageId: string | undefined;
    let chatId: string | undefined;
    if (typeof raw === 'string') {
      message = String(raw);
    } else if (raw && typeof raw === 'object') {
      message = (raw as any).prompt || (raw as any).message || (raw as any).text || null;
      if (typeof (raw as any).message_id === 'string') messageId = (raw as any).message_id as string;
      if (typeof (raw as any).messageId === 'string') messageId = (raw as any).messageId as string;
      if (typeof (raw as any).chat_id === 'string') chatId = (raw as any).chat_id as string;
      if (typeof (raw as any).chatId === 'string') chatId = (raw as any).chatId as string;
    }
    if (!message) message = (obj as any).message || null;
    if (!messageId && typeof (obj as any).message_id === 'string') messageId = (obj as any).message_id as string;
    if (!chatId && typeof (obj as any).chat_id === 'string') chatId = (obj as any).chat_id as string;
    if (typeof message === 'string') {
      return { type: 'contact_form', message, messageId, chatId };
    }
  }
  if (typeof obj.chat_id === 'string' && typeof obj.answer === 'string') {
    return {
      type: 'final',
      payload: obj as unknown as PublicAvatarQueryResponse,
    };
  }
  return null;
};

const emitFromBuffer = (
  buffer: string,
  emit: (event: AvatarQueryStreamEvent) => void,
): string => {
  let working = buffer;
  while (true) {
    const newlineIdx = working.indexOf('\n');
    if (newlineIdx === -1) break;
    const line = working.slice(0, newlineIdx).trim();
    working = working.slice(newlineIdx + 1);
    if (!line) continue;
    const obj = tryParseJson(line);
    if (!obj) continue;
    const evt = mapObjectToEvent(obj);
    if (evt) emit(evt);
  }
  return working;
};

const emitFromBraces = (
  buffer: string,
  emit: (event: AvatarQueryStreamEvent) => void,
): string => {
  let working = buffer;
  let cursor = 0;
  while (cursor < working.length) {
    const start = working.indexOf('{', cursor);
    if (start === -1) break;
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;
    for (let i = start; i < working.length; i++) {
      const ch = working[i];
      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === '\\') {
          escaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }
      if (ch === '"') {
        inString = true;
      } else if (ch === '{') {
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end === -1) break;
    const segment = working.slice(start, end);
    const obj = tryParseJson(segment);
    if (obj) {
      const evt = mapObjectToEvent(obj);
      if (evt) emit(evt);
    }
    working = working.slice(end);
    cursor = 0;
  }
  return working;
};

export async function* parseAvatarQueryStream(
  response: Response,
): AsyncGenerator<AvatarQueryStreamEvent, void, unknown> {
  const contentType = response.headers.get('content-type') || '';

  if (!response.body) {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${text || 'unknown error'}`);
    }
    const parsed = tryParseJson(text);
    if (!parsed) throw new Error('Failed to parse response body');
    const evt = mapObjectToEvent(parsed);
    if (evt) {
      yield evt;
    }
    return;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status}: ${text || 'unknown error'}`);
  }

  // Non-streaming JSON response
  if (!contentType.includes('ndjson') && !contentType.includes('jsonl') && !response.headers.get('transfer-encoding')) {
    const text = await response.text();
    const parsed = tryParseJson(text);
    if (!parsed) throw new Error('Failed to parse JSON response');
    const evt = mapObjectToEvent(parsed);
    if (evt) {
      yield evt;
    }
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const pending: AvatarQueryStreamEvent[] = [];
  const enqueue = (event: AvatarQueryStreamEvent) => {
    pending.push(event);
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = emitFromBuffer(buffer, enqueue);
    buffer = emitFromBraces(buffer, enqueue);
    while (pending.length) {
      const evt = pending.shift();
      if (evt) {
        yield evt;
      }
    }
  }

  if (buffer.trim()) {
    buffer = emitFromBuffer(buffer, enqueue);
    buffer = emitFromBraces(buffer, enqueue);
  }

  while (pending.length) {
    const evt = pending.shift();
    if (evt) {
      yield evt;
    }
  }
}
