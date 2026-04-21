import { TrendingUp, Tags, BarChart3, Target, Globe } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const features = [
  {
    icon: TrendingUp,
    title: 'Expense Tracking',
    description: 'Track all your expenses and income in one place with easy-to-use categorization.',
    color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
  },
  {
    icon: Tags,
    title: 'Smart Categories',
    description: 'Organize transactions with custom categories and automatic suggestions.',
    color: 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
  },
  {
    icon: BarChart3,
    title: 'Visual Reports',
    description: 'Understand your spending patterns with beautiful charts and detailed analytics.',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    icon: Target,
    title: 'Budget Goals',
    description: 'Set financial goals and track your progress with smart budget management.',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description: 'Support for multiple currencies with automatic conversion rates.',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
]

function Features() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Manage Finances
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to help you take control of your money and build better financial habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`
                ${isVisible ? 'animate-fade-in' : 'opacity-0'}
                ${index === 4 ? 'lg:col-start-2' : ''}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features