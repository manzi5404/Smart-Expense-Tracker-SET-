import { TrendingUp, Target, Lightbulb } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const insights = [
  {
    icon: TrendingUp,
    title: 'Understand Spending',
    description: 'Get a clear picture of where your money goes with detailed breakdowns and visual charts.',
    stat: '85%',
    statLabel: 'Better awareness',
  },
  {
    icon: Target,
    title: 'Achieve Goals',
    description: 'Set savings targets and track your progress with motivating visual feedback.',
    stat: '2.5x',
    statLabel: 'Faster goal achievement',
  },
  {
    icon: Lightbulb,
    title: 'Make Better Decisions',
    description: 'Receive AI-powered insights and financial tips tailored to your spending habits.',
    stat: '40%',
    statLabel: 'Average savings increase',
  },
]

function Insights() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            ref={ref}
            className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Make Smarter{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Financial Decisions
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Our intelligent analytics help you understand your spending patterns and provide actionable insights to improve your financial health.
            </p>

            <div className="space-y-6">
              {insights.map((insight, index) => (
                <div
                  key={insight.title}
                  className={`flex gap-4 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center flex-shrink-0">
                    <insight.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {insight.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                      {insight.stat}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {insight.statLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div
            className={`${isVisible ? 'animate-fade-in-delay-2' : 'opacity-0'}`}
          >
            <div className="relative">
              {/* Main Chart Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Overview
                  </h3>
                  <span className="text-sm text-green-500 font-medium">+18%</span>
                </div>

                {/* Chart */}
                <div className="h-48 flex items-end justify-between gap-2 mb-4">
                  {[65, 45, 80, 55, 70, 90, 75, 60, 85, 50, 95, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary-500 to-accent-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span>Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent-500" />
                    <span>Expenses</span>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">+250,000 FRW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Insights