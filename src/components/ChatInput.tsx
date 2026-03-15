"use client";

import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Send, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  placeholder?: string;
}

export function ChatInput({ onSend, isLoading, onStop, placeholder }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div
        className={cn(
          "flex items-end gap-2 bg-white dark:bg-slate-800 border rounded-2xl px-4 py-3 shadow-sm transition-all",
          isLoading
            ? "border-brand-300 dark:border-brand-700"
            : "border-slate-200 dark:border-slate-700 focus-within:border-brand-400 dark:focus-within:border-brand-600"
        )}
      >
        <TextareaAutosize
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Ask me anything... (Enter to send, Shift+Enter for new line)"}
          minRows={1}
          maxRows={8}
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none leading-relaxed"
        />
        <button
          onClick={isLoading ? onStop : handleSubmit}
          disabled={!isLoading && !value.trim()}
          className={cn(
            "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
            isLoading
              ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              : value.trim()
              ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer"
              : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
          )}
          aria-label={isLoading ? "Stop generation" : "Send message"}
        >
          {isLoading ? <Square size={14} fill="white" /> : <Send size={14} />}
        </button>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
