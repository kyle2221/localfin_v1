import type { AIModel } from "./types";

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Most capable OpenAI model",
    contextLength: 128000,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable",
    contextLength: 128000,
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    description: "Powerful with vision",
    contextLength: 128000,
  },
  {
    id: "o1-mini",
    name: "o1-mini",
    provider: "openai",
    description: "Reasoning model",
    contextLength: 128000,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    description: "Best balance of speed & intelligence",
    contextLength: 200000,
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    description: "Fast and efficient",
    contextLength: 200000,
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "anthropic",
    description: "Most powerful Anthropic model",
    contextLength: 200000,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "google",
    description: "Large context Google model",
    contextLength: 1000000,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "google",
    description: "Fast and versatile",
    contextLength: 1000000,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Latest Google model",
    contextLength: 1000000,
  },
  {
    id: "llama3.2",
    name: "Llama 3.2",
    provider: "ollama",
    description: "Meta's open model — Free & local",
    free: true,
  },
  {
    id: "mistral",
    name: "Mistral 7B",
    provider: "ollama",
    description: "Fast open-source model — Free & local",
    free: true,
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "ollama",
    description: "Reasoning model — Free & local",
    free: true,
  },
  {
    id: "codellama",
    name: "Code Llama",
    provider: "ollama",
    description: "Code-optimized model — Free & local",
    free: true,
  },
];

export const DEFAULT_MODEL_ID = "gpt-4o-mini";

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter((m) => m.provider === provider);
}
