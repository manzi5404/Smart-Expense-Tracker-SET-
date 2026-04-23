import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOnboarding, ONBOARDING_STEPS } from '../../context/OnboardingContext'
import { useApp } from '../../context/AppContext'
import Modal from './common/Modal'
import Button from './common/Button'
import { ArrowRight, X, Sparkles, Plus, Receipt, BarChart3 } from 'lucide-react'

function OnboardingTour() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentStep, isOnboardingActive, nextStep, skipOnboarding } = useOnboarding()
  const { categories, transactions } = useApp()

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOnboardingActive && currentStep) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOnboardingActive, currentStep])

  // Handle step-specific navigation
  useEffect(() => {
    if (!isOnboardingActive) return

    switch (currentStep) {
      case ONBOARDING_STEPS.CREATE_CATEGORY:
        if (location.pathname !== '/categories') {
          navigate('/categories')
        }
        break
      case ONBOARDING_STEPS.ADD_TRANSACTION:
        if (location.pathname !== '/add') {
          navigate('/add')
        }
        break
      case ONBOARDING_STEPS.DASHBOARD_OVERVIEW:
        if (location.pathname !== '/dashboard') {
          navigate('/dashboard')
        }
        break
      default:
        break
    }
  }, [currentStep, isOnboardingActive, location.pathname, navigate])

  if (!isVisible) return null

  const steps = {
    [ONBOARDING_STEPS.WELCOME]: {
      title: 'Welcome to ExpenseTracker! 🎉',
      content: 'Your personal finance companion in Rwanda. Let\'s get you started with tracking your expenses and income.',
      icon: <Sparkles className="w-8 h-8 text-primary-500" />,
      action: 'Get Started'
    },
    [ONBOARDING_STEPS.CREATE_CATEGORY]: {
      title: 'Create Your First Category',
      content: 'Categories help organize your transactions. Start with something common like "Food", "Transport", or "Rent".',
      icon: <Plus className="w-8 h-8 text-green-500" />,
      action: categories.length > 0 ? 'Continue' : 'Create Category'
    },
    [ONBOARDING_STEPS.ADD_TRANSACTION]: {
      title: 'Add Your First Transaction',
      content: 'Now let\'s add your first expense or income. Record something you\'ve spent or earned recently.',
      icon: <Receipt className="w-8 h-8 text-blue-500" />,
      action: transactions.length > 0 ? 'Continue' : 'Add Transaction'
    },
    [ONBOARDING_STEPS.DASHBOARD_OVERVIEW]: {
      title: 'Explore Your Dashboard',
      content: 'Here\'s where you\'ll see all your financial insights - balances, spending patterns, and progress toward your goals.',
      icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
      action: 'Finish Tutorial'
    }
  }

  const currentStepData = steps[currentStep]

  if (!currentStepData) return null

  return (
    <Modal isOpen={isVisible} onClose={skipOnboarding} size="lg">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
            {currentStepData.icon}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {currentStepData.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {currentStepData.content}
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {Object.values(ONBOARDING_STEPS).slice(0, -1).map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                Object.values(ONBOARDING_STEPS).indexOf(currentStep) >= index
                  ? 'bg-primary-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={skipOnboarding}
            className="flex-1 sm:flex-none"
          >
            <X className="w-4 h-4 mr-2" />
            Skip Tutorial
          </Button>
          <Button
            onClick={nextStep}
            className="flex-1 sm:flex-none"
          >
            {currentStepData.action}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          You can replay this tutorial anytime from Settings
        </p>
      </div>
    </Modal>
  )
}

export default OnboardingTour