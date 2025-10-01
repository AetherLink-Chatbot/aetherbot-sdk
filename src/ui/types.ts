export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  thinking?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export interface ThemeConfig {
  primary: string; // CSS color
  mode: "light" | "dark";
}

export interface AetherChatWidgetProps {
  avatarName?: string;
  avatarImageUrl?: string;
  bannerImageUrl?: string;
  companyName?: string;
  theme?: Partial<ThemeConfig>;
  versionTag?: string; // e.g., v1.01
}

