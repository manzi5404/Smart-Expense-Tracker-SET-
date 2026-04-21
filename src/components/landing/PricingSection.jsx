import { Clock } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function PricingSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            <span>Coming Soon</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            This system is currently under development. Pricing plans will be introduced soon as we continue improving the platform.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Free During Beta
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enjoy full access to all features while we're in development. Stay tuned for pricing updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection