import { useEffect, useRef } from 'react'
import { Icon } from './Icon'

export function AboutDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => { element?.close() }
  }, [])
  return (
    <dialog ref={dialog} className="about-dialog" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }} aria-labelledby="about-title">
      <div className="flex items-center justify-between gap-8"><span className="eyebrow">A LITTLE CONTEXT</span><button autoFocus className="icon-button" onClick={onClose} aria-label="Close about this space"><Icon name="close" /></button></div>
      <span className="about-leaf"><Icon name="leaf" size={30} /></span>
      <h2 id="about-title">An office for ideas.</h2>
      <p>A personal portfolio, imagined as a quiet place to spend a rainy afternoon. A desk for building, a phone for small ideas, and a console for a little play.</p>
      <p>This is the first chapter: a small, interactive prototype built with React and Three.js. The projects—and all their stories—are still to come.</p>
      <button className="primary-button" onClick={onClose}>Make yourself at home <Icon name="arrow" size={17} /></button>
    </dialog>
  )
}
