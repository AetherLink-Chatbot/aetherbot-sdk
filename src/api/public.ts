import type { PublicApiClientConfig, StreamCallbacks, StreamResult } from "../ui/types";

export class PublicApiClient {
  private cfg: PublicApiClientConfig;
  constructor(cfg: PublicApiClientConfig) {
    this.cfg = cfg;
  }

  private headers() {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.cfg.apiKey,
    } as Record<string, string>;
  }

  async listChats(): Promise<any> {
    const url = new URL(`/public/avatars-chat/chats`, this.cfg.apiBaseUrl);
    url.searchParams.set("external_user_id", this.cfg.externalUserId);
    const res = await fetch(url.toString(), { headers: this.headers() });
    if (!res.ok) throw new Error(`List chats failed: ${res.status}`);
    return res.json();
  }

  async getChat(chatId: string): Promise<any> {
    const url = new URL(`/public/avatars-chat/chats/${encodeURIComponent(chatId)}`, this.cfg.apiBaseUrl);
    const res = await fetch(url.toString(), { headers: this.headers() });
    if (!res.ok) throw new Error(`Get chat failed: ${res.status}`);
    return res.json();
  }

  async streamQuery(
    params: {
      query: string;
      chat_id?: string | null;
      session_id?: string | null;
      k?: number;
    },
    cb?: StreamCallbacks
  ): Promise<StreamResult> {
    const url = new URL(`/public/avatars-chat/${encodeURIComponent(this.cfg.avatarId)}/query`, this.cfg.apiBaseUrl);
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        query: params.query,
        external_user_id: this.cfg.externalUserId,
        external_user_name: this.cfg.externalUserName,
        chat_id: params.chat_id ?? null,
        session_id: params.session_id ?? null,
        k: params.k,
      }),
    });
    if (!res.ok || !res.body) {
      throw new Error(`Query failed: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let final: StreamResult | null = null;
    let contactPayload: { contact_form?: string; chat_id?: string; message_id?: string } | null = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) continue;
        try {
          const obj = JSON.parse(line);
          if (typeof obj.final_answer === "string") {
            cb?.onToken?.(obj.final_answer);
          } else if (typeof obj.status === "string") {
            cb?.onStatus?.(obj.status);
          } else if (typeof obj.contact_form === "string") {
            contactPayload = {
              contact_form: obj.contact_form,
              chat_id: obj.chat_id,
              message_id: obj.message_id,
            };
            // Keep tracking final object, but don't lose contact payload
            final = { ...(final ?? {}), ...obj };
          } else {
            final = obj;
          }
        } catch (_) {
          // ignore bad lines
        }
      }
    }

    // Flush any remaining buffered line
    const last = buffer.trim();
    if (last) {
      try {
        const obj = JSON.parse(last);
        if (typeof obj.final_answer === "string") {
          cb?.onToken?.(obj.final_answer);
        } else if (typeof obj.status === "string") {
          cb?.onStatus?.(obj.status);
        } else if (typeof obj.contact_form === "string") {
          contactPayload = {
            contact_form: obj.contact_form,
            chat_id: obj.chat_id,
            message_id: obj.message_id,
          };
          final = { ...(final ?? {}), ...obj };
        } else {
          final = obj;
        }
      } catch {}
    }

    // If we saw a contact_form payload at any point, preserve it in the final result
    if (contactPayload) {
      final = { ...(final ?? {}), ...contactPayload } as any;
      if (!final!.chat_id && contactPayload.chat_id) (final as any).chat_id = contactPayload.chat_id;
      if (!final!.message_id && contactPayload.message_id) (final as any).message_id = contactPayload.message_id;
    }

    return final ?? {};
  }

  async assignAb(params: { testPercentage: number; userId?: string | null }): Promise<{ show: boolean }> {
    const url = new URL(`/public/ab/${encodeURIComponent(this.cfg.avatarId)}/assign`, this.cfg.apiBaseUrl);
    const body: any = { testPercentage: params.testPercentage } as any;
    if (params.userId && params.userId !== "guest-user") body.userId = params.userId;
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`AB assign failed: ${res.status}`);
    return res.json();
  }

  async submitContact(body: {
    chat_id: string;
    message_id?: string | null;
    name: string;
    contact_method: 'email' | 'call' | string;
    contact_value?: string | null;
    concern_text: string;
  }): Promise<any> {
    const url = new URL(`/public/contacts`, this.cfg.apiBaseUrl);
    const payload: any = {
      ...body,
      avatar_id: this.cfg.avatarId,
    };
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let detail = '';
      try { detail = await res.text(); } catch {}
      throw new Error(`Submit contact failed: ${res.status} ${detail || ''}`.trim());
    }
    return res.json();
  }
}

export function createPublicApiClient(cfg: PublicApiClientConfig) {
  return new PublicApiClient(cfg);
}
