import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOnboarding, ONBOARDING_STEPS } from '../../context/OnboardingContext'
import { useApp } from '../../context/AppContext'
import Spotlight from './Spotlight'
import GuidedTooltip from './GuidedTooltip'

const GUIDED_STEPS = [
  {
    id: ONBOARDING_STEPS.WELCOME,
    title: 'Welcome to ExpenseTracker!',
    content: 'Your personal finance companion in Rwanda. Let\'s explore the key features that will help you take control of your money.',
    targetSelector: '[data-onboarding="dashboard-welcome"]',
    position: 'bottom',
    showNext: true,
    nextLabel: 'Start Tour'
  },
  {
    id: ONBOARDING_STEPS.CREATE_CATEGORY,
    title: 'Create Categories',
    content: 'Categories help organize your transactions. Click "New Category" to create your first category like "Food" or "Transport".',
    targetSelector: '[data-onboarding="new-category-btn"]',
    position: 'bottom',
    showNext: false, // Wait for user to create category
    actionRequired: true
  },
  {
    id: ONBOARDING_STEPS.ADD_TRANSACTION,
    title: 'Add Transactions',
    content: 'Now let\'s add your first transaction. Click "Add Transaction" to record an expense or income.',
    targetSelector: '[data-onboarding="add-transaction-btn"]',
    position: 'bottom',
    showNext: false, // Wait for user to add transaction
    actionRequired: true
  },
  {
    id: ONBOARDING_STEPS.DASHBOARD_OVERVIEW,
    title: 'Dashboard Overview',
    content: 'This is your financial control center. Here you\'ll see your balances, spending patterns, and progress toward your goals.',
    targetSelector: '[data-onboarding="dashboard-overview"]',
    position: 'top',
    showNext: true,
    nextLabel: 'Complete Tutorial'
  }
]

function GuidedOnboarding() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentStep, isOnboardingActive, nextStep, skipOnboarding, completeOnboarding } = useOnboarding()
  const { categories, transactions } = useApp()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [targetElement, setTargetElement] = useState(null)
  const targetRef = useRef(null)

  // Find target element for current step
  const findTargetElement = useCallback((selector) => {
    if (!selector) return null

    // Try multiple ways to find the element
    let element = document.querySelector(selector)
    if (!element) {
      // Try finding by data attribute
      const attr = selector.match(/\[data-onboarding="([^"]+)"\]/)?.[1]
      if (attr) {
        element = document.querySelector(`[data-onboarding="${attr}"]`)
      }
    }
    return element
  }, [])

  // Update target element when step changes
  useEffect(() => {
    if (!isOnboardingActive || !currentStep) return

    const stepIndex = GUIDED_STEPS.findIndex(step => step.id === currentStep)
    if (stepIndex === -1) return

    setCurrentStepIndex(stepIndex)
    const step = GUIDED_STEPS[stepIndex]

    // Navigate to correct page if needed
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
      case ONBOARDING_STEPS.DASHBOARD_OVERVIEW:
        if (location.pathname !== '/dashboard') {
          navigate('/dashboard')
          // Wait for navigation to complete
          setTimeout(() => {
            const element = findTargetElement(step.targetSelector)
            if (element) {
              targetRef.current = element
              setTargetElement(element)
            }
          }, 100)
        } else {
          const element = findTargetElement(step.targetSelector)
          if (element) {
            targetRef.current = element
            setTargetElement(element)
          }
        }
        break
      case ONBOARDING_STEPS.CREATE_CATEGORY:
        if (location.pathname !== '/categories') {
          navigate('/categories')
          setTimeout(() => {
            const element = findTargetElement(step.targetSelector)
            if (element) {
              targetRef.current = element
              setTargetElement(element)
            }
          }, 100)
        } else {
          const element = findTargetElement(step.targetSelector)
          if (element) {
            targetRef.current = element
            setTargetElement(element)
          }
        }
        break
      case ONBOARDING_STEPS.ADD_TRANSACTION:
        if (location.pathname !== '/add') {
          navigate('/add')
          setTimeout(() => {
            const element = findTargetElement(step.targetSelector)
            if (element) {
              targetRef.current = element
              setTargetElement(element)
            }
          }, 100)
        } else {
          const element = findTargetElement(step.targetSelector)
          if (element) {
            targetRef.current = element
            setTargetElement(element)
          }
        }
        break
    }
  }, [currentStep, isOnboardingActive, location.pathname, navigate, findTargetElement])

  // Auto-advance for action-required steps
  useEffect(() => {
    if (!isOnboardingActive) return

    const step = GUIDED_STEPS[currentStepIndex]
    if (!step?.actionRequired) return

    if (currentStep === ONBOARDING_STEPS.CREATE_CATEGORY && categories.length > 0) {
      setTimeout(() => nextStep(), 1000) // Delay to let user see result
    } else if (currentStep === ONBOARDING_STEPS.ADD_TRANSACTION && transactions.length > 0) {
      setTimeout(() => nextStep(), 1000)
    }
  }, [currentStep, currentStepIndex, isOnboardingActive, categories.length, transactions.length, nextStep])

  // Handle next step
  const handleNext = () => {
    if (currentStepIndex === GUIDED_STEPS.length - 1) {
      completeOnboarding()
    } else {
      nextStep()
    }
  }

  // Handle skip
  const handleSkip = () => {
    skipOnboarding()
  }

  if (!isOnboardingActive || !currentStep || !targetElement) {
    return null
  }

  const step = GUIDED_STEPS[currentStepIndex]
  if (!step) return null

  return (
    <>
      <Spotlight
        targetRef={targetRef}
        onClickOutside={() => {}} // Disable outside clicks during tutorial
      />
      <GuidedTooltip
        targetRef={targetRef}
        title={step.title}
        content={step.content}
        position={step.position}
        step={currentStepIndex + 1}
        totalSteps={GUIDED_STEPS.length}
        onNext={handleNext}
        onSkip={handleSkip}
        showNext={step.showNext}
        nextLabel={step.nextLabel}
      />
    </>
  )
}

export default GuidedOnboarding