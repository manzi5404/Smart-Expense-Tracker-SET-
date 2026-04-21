import { useEffect } from 'react'
import Card from '../../common/Card'
import Button from '../../common/Button'
import { X, Lightbulb } from 'lucide-react'

function AIInsightsModal({ insights, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Financial Insights
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Personalized analysis based on your spending patterns
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {insights ? (
              insights.map((insight, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {insight.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {insight.description}
                      </p>
                      {insight.action && (
                        <p className="mt-2 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded">
                          💡 {insight.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Add more transactions to unlock personalized insights
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
              Insights powered by your transaction data
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AIInsightsModal

