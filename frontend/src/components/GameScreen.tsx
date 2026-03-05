import { useState, useEffect, useRef } from 'react'
import type { GameMessage, Turn, CharacterName } from '../types'
import { CHARACTER_COLORS } from '../types'
import { MessageBubble } from './MessageBubble'

interface Props {
  playerCharacter: CharacterName
  messages: GameMessage[]
  onMessagesUpdate: (updater: (prev: GameMessage[]) => GameMessage[]) => void
  history: Turn[]
  onHistoryUpdate: (updater: (prev: Turn[]) => Turn[]) => void
}

export function GameScreen({ playerCharacter, messages, onMessagesUpdate, history, onHistoryUpdate }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const playerColor = CHARACTER_COLORS[playerCharacter] || '#fff'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const playerMsg: GameMessage = { character: playerCharacter, text, isPlayer: true }
    onMessagesUpdate((prev) => [...prev, playerMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerCharacter,
          history,
          playerMessage: text,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail || 'Server error')
      }

      const data = await res.json()
      const newMessages: GameMessage[] = data.messages

      // Update conversation history
      const assistantContent = JSON.stringify(newMessages)
      onHistoryUpdate((prev) => [
        ...prev,
        { role: 'user', content: `${playerCharacter}: ${text}` },
        { role: 'assistant', content: assistantContent },
      ])

      onMessagesUpdate((prev) => [...prev, ...newMessages])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      onMessagesUpdate((prev) => [
        ...prev,
        { character: 'System', text: `Error: ${message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <span className="game-playing">Playing as</span>
        <span className="game-char" style={{ color: playerColor }}>
          {playerCharacter}
        </span>
      </div>

      <div className="message-list">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="What do you do?"
          rows={2}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Act
        </button>
      </div>
    </div>
  )
}
