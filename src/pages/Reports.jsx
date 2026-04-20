import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getCategorySpending, getMonthlyData } from '../data/mockData'
import Card from '../components/common/Card'
import SpendingByCategory from '../components/charts/SpendingByCategory'
import IncomeVsExpense from '../components/charts/IncomeVsExpense'
import MonthlyTrend from '../components/charts/MonthlyTrend'
import { formatCurrency } from '../utils/formatters'
import { TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react'

function Reports() {
  const { getTotalIncome, getTotalExpenses, getBalance, transactions } = useApp()
  const [period, setPeriod] = useState('month')

  const totalIncome = getTotalIncome()
  const totalExpenses = getTotalExpenses()
  const balance = getBalance()
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  const categorySpending = getCategorySpending()
  const monthlyData = getMonthlyData()

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    },
    {
      label: 'Net Balance',
      value: formatCurrency(balance),
      icon: PiggyBank,
      color: balance >= 0 ? 'text-primary-600 bg-primary-100 dark:bg-primary-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex items-center gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingByCategory data={categorySpending} />
        <IncomeVsExpense data={monthlyData} />
      </div>

      {/* Monthly Trend */}
      <MonthlyTrend data={monthlyData} />

      {/* Summary */}
      <Card>
        <Card.Header>
          <Card.Title>Financial Summary</Card.Title>
          <Card.Description>Your financial health at a glance</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Income Sources</h4>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                from {transactions.filter(t => t.type === 'income').length} transactions
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Expense Breakdown</h4>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                from {transactions.filter(t => t.type === 'expense').length} transactions
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl">
              <h4 className="font-medium text-primary-800 dark:text-primary-300 mb-2">Net Position</h4>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                {balance >= 0 ? 'Positive balance' : 'Negative balance'}
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Reports