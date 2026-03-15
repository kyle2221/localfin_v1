"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { SettingsModal } from "@/components/SettingsModal";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { settings, isSettingsOpen } = useAppStore();

  useEffect(() => {
    const theme = settings.theme;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [settings.theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatArea />
      </main>
      {isSettingsOpen && <SettingsModal />}
    </div>
  );
}
