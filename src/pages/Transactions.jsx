import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import TransactionList from '../components/transactions/TransactionList'
import TransactionFilters from '../components/transactions/TransactionFilters'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { formatCurrency } from '../utils/formatters'
import { Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function Transactions() {
  const navigate = useNavigate()
  const {
    transactions,
    totalIncome,
    totalExpenses,
    filters,
    updateFilters,
    resetFilters,
    categories,
  } = useTransactions()

  const [viewMode, setViewMode] = useState('all')

  const displayTransactions = viewMode === 'income'
    ? transactions.filter(t => t.type === 'income')
    : viewMode === 'expense'
      ? transactions.filter(t => t.type === 'expense')
      : transactions

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Net Balance</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                +{formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                -{formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setViewMode('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Expenses
          </button>
        </div>

        <Button
          onClick={() => navigate('/add')}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
        categories={categories}
      />

      {/* Transaction List */}
      <TransactionList
        transactions={displayTransactions}
        categories={categories}
      />
    </div>
  )
}

export default Transactions