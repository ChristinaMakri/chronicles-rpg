import type { GameMessage } from '../types'
import { CHARACTER_COLORS } from '../types'

interface Props {
  message: GameMessage
}

function Avatar({ name, isPlayer }: { name: string; isPlayer?: boolean }) {
  const color = CHARACTER_COLORS[name] || '#888'
  return (
    <div
      className="msg-avatar"
      style={{ background: `${color}22`, border: `2px solid ${color}`, opacity: isPlayer ? 0.8 : 1 }}
    >
      <img
        src={`/characters/${name.toLowerCase()}.png`}
        alt={name}
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = 'none'
          const next = target.nextElementSibling as HTMLElement
          if (next) next.style.display = 'flex'
        }}
      />
      <span className="msg-initial" style={{ color, display: 'none' }}>
        {name[0]}
      </span>
    </div>
  )
}

export function MessageBubble({ message }: Props) {
  const { character, text, isPlayer } = message
  const color = CHARACTER_COLORS[character] || '#ccc'

  if (character === 'System') {
    return <div className="msg-system">{text}</div>
  }

  return (
    <div className={`msg-row ${isPlayer ? 'msg-player' : ''}`}>
      {!isPlayer && <Avatar name={character} isPlayer={false} />}
      <div className="msg-bubble" style={{ borderColor: `${color}44` }}>
        <span className="msg-name" style={{ color }}>
          {character === 'DM' ? 'Dungeon Master' : character}
        </span>
        <p className="msg-text">{text}</p>
      </div>
      {isPlayer && <Avatar name={character} isPlayer={true} />}
    </div>
  )
}
