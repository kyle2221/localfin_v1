"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageBubble, ThinkingIndicator } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TaskBar } from "./TaskBar";
import { ModelSelector } from "./ModelSelector";
import { getTaskModeById } from "@/lib/tasks";
import { Menu } from "lucide-react";

export function ChatArea() {
  const {
    activeConversationId,
    conversations,
    currentModel,
    currentTaskMode,
    settings,
    createConversation,
    addMessage,
    updateLastMessage,
    setSidebarOpen,
    isSidebarOpen,
  } = useAppStore();

  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isStreamingRef = useRef(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConversation?.messages ?? [];
  const lastMessage = messages[messages.length - 1];
  const isLoading =
    isStreamingRef.current ||
    (lastMessage?.role === "user" && messages.length > 0 && !activeConversation?.messages.some((m, i) => m.role === "assistant" && i === messages.length - 1));

  const taskMode = getTaskModeById(currentTaskMode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isLoadingRef.current) return;

      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = createConversation();
      }

      addMessage(conversationId, {
        role: "user",
        content,
        taskMode: currentTaskMode,
      });

      isLoadingRef.current = true;
      isStreamingRef.current = true;

      const conversationMessages = [
        ...(conversations.find((c) => c.id === conversationId)?.messages ?? []),
        { role: "user" as const, content, id: "", timestamp: 0 },
      ];

      const apiMessages = conversationMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      addMessage(conversationId, {
        role: "assistant",
        content: "",
        model: currentModel,
        taskMode: currentTaskMode,
      });

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            model: currentModel,
            taskMode: currentTaskMode,
            apiKeys: settings.apiKeys,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          updateLastMessage(conversationId!, errorData.error || `Error: ${response.statusText}`);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulated += parsed.content;
                  updateLastMessage(conversationId!, accumulated);
                }
              } catch {}
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          updateLastMessage(conversationId!, "Sorry, an error occurred. Please try again.");
        }
      } finally {
        isLoadingRef.current = false;
        isStreamingRef.current = false;
      }
    },
    [
      activeConversationId,
      conversations,
      currentModel,
      currentTaskMode,
      settings.apiKeys,
      createConversation,
      addMessage,
      updateLastMessage,
    ]
  );

  const handleStop = () => {
    abortControllerRef.current?.abort();
    isLoadingRef.current = false;
    isStreamingRef.current = false;
  };

  const showWelcome = !activeConversationId || messages.length === 0;

  const lastIsUser = lastMessage?.role === "user";
  const showThinking = lastIsUser && isLoadingRef.current;

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
          )}
          <TaskBar />
        </div>
        <ModelSelector />
      </header>

      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeScreen />
        ) : (
          <div className="pb-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {showThinking && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoadingRef.current}
          onStop={handleStop}
          placeholder={taskMode?.placeholder}
        />
      </div>
    </div>
  );
}
