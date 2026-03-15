"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Zap, Brain, Sparkles, Server } from "lucide-react";
import { AI_MODELS, getModelsByProvider } from "@/lib/models";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { AIProvider } from "@/lib/types";

const PROVIDER_ICONS: Record<AIProvider, React.ElementType> = {
  openai: Sparkles,
  anthropic: Brain,
  google: Zap,
  ollama: Server,
};

const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  ollama: "Local (Ollama)",
};

const PROVIDERS: AIProvider[] = ["openai", "anthropic", "google", "ollama"];

export function ModelSelector() {
  const { currentModel, setCurrentModel } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = AI_MODELS.find((m) => m.id === currentModel);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProvider = selectedModel?.provider ?? "openai";
  const SelectedIcon = PROVIDER_ICONS[selectedProvider];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
      >
        <SelectedIcon size={14} className="text-brand-500" />
        <span className="font-medium">{selectedModel?.name ?? "Select Model"}</span>
        <ChevronDown
          size={14}
          className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="max-h-80 overflow-y-auto py-1">
            {PROVIDERS.map((provider) => {
              const models = getModelsByProvider(provider);
              const Icon = PROVIDER_ICONS[provider];
              return (
                <div key={provider}>
                  <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700/50 first:border-t-0">
                    <Icon size={12} />
                    {PROVIDER_LABELS[provider]}
                  </div>
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setCurrentModel(model.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                        currentModel === model.id && "bg-brand-50 dark:bg-brand-950/30"
                      )}
                    >
                      <div className="text-left">
                        <p
                          className={cn(
                            "font-medium",
                            currentModel === model.id
                              ? "text-brand-600 dark:text-brand-400"
                              : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {model.name}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {model.description}
                        </p>
                      </div>
                      {model.free && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded">
                          FREE
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
