import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import Card from '../components/common/Card'
import SpendingByCategory from '../components/charts/SpendingByCategory'
import IncomeVsExpense from '../components/charts/IncomeVsExpense'
import MonthlyTrend from '../components/charts/MonthlyTrend'
import { formatCurrency } from '../utils/formatters'
import { TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react'

const parseTransactionDate = (dateStr) => {
  if (!dateStr) return new Date()
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? new Date() : date
}

const getPeriodStart = (period) => {
  const now = new Date()
  let startDate
  if (period === 'week') {
    startDate = new Date(now)
    startDate.setDate(startDate.getDate() - 6)
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    startDate = new Date(now.getFullYear(), 0, 1)
  }
  return startDate
}

const TYPE_COLORS = {
  expense: '#ef4444',
  income: '#10b981'
}

function Reports() {
  const { transactions, getCategoryName, getCategoryColor } = useApp()
  const [period, setPeriod] = useState('month')
  const [spendingData, setSpendingData] = useState([])
  const [monthlyChartData, setMonthlyChartData] = useState([])
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 })
  const [loadingReports, setLoadingReports] = useState(false)

  const extractData = (res) => {
    const data = res?.data
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    return data || []
  }

  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true)
      try {
         const [summaryRes, spendingRes, trendRes] = await Promise.all([
           api.reports.getSummary(period),
           api.reports.getSpending(period),
           api.reports.getTrend(6)
         ])

        const summaryData = summaryRes?.data?.data || summaryRes?.data || summaryRes
        setSummary(summaryData)

        const spending = spendingRes?.data?.data || spendingRes?.data || spendingRes
        const spendingArray = spending?.spendingByCategory || spending?.expenseByCategory || []
        const safeSpending = Array.isArray(spendingArray) ? spendingArray : []
        setSpendingData(safeSpending.map(item => ({
          category: item.category,
          name: item.name || item.category,
          amount: item.amount,
          color: item.color || getCategoryColor(item.category) || TYPE_COLORS.expense
        })))

        const trend = trendRes?.data?.data || trendRes?.data || trendRes
        const chartData = (trend?.months || []).map((month, i) => ({
          month,
          income: trend?.income?.[i] || 0,
          expenses: trend?.expenses?.[i] || 0
        }))
        setMonthlyChartData(chartData)
      } catch (err) {
        console.error('Failed to fetch reports:', err)
        const periodStart = getPeriodStart(period)
        const safeTransactions = Array.isArray(transactions) ? transactions : []
        
        const filteredTx = safeTransactions.filter(t => {
          const txDate = parseTransactionDate(t.date)
          return txDate >= periodStart
        })

        const spendingByCat = {}
        filteredTx
          .filter(t => t.type === 'expense')
          .forEach(t => {
            if (!spendingByCat[t.category]) {
              spendingByCat[t.category] = {
                category: t.category,
                name: getCategoryName(t.category),
                amount: 0,
                color: getCategoryColor(t.category) || TYPE_COLORS.expense
              }
            }
            spendingByCat[t.category].amount += t.amount || 0
          })
        
        const totalIncome = filteredTx
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        const totalExpenses = filteredTx
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (t.amount || 0), 0)

        setSpendingData(Object.values(spendingByCat))
        setSummary({ 
          totalIncome, 
          totalExpenses, 
          balance: totalIncome - totalExpenses 
        })
        setMonthlyChartData([])
      } finally {
        setLoadingReports(false)
      }
    }

    fetchReports()
  }, [period])

  const { totalIncome, totalExpenses, balance } = summary
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  const periodTransactions = useMemo(() => {
    const periodStart = getPeriodStart(period)
    const safeTransactions = Array.isArray(transactions) ? transactions : []
    return safeTransactions.filter(t => {
      const txDate = parseTransactionDate(t.date)
      return txDate >= periodStart
    })
  }, [transactions, period])

  const safePeriodTransactions = Array.isArray(periodTransactions) ? periodTransactions : []
  const periodIncomeCount = safePeriodTransactions.filter(t => t.type === 'income').length
  const periodExpenseCount = safePeriodTransactions.filter(t => t.type === 'expense').length

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex flex-wrap items-center gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors capitalize text-sm sm:text-base ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="flex items-start gap-3">
              <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${stat.color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingByCategory data={spendingData} />
        <IncomeVsExpense data={monthlyChartData} />
      </div>

      <MonthlyTrend data={monthlyChartData} />

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
                from {periodIncomeCount} transactions
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Expense Breakdown</h4>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                from {periodExpenseCount} transactions
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