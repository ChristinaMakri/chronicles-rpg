export const CHARACTER_IMAGES: Record<string, string> = {
  DungeonMaster: "/characters/dungeon-master.png",
  Liora: "/characters/liora.png",
  Brom: "/characters/brom.png",
  Tharos: "/characters/tharos.png",
  Mira: "/characters/mira.png",
};

export type CharacterName = "Liora" | "Brom" | "Tharos" | "Mira";

export type MessageCharacter =
  | "DungeonMaster"
  | "Liora"
  | "Brom"
  | "Tharos"
  | "Mira"
  | "SYSTEM";

export interface GameMessage {
  character: MessageCharacter;
  text: string;
}

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface GameApiRequest {
  playerCharacter: CharacterName;
  history: ConversationTurn[];
  playerAction?: string;
}

export interface GameApiResponse {
  messages: GameMessage[];
  history: ConversationTurn[];
}
