import { ArrowRight, TrendingUp, PieChart, Target } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

function Hero({ onOpenAuth }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-200/30 dark:bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            ref={ref}
            className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Smart financial tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Take Control of Your{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Finances
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
              Track expenses, visualize spending patterns, and achieve your financial goals with our intuitive smart expense tracker.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  1000+ users
                </span>
              </div>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  4.9 rating
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div
            className={`${isVisible ? 'animate-fade-in-delay-2' : 'opacity-0'}`}
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Dashboard</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">2.4M</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">+12%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Income</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent-500">-8%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-32 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-lg flex items-end justify-around px-4 py-2">
                    {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                      <div
                        key={i}
                        className="w-6 bg-gradient-to-t from-primary-500 to-accent-500 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  {/* Recent Items */}
                  <div className="mt-4 space-y-2">
                    {[
                      { icon: PieChart, label: 'Groceries', amount: '-150,000', color: 'text-green-500' },
                      { icon: Target, label: 'Savings', amount: '+500,000', color: 'text-primary-500' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${item.color}`}>{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Savings</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">+24%</p>
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

export default Hero