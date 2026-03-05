"use client";

import { useEffect, useRef, useState } from "react";
import { GameMessage, ConversationTurn } from "@/lib/types";
import { GameConfig } from "@/app/page";
import MessageBubble from "./MessageBubble";

interface Props {
  config: GameConfig;
  messages: GameMessage[];
  history: ConversationTurn[];
  onMessagesUpdate: (messages: GameMessage[] | ((prev: GameMessage[]) => GameMessage[])) => void;
  onHistoryUpdate: (history: ConversationTurn[]) => void;
  onReset: () => void;
}

export default function GameScreen({
  config,
  messages,
  history,
  onMessagesUpdate,
  onHistoryUpdate,
  onReset,
}: Props) {
  const { playerCharacter } = config;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Start the game on mount
  useEffect(() => {
    if (!started) {
      setStarted(true);
      sendToEngine([], undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToEngine(currentHistory: ConversationTurn[], playerAction: string | undefined) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerCharacter,
          history: currentHistory,
          playerAction,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      onMessagesUpdate((prev: GameMessage[]) => [...prev, ...data.messages]);
      onHistoryUpdate(data.history);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const action = input.trim();
    if (!action || loading) return;

    // Add player message locally for instant feedback
    const playerMsg: GameMessage = { character: playerCharacter, text: action };
    onMessagesUpdate((prev: GameMessage[]) => [...prev, playerMsg]);
    setInput("");

    sendToEngine(history, action);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  const placeholders = {
    input: "What do you do? (Enter to send, Shift+Enter for new line)",
    newGame: "New Game",
    loading: "The world stirs...",
  };

  const characterColor: Record<string, string> = {
    Liora: "var(--color-liora)",
    Brom: "var(--color-brom)",
    Tharos: "var(--color-tharos)",
    Mira: "var(--color-mira)",
  };

  const playerColor = characterColor[playerCharacter] ?? "var(--gold)";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-deep)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "15px",
              letterSpacing: "2px",
              color: "var(--gold)",
            }}
          >
            Chronicles of the Forgotten Realm
          </h1>
          <p
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "2px",
              color: playerColor,
              marginTop: "3px",
            }}
          >
            Playing as {playerCharacter}
          </p>
        </div>

        <button
          onClick={onReset}
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            color: "var(--text-dim)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "var(--gold-dim)";
            (e.target as HTMLButtonElement).style.color = "var(--gold)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.target as HTMLButtonElement).style.color = "var(--text-dim)";
          }}
        >
          {placeholders.newGame}
        </button>
      </header>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            playerCharacter={playerCharacter}
            isPlayer={msg.character === playerCharacter}
          />
        ))}

        {/* Loading indicator */}
        {loading && (
          <div
            className="message-enter"
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 0" }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <span
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "11px",
                letterSpacing: "2px",
                color: "var(--text-dim)",
              }}
            >
              {placeholders.loading}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "4px",
              color: "var(--color-tharos)",
              fontFamily: "var(--font-cinzel)",
              fontSize: "12px",
              letterSpacing: "1px",
              marginTop: "8px",
            }}
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--bg-card)",
          padding: "16px 24px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "10px",
              letterSpacing: "2px",
              color: playerColor,
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            {playerCharacter}
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholders.input}
              rows={2}
              disabled={loading}
              style={{
                flex: 1,
                background: "var(--bg-input)",
                border: `1px solid ${input ? playerColor : "var(--border)"}`,
                borderRadius: "6px",
                padding: "12px 16px",
                fontFamily: "var(--font-crimson)",
                fontSize: "18px",
                lineHeight: "1.5",
                color: "var(--text-primary)",
                resize: "none",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "0 24px",
                background:
                  input.trim() && !loading ? "rgba(201,168,76,0.15)" : "transparent",
                border: `1px solid ${input.trim() && !loading ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "6px",
                color: input.trim() && !loading ? "var(--gold)" : "var(--text-dim)",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
