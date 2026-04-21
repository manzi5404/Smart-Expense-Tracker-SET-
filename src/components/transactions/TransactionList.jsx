import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate, getCategoryName, getCategoryColor } from '../../utils/formatters'
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../common/Card'

function TransactionList({ transactions, categories }) {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState(null)

  if (transactions.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500">
          <ArrowUpRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No transactions found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add a new transaction</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === 'income'
        const isExpanded = expandedId === transaction.id

        return (
          <Card
            key={transaction.id}
            padding="none"
            hover
            className="overflow-hidden"
          >
            <div
              className="p-3 sm:p-4 flex items-center justify-between gap-2 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
            >
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <div
                  className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                    isIncome
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                    {getCategoryName(transaction.category, categories)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className={`text-sm sm:text-base font-semibold truncate max-w-[100px] sm:max-w-none ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-gray-900 dark:text-white mt-1 truncate">
                      {transaction.description || 'No description'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(transaction.category, categories) }}
                      />
                      <span className="text-gray-900 dark:text-white truncate">
                        {getCategoryName(transaction.category, categories)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/add', { state: { editTransaction: transaction } })
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export default TransactionList