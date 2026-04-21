import { useState, useMemo } from 'react'
import Card from '../common/Card'
import { getTipForPeriod, generateAIInsight } from '../../data/financialTips'
import { formatCurrency } from '../../utils/formatters'
import * as LucideIcons from 'lucide-react'
import AIInsightsModal from '../common/AIInsightsModal'

function FinancialTipsCard({ period = 'month', transactions = [] }) {
  const [showInsights, setShowInsights] = useState(false)
  const [aiInsights, setAiInsights] = useState(null)

  const stats = useMemo(() => {
    const periodTransactions = transactions.filter(t => {
      const txDate = new Date(t.date)
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
      
      return txDate >= startDate
    })

    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const totalExpenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const categoryBreakdown = {}
    periodTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + (t.amount || 0)
      })

    const topCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0]?.[0]

    return {
      totalIncome,
      totalExpenses,
      categoryBreakdown,
      topCategory,
      incomeCount: periodTransactions.filter(t => t.type === 'income').length,
      expenseCount: periodTransactions.filter(t => t.type === 'expense').length
    }
  }, [transactions, period])

  const currentTip = useMemo(() => {
    return getTipForPeriod(period, stats)
  }, [period, stats])

  const handleLearnMore = () => {
    const insights = generateAIInsight(period, transactions, stats)
    setAiInsights(insights)
    setShowInsights(true)
  }

  const IconComponent = currentTip ? LucideIcons[currentTip.icon] || LucideIcons.Lightbulb : LucideIcons.Lightbulb

  return (
    <>
      <Card className="h-full">
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <IconComponent className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <Card.Title>{currentTip?.title || 'Financial Tip'}</Card.Title>
              <Card.Description>
                {period === 'week' ? 'Weekly' : period === 'month' ? 'Monthly' : 'Yearly'} Insight
              </Card.Description>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {currentTip?.shortMessage || 'Track your spending to identify patterns and make better financial decisions.'}
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {period === 'week' 
                ? `This week's spending: ${formatCurrency(stats.totalExpenses)}`
                : period === 'month'
                  ? `This month's spending: ${formatCurrency(stats.totalExpenses)}`
                  : `This year's spending: ${formatCurrency(stats.totalExpenses)}`
              }
            </p>
          </div>

          <button
            onClick={handleLearnMore}
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1"
          >
            Learn more →
          </button>
        </Card.Content>
      </Card>

      {showInsights && aiInsights && (
        <AIInsightsModal 
          insights={aiInsights}
          onClose={() => setShowInsights(false)}
        />
      )}
    </>
  )
}

export default FinancialTipsCard
