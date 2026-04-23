import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function Spotlight({ targetRef, padding = 8, onClickOutside }) {
  const [targetRect, setTargetRect] = useState(null)

  useEffect(() => {
    if (!targetRef?.current) return

    const updateRect = () => {
      const rect = targetRef.current.getBoundingClientRect()
      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2)
      })
    }

    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [targetRef, padding])

  if (!targetRect) return null

  return createPortal(
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      onClick={onClickOutside}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Spotlight cutout */}
      <div
        className="absolute bg-transparent"
        style={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          borderRadius: '8px'
        }}
      />
    </div>,
    document.body
  )
}

export default Spotlight