import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const ONBOARDING_KEY = 'onboarding_completed'

const OnboardingContext = createContext()

export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  CREATE_CATEGORY: 'create_category',
  ADD_TRANSACTION: 'add_transaction',
  DASHBOARD_OVERVIEW: 'dashboard_overview',
  COMPLETED: 'completed'
}

export function OnboardingProvider({ children }) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(null)
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  })

  // Check if user should see onboarding
  const shouldShowOnboarding = useCallback((hasCategories, hasTransactions) => {
    if (onboardingCompleted) return false
    return !hasCategories && !hasTransactions
  }, [onboardingCompleted])

  // Start onboarding
  const startOnboarding = useCallback(() => {
    setCurrentStep(ONBOARDING_STEPS.WELCOME)
    setIsOnboardingActive(true)
  }, [])

  // Start guided onboarding
  const startGuidedOnboarding = useCallback(() => {
    setCurrentStep(ONBOARDING_STEPS.WELCOME)
    setIsOnboardingActive(true)
  }, [])

  // Next step
  const nextStep = useCallback(() => {
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        setCurrentStep(ONBOARDING_STEPS.CREATE_CATEGORY)
        break
      case ONBOARDING_STEPS.CREATE_CATEGORY:
        setCurrentStep(ONBOARDING_STEPS.ADD_TRANSACTION)
        break
      case ONBOARDING_STEPS.ADD_TRANSACTION:
        setCurrentStep(ONBOARDING_STEPS.DASHBOARD_OVERVIEW)
        break
      case ONBOARDING_STEPS.DASHBOARD_OVERVIEW:
        completeOnboarding()
        break
      default:
        break
    }
  }, [currentStep])

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    setCurrentStep(ONBOARDING_STEPS.COMPLETED)
    setIsOnboardingActive(false)
    setOnboardingCompleted(true)
    localStorage.setItem(ONBOARDING_KEY, 'true')
  }, [])

  // Skip onboarding
  const skipOnboarding = useCallback(() => {
    setIsOnboardingActive(false)
    setOnboardingCompleted(true)
    localStorage.setItem(ONBOARDING_KEY, 'true')
  }, [])

  // Reset onboarding (for testing)
  const resetOnboarding = useCallback(() => {
    setCurrentStep(null)
    setIsOnboardingActive(false)
    setOnboardingCompleted(false)
    localStorage.removeItem(ONBOARDING_KEY)
  }, [])

  // Go to specific step
  const goToStep = useCallback((step) => {
    setCurrentStep(step)
    setIsOnboardingActive(true)
  }, [])

  // Check if user should see onboarding
  const shouldShowGuidedOnboarding = useCallback((hasCategories, hasTransactions) => {
    if (onboardingCompleted) return false
    // Show guided onboarding if user has no data or just started
    return !hasCategories && !hasTransactions
  }, [onboardingCompleted])

  const value = {
    currentStep,
    isOnboardingActive,
    onboardingCompleted,
    shouldShowOnboarding,
    shouldShowGuidedOnboarding,
    startOnboarding,
    startGuidedOnboarding,
    nextStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    goToStep
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}