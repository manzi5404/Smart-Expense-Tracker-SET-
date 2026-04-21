import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useCategories() {
  const { categories, transactions, getCategoryName, getCategoryColor } = useApp()

  const incomeCategories = useMemo(() =>
    categories.filter(c => c.type === 'income'),
    [categories]
  )

  const expenseCategories = useMemo(() =>
    categories.filter(c => c.type === 'expense'),
    [categories]
  )

  const categoryStats = useMemo(() => {
    const stats = {}
    categories.forEach(cat => {
      const categoryTransactions = transactions.filter(t => t.category === cat.id)
      stats[cat.id] = {
        count: categoryTransactions.length,
        total: categoryTransactions.reduce((sum, t) => sum + t.amount, 0),
        name: cat.name,
        color: cat.color
      }
    })
    return stats
  }, [categories, transactions])

  const getCategoryStats = (categoryId) => {
    return categoryStats[categoryId] || { count: 0, total: 0 }
  }

  return {
    categories,
    incomeCategories,
    expenseCategories,
    categoryStats,
    getCategoryStats,
    getCategoryName,
    getCategoryColor
  }
}