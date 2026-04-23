import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useOnboarding } from '../context/OnboardingContext'
import StatsCard from '../components/dashboard/StatsCard'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import QuickActions from '../components/dashboard/QuickActions'
import FinancialTipsCard from '../components/dashboard/FinancialTipsCard'
import Loading from '../components/common/Loading'
import { formatCurrency } from '../utils/formatters'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function Dashboard() {
  const { getTotalIncome, getTotalExpenses, getBalance, transactions, categories, isLoading, refreshAll } = useApp()
  const { shouldShowOnboarding, startOnboarding } = useOnboarding()

  // Ensure data is loaded when dashboard mounts
  useEffect(() => {
    if (!isLoading && transactions.length === 0 && categories.length === 0) {
      console.log('[Dashboard] Data not loaded, triggering refresh...')
      refreshAll()
    }
  }, [isLoading, transactions.length, categories.length, refreshAll])

  // Check if onboarding should start
  useEffect(() => {
    if (!isLoading && shouldShowOnboarding(categories.length > 0, transactions.length > 0)) {
      // Small delay to ensure UI is ready
      setTimeout(() => startOnboarding(), 1000)
    }
  }, [isLoading, categories.length, transactions.length, shouldShowOnboarding, startOnboarding])

  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const balance = getBalance()

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      color: balance >= 0 ? 'primary' : 'red',
      trend: balance >= 0 ? 'positive' : 'negative',
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'green',
      trend: 'positive',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'red',
      trend: 'negative',
    },
    {
      title: 'Transactions',
      value: safeTransactions.length.toString(),
      icon: ArrowUpRight,
      color: 'blue',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="opacity-90">Income Rate</span>
              <span className="font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {((totalIncome / (totalIncome + totalExpenses)) * 100 || 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-90">Expense Rate</span>
              <span className="font-semibold flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4" />
                {((totalExpenses / (totalIncome + totalExpenses)) * 100 || 0).toFixed(1)}%
              </span>
            </div>
            <div className="pt-3 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="opacity-90">Savings Rate</span>
                <span className="font-semibold">
                  {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <FinancialTipsCard period="month" transactions={transactions} />
      </div>
    </div>
  )
}

export default Dashboard