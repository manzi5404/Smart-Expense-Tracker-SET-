import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1) to trigger animation
 * @param {string} options.rootMargin - Margin around the root element
 * @returns {Object} - { ref, isVisible } - ref to attach to element, isVisible state
 */
export function useScrollAnimation(options = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Unobserve after first trigger to prevent re-animations
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return { ref, isVisible }
}