"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Sun, Moon, Monitor, Key, Server } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SettingsModal() {
  const { settings, updateApiKeys, updateSettings, setSettingsOpen } = useAppStore();

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [localKeys, setLocalKeys] = useState({
    openai: settings.apiKeys.openai ?? "",
    anthropic: settings.apiKeys.anthropic ?? "",
    google: settings.apiKeys.google ?? "",
    ollamaBaseUrl: settings.apiKeys.ollamaBaseUrl ?? "http://localhost:11434",
  });

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updateApiKeys({
      openai: localKeys.openai || undefined,
      anthropic: localKeys.anthropic || undefined,
      google: localKeys.google || undefined,
      ollamaBaseUrl: localKeys.ollamaBaseUrl || undefined,
    });
    setSettingsOpen(false);
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const apiKeyFields = [
    {
      key: "openai" as const,
      label: "OpenAI API Key",
      placeholder: "sk-...",
      link: "https://platform.openai.com/api-keys",
    },
    {
      key: "anthropic" as const,
      label: "Anthropic API Key",
      placeholder: "sk-ant-...",
      link: "https://console.anthropic.com/account/keys",
    },
    {
      key: "google" as const,
      label: "Google Gemini API Key",
      placeholder: "AIza...",
      link: "https://aistudio.google.com/app/apikey",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setSettingsOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Settings & API Keys
          </h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Appearance
            </h3>
            <div className="flex gap-2">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ theme: value })}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-medium transition-all",
                    settings.theme === value
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Streaming Responses
              </h3>
              <button
                onClick={() => updateSettings({ streamingEnabled: !settings.streamingEnabled })}
                className={cn(
                  "relative inline-flex w-10 h-5.5 rounded-full transition-colors",
                  settings.streamingEnabled ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-600"
                )}
                style={{ height: "22px" }}
              >
                <span
                  className={cn(
                    "inline-block w-4 h-4 bg-white rounded-full shadow transition-transform mt-[3px]",
                    settings.streamingEnabled ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Stream responses word by word as they&apos;re generated
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key size={15} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                API Keys
              </h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Keys are stored locally in your browser and never sent to any server except the respective AI provider.
            </p>

            <div className="space-y-4">
              {apiKeyFields.map(({ key, label, placeholder, link }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys[key] ? "text" : "password"}
                      value={localKeys[key]}
                      onChange={(e) =>
                        setLocalKeys((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="w-full pr-10 pl-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => toggleShowKey(key)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showKeys[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-500 hover:text-brand-600 mt-1 inline-block"
                  >
                    Get API key
                  </a>
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Server size={12} />
                    Ollama Base URL (Local Models)
                  </div>
                </label>
                <input
                  type="text"
                  value={localKeys.ollamaBaseUrl}
                  onChange={(e) =>
                    setLocalKeys((prev) => ({ ...prev, ollamaBaseUrl: e.target.value }))
                  }
                  placeholder="http://localhost:11434"
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <a
                  href="https://ollama.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-brand-500 hover:text-brand-600 mt-1 inline-block"
                >
                  Install Ollama (free local models)
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSettingsOpen(false)}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
