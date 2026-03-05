export type CharacterName = 'Liora' | 'Brom' | 'Tharos' | 'Mira'

export interface GameMessage {
  character: string
  text: string
  isPlayer?: boolean
}

export interface Turn {
  role: 'user' | 'assistant'
  content: string
}

export interface GameApiRequest {
  playerCharacter: string
  history: Turn[]
  playerMessage?: string
}

export interface GameApiResponse {
  messages: GameMessage[]
}

export const CHARACTER_COLORS: Record<string, string> = {
  DM: '#8b6914',
  Liora: '#7cb8d4',
  Brom: '#a0896e',
  Tharos: '#c17a3a',
  Mira: '#9b7bb5',
}

export const CHARACTER_DESCRIPTIONS: Record<CharacterName, string> = {
  Liora: 'Fairy / Nature Spirit — The Heart. Warm, optimistic, sees beauty in danger.',
  Brom: 'Dwarf — The Sage. Gruff, pragmatic, speaks from hard experience.',
  Tharos: 'Centaur — The Warrior. Fierce, proud, direct. Respects strength.',
  Mira: 'Human / Rogue — The Shadow. Sharp, sardonic, haunted by a curse.',
}
