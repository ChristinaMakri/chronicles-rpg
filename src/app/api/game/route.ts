import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/prompt";
import { GameApiRequest, GameApiResponse, GameMessage, ConversationTurn } from "@/lib/types";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = process.env.GROQ_MODEL ?? "meta-llama/llama-4-maverick-17b-128e-instruct";

const VALID_CHARACTERS = new Set([
  "DungeonMaster", "Liora", "Brom", "Tharos", "Mira", "SYSTEM",
]);

function sanitizeMessages(messages: GameMessage[]): GameMessage[] {
  return messages
    .filter((m) => VALID_CHARACTERS.has(m.character) && typeof m.text === "string")
    .map((m) => {
      let text = m.text.trim();
      const namePrefix = new RegExp(`^${m.character}[:\\s\\n]+`, "i");
      text = text.replace(namePrefix, "").trim();
      return { ...m, text };
    });
}

function parseGameMessages(raw: string): GameMessage[] {
  const cleaned = raw
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return sanitizeMessages(parsed as GameMessage[]);
    throw new Error("Not an array");
  } catch {
    return [
      { character: "DungeonMaster", text: raw },
      { character: "SYSTEM", text: "What do you do?" },
    ];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GameApiRequest = await req.json();
    const { playerCharacter, history, playerAction } = body;

    if (!playerCharacter) {
      return NextResponse.json({ error: "Missing playerCharacter" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(playerCharacter);
    const messages: ConversationTurn[] = [...history];

    if (history.length === 0) {
      messages.push({
        role: "user",
        content: "Begin the adventure. Open with a vivid scene description and set the first moment of the story.",
      });
    } else if (playerAction) {
      messages.push({
        role: "user",
        content: `Player action (${playerCharacter}): ${playerAction}`,
      });
    }

    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.85,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const rawText = response.choices[0]?.message?.content ?? "[]";
    const gameMessages = parseGameMessages(rawText);

    const updatedHistory: ConversationTurn[] = [
      ...messages,
      { role: "assistant", content: JSON.stringify(gameMessages) },
    ];

    const result: GameApiResponse = { messages: gameMessages, history: updatedHistory };
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Game API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate game response. Please try again." },
      { status: 500 }
    );
  }
}
