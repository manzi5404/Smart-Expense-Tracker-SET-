import { useState, useEffect } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import { formatCurrency } from '../../utils/formatters'
import { TrendingUp, TrendingDown, PieChart, AlertTriangle, Award, Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react'

function AIInsightsModal({ insights, onClose }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  if (!insights) return null

  const { summary, insights: insightItems, recommendations } = insights

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Financial Insights
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-600 dark:text-green-400">Income</p>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-red-600 dark:text-red-400">Expenses</p>
                <p className="font-semibold text-red-700 dark:text-red-300">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <PieChart className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-600 dark:text-blue-400">Savings</p>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {summary.savingsRate}%
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-600 dark:text-purple-400">Transactions</p>
                <p className="font-semibold text-purple-700 dark:text-purple-300">
                  {summary.transactionCount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Detailed Insights</h3>
              {insightItems.map((insight, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </span>
                    {expandedSections[index] ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {expandedSections[index] && (
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {insight.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Recommendations</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsightsModal
