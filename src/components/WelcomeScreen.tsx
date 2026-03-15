"use client";

import { MessageCircle, Search, Code as Code2, PenLine, BarChart2, FileText, Globe, Calculator, Lightbulb, Bot, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TASK_MODES } from "@/lib/tasks";
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

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  chat: [
    "What are the key principles of machine learning?",
    "Explain quantum computing in simple terms",
    "What is the best way to learn a new programming language?",
  ],
  research: [
    "Research the latest developments in renewable energy",
    "Compare different approaches to urban planning",
    "What does the research say about intermittent fasting?",
  ],
  code: [
    "Write a React component for a data table with sorting",
    "Debug this Python function that's causing an infinite loop",
    "Explain how async/await works in JavaScript",
  ],
  write: [
    "Write a professional email declining a meeting",
    "Draft an engaging product description for a coffee maker",
    "Help me write a compelling cover letter",
  ],
  analyze: [
    "Analyze the pros and cons of remote work",
    "What are the risks and opportunities in this business plan?",
    "Break down the main themes in this passage",
  ],
  summarize: [
    "Summarize this research paper into key points",
    "Give me a TL;DR of this long article",
    "What are the main takeaways from this document?",
  ],
  translate: [
    "Translate 'Hello, how are you?' to Spanish, French, and German",
    "Translate this contract clause to English",
    "What does this Japanese phrase mean?",
  ],
  math: [
    "Solve: 3x² + 5x - 2 = 0",
    "Calculate the compound interest on $10,000 at 5% for 10 years",
    "Prove that the sum of angles in a triangle is 180°",
  ],
  brainstorm: [
    "Brainstorm 10 unique app ideas for remote teams",
    "What are creative ways to reduce plastic waste?",
    "Generate marketing slogans for an eco-friendly brand",
  ],
};

export function WelcomeScreen() {
  const { currentTaskMode, setCurrentTaskMode, createConversation, activeConversationId, addMessage } =
    useAppStore();

  const currentMode = TASK_MODES.find((m) => m.id === currentTaskMode)!;
  const examples = EXAMPLE_PROMPTS[currentTaskMode] ?? EXAMPLE_PROMPTS.chat;

  const handleExampleClick = (prompt: string) => {
    let conversationId = activeConversationId;
    if (!conversationId) {
      conversationId = createConversation();
    }
    addMessage(conversationId, {
      role: "user",
      content: prompt,
      model: undefined,
      taskMode: currentTaskMode,
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mb-6 shadow-lg">
        <Bot size={28} className="text-white" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 text-center">
        LocalFin AI Assistant
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8 max-w-md">
        Powered by multiple AI models. Switch between GPT-4, Claude, Gemini, and free local models.
      </p>

      <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
        <Zap size={14} className="text-brand-500" />
        <span className="text-xs text-slate-500 dark:text-slate-400">Current mode:</span>
        <div className="flex gap-1.5 flex-wrap justify-center">
          {TASK_MODES.slice(0, 5).map((mode) => {
            const Icon = ICONS[mode.icon] ?? MessageCircle;
            const isActive = currentTaskMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setCurrentTaskMode(mode.id as TaskModeId)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={11} />
                {mode.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3 text-center">
          Try these examples
        </p>
        <div className="grid gap-2">
          {examples.map((prompt, i) => {
            const Icon = ICONS[currentMode.icon] ?? MessageCircle;
            return (
              <button
                key={i}
                onClick={() => handleExampleClick(prompt)}
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/20 hover:text-brand-700 dark:hover:text-brand-300 transition-all text-left group"
              >
                <Icon
                  size={15}
                  className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors"
                />
                {prompt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
