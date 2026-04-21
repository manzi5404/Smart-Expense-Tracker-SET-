import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Card from '../common/Card'
import Badge from '../common/Badge'
import { formatCurrency, formatDateRelative, getCategoryName, getCategoryColor } from '../../utils/formatters'
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react'

function RecentTransactions() {
  const navigate = useNavigate()
  const { transactions, categories } = useApp()

  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const recentTransactions = safeTransactions.slice(0, 5)

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <div>
          <Card.Title>Recent Transactions</Card.Title>
          <Card.Description>Your latest financial activity</Card.Description>
        </div>
        <button
          onClick={() => navigate('/transactions')}
          className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </button>
      </Card.Header>
      <Card.Content>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
            <button
              onClick={() => navigate('/add')}
              className="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Add your first transaction →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const isIncome = transaction.type === 'income'
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/transactions')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isIncome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getCategoryName(transaction.category, categories)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateRelative(transaction.date)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

export default RecentTransactions