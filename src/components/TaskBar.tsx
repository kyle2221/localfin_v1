"use client";

import { MessageCircle, Search, Code as Code2, PenLine, BarChart2, FileText, Globe, Calculator, Lightbulb } from "lucide-react";
import { TASK_MODES } from "@/lib/tasks";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { TaskModeId } from "@/lib/types";

const ICONS: Record<string, React.ElementType> = {
  MessageCircle,
  Search,
  Code2,
  PenLine,
  BarChart2,
  FileText,
  Globe,
  Calculator,
  Lightbulb,
};

export function TaskBar() {
  const { currentTaskMode, setCurrentTaskMode } = useAppStore();

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-1">
      {TASK_MODES.map((mode) => {
        const Icon = ICONS[mode.icon] ?? MessageCircle;
        const isActive = currentTaskMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setCurrentTaskMode(mode.id as TaskModeId)}
            title={mode.description}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              isActive
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            )}
          >
            <Icon size={13} />
            {mode.name}
          </button>
        );
      })}
    </div>
  );
}
