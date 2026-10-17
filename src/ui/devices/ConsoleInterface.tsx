import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'

const games = [
  { name: 'Pirate Battle', genre: 'A future seafaring adventure', symbol: '⚑', color: 'sea' },
  { name: 'Untitled adventure', genre: 'Room for the next world', symbol: '◇', color: 'forest' },
  { name: 'Little experiment', genre: 'Something playful, someday', symbol: '✳', color: 'sunset' },
]

// Future React/PixiJS games mount inside this bounded viewport. No game engine,
// iframe, or actual game is loaded during the launcher prototype.
export function ConsoleInterface() {
  const [selected, setSelected] = useState<number | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const previous = useRef<number | null>(null)
  useEffect(() => {
    if (selected !== null) heading.current?.focus({ preventScroll: true })
    else if (previous.current !== null) buttons.current[previous.current]?.focus({ preventScroll: true })
    previous.current = selected
  }, [selected])
  const game = selected === null ? null : games[selected]
  return (
    <div className="console-interface">
      <header className="console-header"><span><Icon name="gamepad" size={21} /> AFTER HOURS</span><span className="console-status"><span className="status-dot" /> PLAYER ONE</span></header>
      {game ? (
        <div className="game-viewport" aria-label="Future playable game viewport">
          <button className="text-button" onClick={() => setSelected(null)}><Icon name="back" size={16} /> Game library</button>
          <div className={`launch-symbol game-${game.color}`} aria-hidden="true">{game.symbol}</div>
          <h2 ref={heading} tabIndex={-1}>{game.name}</h2><p>This adventure is still on the horizon.</p><span className="game-placeholder">PLACEHOLDER LAUNCH SCREEN · GAME NOT INTEGRATED</span>
        </div>
      ) : (
        <div className="game-library"><div className="library-heading"><span className="eyebrow">A LITTLE ROOM FOR PLAY</span><h2>Choose your next adventure.</h2></div>
          <div className="game-grid">{games.map((item, index) => <button key={item.name} ref={(node) => { buttons.current[index] = node }} className="game-entry" onClick={() => setSelected(index)} aria-label={`Select ${item.name}`}><span className={`game-cover game-${item.color}`} aria-hidden="true"><span>{item.symbol}</span><i /><i /></span><strong>{item.name}</strong><small>{item.genre}</small><span className="game-entry-status">COMING LATER <Icon name="arrow" size={14} /></span></button>)}</div>
        </div>
      )}
    </div>
  )
}
