import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useAuth()

  // Load data on mount/auth change
  useEffect(() => {
    if (!isAuthenticated) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [transactionsRes, categoriesRes] = await Promise.all([
          api.getTransactions(),
          api.getCategories()
        ])
        
        setTransactions(transactionsRes.data || transactionsRes || [])
        setCategories(categoriesRes.data || categoriesRes || [])
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(err.message)
        setTransactions([])
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated])

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return
    
    try {
      setIsLoading(true)
      const [transactionsRes, categoriesRes] = await Promise.all([
        api.getTransactions(),
        api.getCategories()
      ])
      
      setTransactions(transactionsRes.data || transactionsRes || [])
      setCategories(categoriesRes.data || categoriesRes || [])
    } catch (err) {
      console.error('Failed to refresh:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const addTransaction = useCallback(async (transaction) => {
    try {
      const newTransaction = await api.addTransaction(transaction)
      await refreshData()
      return newTransaction.data || newTransaction
    } catch (err) {
      console.error('Add transaction failed:', err)
      throw err
    }
  }, [refreshData])

  const updateTransaction = useCallback(async (id, updates) => {
    try {
      await api.updateTransaction(id, updates)
      await refreshData()
    } catch (err) {
      console.error('Update transaction failed:', err)
      throw err
    }
  }, [refreshData])

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.deleteTransaction(id)
      await refreshData()
    } catch (err) {
      console.error('Delete transaction failed:', err)
      throw err
    }
  }, [refreshData])

  const getTransactionsByType = useCallback((type) => {
    return transactions.filter(t => t.type === type)
  }, [transactions])

  const getTransactionsByCategory = useCallback((category) => {
    return transactions.filter(t => t.category === category)
  }, [transactions])

  const getTotalIncome = useCallback(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [transactions])

  const getTotalExpenses = useCallback(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [transactions])

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpenses()
  }, [getTotalIncome, getTotalExpenses])

  const getSpendingByCategory = useCallback(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    return expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (t.amount || 0)
      return acc
    }, {})
  }, [transactions])

  const value = {
    transactions,
    categories,
    isLoading,
    error,
    setIsLoading,
    refreshData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByCategory,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getSpendingByCategory
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
