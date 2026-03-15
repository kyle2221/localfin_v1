import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Conversation, Message, AppSettings, APIKeys } from "./types";
import { generateId, generateConversationTitle } from "./utils";
import { DEFAULT_MODEL_ID } from "./models";
import { DEFAULT_TASK_MODE_ID } from "./tasks";

interface AppState {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentModel: string;
  currentTaskMode: string;
  settings: AppSettings;
  isSettingsOpen: boolean;
  isSidebarOpen: boolean;

  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, "id" | "timestamp">) => void;
  updateLastMessage: (conversationId: string, content: string) => void;
  setCurrentModel: (modelId: string) => void;
  setCurrentTaskMode: (taskModeId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateApiKeys: (keys: Partial<APIKeys>) => void;
  setSettingsOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  getActiveConversation: () => Conversation | null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      currentModel: DEFAULT_MODEL_ID,
      currentTaskMode: DEFAULT_TASK_MODE_ID,
      settings: {
        theme: "system",
        streamingEnabled: true,
        apiKeys: {},
      },
      isSettingsOpen: false,
      isSidebarOpen: true,

      createConversation: () => {
        const id = generateId();
        const { currentModel, currentTaskMode } = get();
        const newConversation: Conversation = {
          id,
          title: "New Conversation",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: currentModel,
          taskMode: currentTaskMode,
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const newActiveId =
            state.activeConversationId === id
              ? filtered.length > 0
                ? filtered[0].id
                : null
              : state.activeConversationId;
          return { conversations: filtered, activeConversationId: newActiveId };
        });
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      addMessage: (conversationId, messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: Date.now(),
        };
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages, message];
            const title =
              c.messages.length === 0 && messageData.role === "user"
                ? generateConversationTitle(messageData.content)
                : c.title;
            return { ...c, messages, title, updatedAt: Date.now() };
          }),
        }));
      },

      updateLastMessage: (conversationId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages];
            if (messages.length === 0) return c;
            const last = messages[messages.length - 1];
            messages[messages.length - 1] = { ...last, content };
            return { ...c, messages, updatedAt: Date.now() };
          }),
        }));
      },

      setCurrentModel: (modelId) => {
        set({ currentModel: modelId });
      },

      setCurrentTaskMode: (taskModeId) => {
        set({ currentTaskMode: taskModeId });
      },

      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      updateApiKeys: (keys) => {
        set((state) => ({
          settings: {
            ...state.settings,
            apiKeys: { ...state.settings.apiKeys, ...keys },
          },
        }));
      },

      setSettingsOpen: (open) => {
        set({ isSettingsOpen: open });
      },

      setSidebarOpen: (open) => {
        set({ isSidebarOpen: open });
      },

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId) ?? null;
      },
    }),
    {
      name: "localfin-storage",
      partialize: (state) => ({
        conversations: state.conversations,
        currentModel: state.currentModel,
        currentTaskMode: state.currentTaskMode,
        settings: state.settings,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
