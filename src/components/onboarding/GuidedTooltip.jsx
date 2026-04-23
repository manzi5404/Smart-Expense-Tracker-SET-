import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from '../common/Button'
import { ArrowRight, X } from 'lucide-react'

function GuidedTooltip({
  targetRef,
  title,
  content,
  position = 'bottom',
  step,
  totalSteps,
  onNext,
  onSkip,
  showNext = true,
  nextLabel = 'Next',
  highlightClass = 'ring-4 ring-primary-500 ring-opacity-50'
}) {
  const [tooltipRect, setTooltipRect] = useState(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (!targetRef?.current || !tooltipRef.current) return

    const updatePosition = () => {
      const targetRect = targetRef.current.getBoundingClientRect()
      const tooltipEl = tooltipRef.current
      const tooltipRect = tooltipEl.getBoundingClientRect()

      let top, left

      switch (position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 10
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
          break
        case 'bottom':
          top = targetRect.bottom + 10
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
          break
        case 'left':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
          left = targetRect.left - tooltipRect.width - 10
          break
        case 'right':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
          left = targetRect.right + 10
          break
        default:
          top = targetRect.bottom + 10
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      }

      // Keep tooltip in viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 10) left = 10
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10
      }
      if (top < 10) top = 10
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10
      }

      setTooltipRect({ top, left })
    }

    // Initial position calculation
    setTimeout(updatePosition, 100)

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [targetRef, position])

  // Add highlight class to target element
  useEffect(() => {
    if (!targetRef?.current) return

    const element = targetRef.current
    element.classList.add(highlightClass)

    return () => {
      element.classList.remove(highlightClass)
    }
  }, [targetRef, highlightClass])

  if (!tooltipRect) return null

  return createPortal(
    <div
      ref={tooltipRef}
      className="fixed z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4"
      style={{
        top: tooltipRect.top,
        left: tooltipRect.left,
        pointerEvents: 'auto'
      }}
    >
      {/* Step indicator */}
      {step && totalSteps && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Step {step} of {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Content */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {content}
      </p>

      {/* Progress dots */}
      {step && totalSteps && (
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < step ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      {showNext && (
        <div className="flex justify-between items-center">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip tutorial
          </button>
          <Button onClick={onNext} size="sm">
            {nextLabel}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>,
    document.body
  )
}

export default GuidedTooltip