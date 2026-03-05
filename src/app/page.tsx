"use client";

import { useState } from "react";
import SetupScreen from "@/components/SetupScreen";
import GameScreen from "@/components/GameScreen";
import { CharacterName, GameMessage, ConversationTurn } from "@/lib/types";

export interface GameConfig {
  playerCharacter: CharacterName;
}

export default function Home() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [history, setHistory] = useState<ConversationTurn[]>([]);

  function handleStart(cfg: GameConfig) {
    setConfig(cfg);
    setMessages([]);
    setHistory([]);
  }

  function handleReset() {
    setConfig(null);
    setMessages([]);
    setHistory([]);
  }

  if (!config) return <SetupScreen onStart={handleStart} />;

  return (
    <GameScreen
      config={config}
      messages={messages}
      history={history}
      onMessagesUpdate={setMessages}
      onHistoryUpdate={setHistory}
      onReset={handleReset}
    />
  );
}
