# 🤖 LocalFin AI — Multi-Model AI Assistant

A powerful Perplexity-like AI assistant that supports **multiple AI models** and **9 specialized task modes**. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🧠 Multi-Model Support
| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-4o, GPT-4o Mini, GPT-4 Turbo, o1-mini |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus |
| **Google** | Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash |
| **Local (Ollama)** | Llama 3.2, Mistral 7B, DeepSeek R1, Code Llama (**Free!**) |

### 🎯 9 Task Modes
- **💬 Chat** — General conversation and Q&A
- **🔍 Research** — Deep research with structured responses
- **💻 Code** — Write, debug, and explain code with syntax highlighting
- **✍️ Write** — Creative writing, essays, emails, marketing copy
- **📊 Analyze** — Critical analysis of text, data, business problems
- **📝 Summarize** — Condense long content into key points
- **🌐 Translate** — Translate between all major languages
- **🔢 Math** — Step-by-step math problem solving
- **💡 Brainstorm** — Generate creative ideas and solutions

### 🎨 UI Features
- Dark/light/system theme
- Real-time streaming responses
- Conversation history with search
- Code blocks with copy button and syntax highlighting
- Markdown rendering (tables, lists, headings, etc.)
- Thinking animation while AI responds
- Mobile-friendly responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Setting Up API Keys

### Option 1: In-App Settings (Recommended)
Click **Settings & API Keys** in the sidebar to enter your API keys. They're stored securely in your browser's localStorage.

### Option 2: Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local and add your keys
```

### Getting API Keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/account/keys
- **Google Gemini**: https://aistudio.google.com/app/apikey
- **Ollama (Free!)**: Download from https://ollama.ai — no API key needed!

## 🦙 Using Local Models (Free!)
1. Download and install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama3.2`
3. Select any Ollama model in the app — works completely offline!

Available models:
```bash
ollama pull llama3.2      # Meta's Llama 3.2
ollama pull mistral       # Mistral 7B
ollama pull deepseek-r1   # DeepSeek R1 reasoning model
ollama pull codellama     # Code Llama for programming
```

## 🏗️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (with localStorage persistence)
- **AI SDKs**: OpenAI SDK, Anthropic SDK, Google Generative AI
- **Markdown**: react-markdown + remark-gfm
- **Icons**: Lucide React

## 📁 Project Structure
```
src/
├── app/
│   ├── api/chat/route.ts    # AI API endpoint (all providers)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ChatArea.tsx         # Main chat interface
│   ├── ChatInput.tsx        # Message input with auto-resize
│   ├── MessageBubble.tsx    # Message display with markdown
│   ├── ModelSelector.tsx    # Model picker dropdown
│   ├── Sidebar.tsx          # Conversation history
│   ├── TaskBar.tsx          # Task mode switcher
│   ├── SettingsModal.tsx    # API keys & preferences
│   └── WelcomeScreen.tsx    # Landing/home screen
└── lib/
    ├── models.ts            # All AI model definitions
    ├── tasks.ts             # Task mode definitions & prompts
    ├── store.ts             # Global state (Zustand)
    ├── types.ts             # TypeScript types
    └── utils.ts             # Utility functions
```
