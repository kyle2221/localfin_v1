import type { TaskMode } from "./types";

export const TASK_MODES: TaskMode[] = [
  {
    id: "chat",
    name: "Chat",
    description: "General conversation and Q&A",
    icon: "MessageCircle",
    systemPrompt:
      "You are a helpful, friendly AI assistant. Provide clear, accurate, and engaging responses to the user's questions and requests.",
    placeholder: "Ask me anything...",
  },
  {
    id: "research",
    name: "Research",
    description: "Deep research with structured responses",
    icon: "Search",
    systemPrompt:
      "You are a research assistant. Provide comprehensive, well-structured responses with clear sections, supporting evidence, and balanced perspectives. Use headings, bullet points, and concise summaries to organize information effectively.",
    placeholder: "What would you like to research?",
  },
  {
    id: "code",
    name: "Code",
    description: "Write, debug, and explain code",
    icon: "Code2",
    systemPrompt:
      "You are an expert software engineer. Write clean, efficient, well-commented code. Always provide explanations for your solutions. When debugging, identify the root cause and explain the fix. Use markdown code blocks with appropriate language tags.",
    placeholder: "Describe what you want to build or debug...",
  },
  {
    id: "write",
    name: "Write",
    description: "Creative writing, essays, and copy",
    icon: "PenLine",
    systemPrompt:
      "You are a professional writer and editor. Help with creative writing, essays, emails, marketing copy, and any other writing tasks. Adapt your tone and style to match the user's needs. Focus on clarity, engagement, and impact.",
    placeholder: "What would you like to write?",
  },
  {
    id: "analyze",
    name: "Analyze",
    description: "Critical analysis of text and data",
    icon: "BarChart2",
    systemPrompt:
      "You are an analytical expert. Provide thorough, critical analysis of text, data, business problems, and complex situations. Break down components, identify patterns, evaluate pros and cons, and provide actionable insights.",
    placeholder: "What would you like analyzed?",
  },
  {
    id: "summarize",
    name: "Summarize",
    description: "Condense long content into key points",
    icon: "FileText",
    systemPrompt:
      "You are a summarization specialist. Condense long content into concise, accurate summaries. Extract the most important points, maintain the original meaning, and organize information logically. Provide both a brief summary and key bullet points.",
    placeholder: "Paste content to summarize...",
  },
  {
    id: "translate",
    name: "Translate",
    description: "Translate between all major languages",
    icon: "Globe",
    systemPrompt:
      "You are an expert translator fluent in all major languages. Provide accurate, natural-sounding translations that preserve the original tone and meaning. When appropriate, note cultural nuances or alternative translations.",
    placeholder: "Enter text to translate (specify target language)...",
  },
  {
    id: "math",
    name: "Math",
    description: "Step-by-step math problem solving",
    icon: "Calculator",
    systemPrompt:
      "You are a mathematics tutor. Solve math problems step-by-step, explaining each step clearly. Show all work, define variables, and verify answers when possible. Use LaTeX notation for complex equations when helpful.",
    placeholder: "Enter your math problem...",
  },
  {
    id: "brainstorm",
    name: "Brainstorm",
    description: "Generate creative ideas and solutions",
    icon: "Lightbulb",
    systemPrompt:
      "You are a creative brainstorming partner. Generate diverse, innovative ideas and solutions. Think outside the box, explore unexpected angles, and build on ideas. Present ideas in an organized way with brief explanations of each concept.",
    placeholder: "What do you want to brainstorm?",
  },
];

export const DEFAULT_TASK_MODE_ID = "chat";

export function getTaskModeById(id: string): TaskMode | undefined {
  return TASK_MODES.find((t) => t.id === id);
}
