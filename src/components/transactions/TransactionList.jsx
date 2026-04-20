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
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    isIncome
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
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
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-semibold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {transaction.description || 'No description'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(transaction.category, categories) }}
                      />
                      <span className="text-gray-900 dark:text-white">
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