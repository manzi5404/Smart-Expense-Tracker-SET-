import { TrendingUp, Tags, BarChart3, Target } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const helpItems = [
  {
    icon: TrendingUp,
    question: 'How do I track expenses?',
    answer: 'Add transactions by clicking the "Add Transaction" button. Select income or expense, enter the amount, choose a category, and save. Your dashboard will automatically update.',
  },
  {
    icon: Tags,
    question: 'How do I create categories?',
    answer: 'Navigate to the Categories page to create custom categories. You can set icons, colors, and budget limits for each category to organize your finances better.',
  },
  {
    icon: BarChart3,
    question: 'How do I view reports?',
    answer: 'Visit the Reports page to see detailed analytics of your spending. View trends by category, time period, and compare income vs expenses.',
  },
  {
    icon: Target,
    question: 'How do I manage budgets?',
    answer: 'Set budget limits for each category in the Categories page. Track your progress with visual indicators and receive insights on your spending habits.',
  },
]

function HelpCenter() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="help" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Quick answers to help you get started with Smart Expense Tracker.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {helpItems.map((item, index) => (
            <div
              key={item.question}
              className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HelpCenter