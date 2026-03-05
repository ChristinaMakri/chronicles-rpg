import { useState } from 'react'
import type { CharacterName, GameMessage, Turn } from './types'
import { SetupScreen } from './components/SetupScreen'
import { GameScreen } from './components/GameScreen'
import './App.css'

export default function App() {
  const [playerCharacter, setPlayerCharacter] = useState<CharacterName | null>(null)
  const [messages, setMessages] = useState<GameMessage[]>([])
  const [history, setHistory] = useState<Turn[]>([])

  async function handleSelectCharacter(character: CharacterName) {
    setPlayerCharacter(character)
    setMessages([])
    setHistory([])

    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerCharacter: character, history: [] }),
      })
      const data = await res.json()
      const newMessages: GameMessage[] = data.messages
      setMessages(newMessages)
      setHistory([{ role: 'assistant', content: JSON.stringify(newMessages) }])
    } catch {
      setMessages([{ character: 'System', text: 'Failed to connect to server.' }])
    }
  }

  if (!playerCharacter) {
    return <SetupScreen onSelect={handleSelectCharacter} />
  }

  return (
    <GameScreen
      playerCharacter={playerCharacter}
      messages={messages}
      onMessagesUpdate={setMessages}
      history={history}
      onHistoryUpdate={setHistory}
    />
  )
}
