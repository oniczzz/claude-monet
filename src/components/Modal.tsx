import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/** Native modal dialog provides focus containment, inert background and Escape. */
export function Modal({ open, onClose, titleId, children, className = '' }: { open: boolean; onClose: () => void; titleId: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [open])
  if (!open) return null
  return createPortal(<dialog ref={ref} className={`modal ${className}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); closeRef.current() }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeRef.current() } }}>
    <button className="icon-button modal-close" aria-label="Закрыть окно" onClick={onClose}><X size={23} strokeWidth={1.4}/></button>
    {children}
  </dialog>, document.body)
}
