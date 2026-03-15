import { NextRequest, NextResponse } from "next/server";
import { getTaskModeById } from "@/lib/tasks";
import { getModelById } from "@/lib/models";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  model: string;
  taskMode: string;
  apiKeys?: {
    openai?: string;
    anthropic?: string;
    google?: string;
    ollamaBaseUrl?: string;
  };
}

function createSSEStream(
  controller: ReadableStreamDefaultController,
  content: string
) {
  controller.enqueue(
    new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
  );
}

async function handleOpenAI(
  messages: ChatMessage[],
  modelId: string,
  apiKey: string,
  controller: ReadableStreamDefaultController
) {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey });

  const stream = await openai.chat.completions.create({
    model: modelId,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      createSSEStream(controller, delta);
    }
  }
}

async function handleAnthropic(
  messages: ChatMessage[],
  modelId: string,
  apiKey: string,
  systemPrompt: string,
  controller: ReadableStreamDefaultController
) {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey });

  const formattedMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const stream = anthropic.messages.stream({
    model: modelId,
    max_tokens: 4096,
    system: systemPrompt,
    messages: formattedMessages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      createSSEStream(controller, event.delta.text);
    }
  }
}

async function handleGoogle(
  messages: ChatMessage[],
  modelId: string,
  apiKey: string,
  systemPrompt: string,
  controller: ReadableStreamDefaultController
) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });

  const result = await chat.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      createSSEStream(controller, text);
    }
  }
}

async function handleOllama(
  messages: ChatMessage[],
  modelId: string,
  baseUrl: string,
  controller: ReadableStreamDefaultController
) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelId,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split("\n").filter(Boolean);

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        const content = parsed.message?.content;
        if (content) {
          createSSEStream(controller, content);
        }
      } catch {}
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages, model: modelId, taskMode, apiKeys } = body;

    const modelDef = getModelById(modelId);
    if (!modelDef) {
      return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }

    const taskModeDef = getTaskModeById(taskMode);
    const systemPrompt = taskModeDef?.systemPrompt ?? "You are a helpful AI assistant.";

    const messagesWithSystem: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (modelDef.provider === "openai") {
            const apiKey = apiKeys?.openai ?? process.env.OPENAI_API_KEY;
            if (!apiKey) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: "Error: OpenAI API key not configured. Please add your API key in Settings." })}\n\n`
                )
              );
            } else {
              await handleOpenAI(messagesWithSystem, modelId, apiKey, controller);
            }
          } else if (modelDef.provider === "anthropic") {
            const apiKey = apiKeys?.anthropic ?? process.env.ANTHROPIC_API_KEY;
            if (!apiKey) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: "Error: Anthropic API key not configured. Please add your API key in Settings." })}\n\n`
                )
              );
            } else {
              await handleAnthropic(
                messages,
                modelId,
                apiKey,
                systemPrompt,
                controller
              );
            }
          } else if (modelDef.provider === "google") {
            const apiKey = apiKeys?.google ?? process.env.GOOGLE_API_KEY;
            if (!apiKey) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: "Error: Google API key not configured. Please add your API key in Settings." })}\n\n`
                )
              );
            } else {
              await handleGoogle(
                messages,
                modelId,
                apiKey,
                systemPrompt,
                controller
              );
            }
          } else if (modelDef.provider === "ollama") {
            const baseUrl =
              apiKeys?.ollamaBaseUrl ?? process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
            await handleOllama(messages, modelId, baseUrl, controller);
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ content: `Error: ${errorMessage}` })}\n\n`
            )
          );
        } finally {
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
