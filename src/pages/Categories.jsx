import { useCategories } from '../hooks/useCategories'
import { useApp } from '../context/AppContext'
import Card from '../components/common/Card'
import { formatCurrency } from '../utils/formatters'
import { useTheme } from '../context/ThemeContext'
import * as LucideIcons from 'lucide-react'

function Categories() {
  const { categories, incomeCategories, expenseCategories, getCategoryStats } = useCategories()
  const { transactions } = useApp()
  const { theme } = useTheme()

  const renderCategoryCard = (category) => {
    const stats = getCategoryStats(category.id)
    const IconComponent = LucideIcons[category.icon] || LucideIcons.Tag

    return (
      <div
        key={category.id}
        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <IconComponent
                className="w-5 h-5"
                style={{ color: category.color }}
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.count} transaction{stats.count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        {stats.count > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(stats.total)}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Income Categories */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Income Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeCategories.map(renderCategoryCard)}
        </div>
      </section>

      {/* Expense Categories */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Expense Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenseCategories.map(renderCategoryCard)}
        </div>
      </section>

      {/* Summary */}
      <Card>
        <Card.Header>
          <Card.Title>Category Summary</Card.Title>
          <Card.Description>Overview of your spending and income by category</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {incomeCategories.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income Categories</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {expenseCategories.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expense Categories</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">All Categories</p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Categories