import { UserPlus, PlusCircle, BarChart3 } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for free in seconds. No credit card required.',
    step: '01',
  },
  {
    icon: PlusCircle,
    title: 'Track Transactions',
    description: 'Log your expenses and income with our intuitive interface.',
    step: '02',
  },
  {
    icon: BarChart3,
    title: 'Analyze & Optimize',
    description: 'Get insights into your spending and make better financial decisions.',
    step: '03',
  },
]

function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started in three simple steps and take control of your finances today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200 dark:from-primary-800 dark:via-accent-800 dark:to-primary-800" />

          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-bold rounded-full">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks