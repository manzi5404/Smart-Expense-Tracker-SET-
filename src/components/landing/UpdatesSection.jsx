import { Sparkles, BarChart3, Zap } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const updates = [
  {
    icon: Sparkles,
    title: 'New Features Coming',
    description: 'We're working on exciting new features including AI-powered insights and smart recommendations.',
    status: 'In Progress',
  },
  {
    icon: BarChart3,
    title: 'Improved Analytics',
    description: 'Enhanced reporting with deeper insights, trend analysis, and customizable dashboards.',
    status: 'Coming Soon',
  },
  {
    icon: Zap,
    title: 'Performance & UI',
    description: 'Faster load times, smoother animations, and a more refined user experience across all devices.',
    status: 'Ongoing',
  },
]

function UpdatesSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="updates" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What's{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              New
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're constantly improving to bring you the best expense tracking experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {updates.map((update, index) => (
            <div
              key={update.title}
              className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-4">
                  <update.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {update.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                    {update.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {update.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpdatesSection