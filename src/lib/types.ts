export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  model?: string;
  taskMode?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
  taskMode: string;
}

export type AIProvider = "openai" | "anthropic" | "google" | "ollama";

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  contextLength?: number;
  free?: boolean;
}

export type TaskModeId =
  | "chat"
  | "research"
  | "code"
  | "write"
  | "analyze"
  | "summarize"
  | "translate"
  | "math"
  | "brainstorm";

export interface TaskMode {
  id: TaskModeId;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  placeholder: string;
}

export interface APIKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  ollamaBaseUrl?: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  streamingEnabled: boolean;
  apiKeys: APIKeys;
}
