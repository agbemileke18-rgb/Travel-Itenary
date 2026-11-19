import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import '../styles/Modal.css'

const focusableElementsSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ children, isOpen, onClose, title }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusableElements = dialogRef.current?.querySelectorAll(focusableElementsSelector)
    if (focusableElements?.length) {
      focusableElements[0].focus()
    } else {
      dialogRef.current?.focus()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const elements = dialogRef.current?.querySelectorAll(focusableElementsSelector)
      if (!elements?.length) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="modal"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <button
            aria-label="Close dialog"
            className="modal__close"
            onClick={onClose}
            type="button"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </section>
    </div>
  )
}
