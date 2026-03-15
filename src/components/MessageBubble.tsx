"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
}

function CodeBlock({
  language,
  children,
}: {
  language?: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 bg-slate-900 text-slate-100">
        <code className="text-sm font-mono leading-relaxed">{children}</code>
      </pre>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-brand-500 text-white rounded-br-sm"
            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isBlock = className?.includes("language-");
                  if (isBlock) {
                    return (
                      <CodeBlock language={match?.[1]}>
                        {String(children).replace(/\n$/, "")}
                      </CodeBlock>
                    );
                  }
                  return (
                    <code
                      className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          <User size={16} className="text-slate-500 dark:text-slate-400" />
        </div>
      )}
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-4 animate-fade-in">
      <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-thinking" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-thinking" style={{ animationDelay: "200ms" }} />
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-thinking" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}
