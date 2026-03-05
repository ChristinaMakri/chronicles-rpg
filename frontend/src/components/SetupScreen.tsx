import type { CharacterName } from '../types'
import { CHARACTER_COLORS, CHARACTER_DESCRIPTIONS } from '../types'

const CHARACTERS: CharacterName[] = ['Liora', 'Brom', 'Tharos', 'Mira']

interface Props {
  onSelect: (character: CharacterName) => void
}

function Avatar({ name }: { name: string }) {
  const color = CHARACTER_COLORS[name] || '#888'
  return (
    <div className="char-avatar" style={{ background: `${color}22`, border: `2px solid ${color}` }}>
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
      <span className="char-initial" style={{ color, display: 'none' }}>
        {name[0]}
      </span>
    </div>
  )
}

export function SetupScreen({ onSelect }: Props) {
  return (
    <div className="setup-screen">
      <div className="setup-header">
        <h1>Chronicles of the Forgotten Realm</h1>
        <p>Choose your character. The others will fight alongside you — and sometimes against your plans.</p>
      </div>
      <div className="char-grid">
        {CHARACTERS.map((name) => (
          <button key={name} className="char-card" onClick={() => onSelect(name)}>
            <Avatar name={name} />
            <h2 style={{ color: CHARACTER_COLORS[name] }}>{name}</h2>
            <p>{CHARACTER_DESCRIPTIONS[name]}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
