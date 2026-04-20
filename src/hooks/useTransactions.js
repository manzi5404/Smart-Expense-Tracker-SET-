import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useTransactions() {
  const { transactions, categories } = useApp()
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateRange: 'all',
    search: '',
  })

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type)
    }

    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category)
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(t =>
        t.description?.toLowerCase().includes(search) ||
        t.category.toLowerCase().includes(search)
      )
    }

    result.sort((a, b) => new Date(b.date) - new Date(a.date))

    return result
  }, [transactions, filters])

  const incomeTransactions = filteredTransactions.filter(t => t.type === 'income')
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense')

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

  const updateFilters = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateRange: 'all',
      search: '',
    })
  }

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    incomeTransactions,
    expenseTransactions,
    totalIncome,
    totalExpenses,
    filters,
    updateFilters,
    resetFilters,
    categories,
  }
}