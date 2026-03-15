"use client";

import { useState } from "react";
import {
  Plus,
  MessageCircle,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Search,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatTimestamp, cn } from "@/lib/utils";

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    isSidebarOpen,
    createConversation,
    deleteConversation,
    setActiveConversation,
    setSettingsOpen,
    setSidebarOpen,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    createConversation();
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg p-2 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Open sidebar"
        >
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      )}

      <aside
        className={cn(
          "flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "w-64 min-w-[16rem]" : "w-0 min-w-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              LocalFin AI
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border-0 rounded-md text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageCircle size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {searchQuery ? "No matching conversations" : "No conversations yet"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversation(conversation.id)}
                className={cn(
                  "w-full flex items-start gap-2 px-3 py-2.5 rounded-lg text-left group transition-colors",
                  activeConversationId === conversation.id
                    ? "bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <MessageCircle size={14} className="mt-0.5 shrink-0 opacity-60" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate leading-tight">
                    {conversation.title}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatTimestamp(conversation.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={12} />
                </button>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <Settings size={16} />
            Settings & API Keys
          </button>
        </div>
      </aside>
    </>
  );
}
