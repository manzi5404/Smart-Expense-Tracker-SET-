import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const AppContext = createContext()

const extractData = (response) => {
  if (!response) return null
  if (response.data !== undefined) {
    const data = response.data
    if (Array.isArray(data)) return data
    if (data.transactions !== undefined) return data.transactions
    if (data.data !== undefined && Array.isArray(data.data)) return data.data
    return data
  }
  if (Array.isArray(response)) return response
  return response
}

const ensureArray = (data) => {
  if (Array.isArray(data)) return data
  if (!data) return []
  console.warn('[AppContext] Data is not an array:', typeof data, data)
  return []
}

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated, token } = useAuth()

  const loadData = useCallback(async () => {
    if (!token) {
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    let transactionsData = null
    let categoriesData = null
    let budgetsData = null
    
    try {
      const transactionsRes = await api.getTransactions()
      transactionsData = ensureArray(extractData(transactionsRes))
      setTransactions(transactionsData)
    } catch (err) {
      console.error('Failed to load transactions:', err.message)
    }
    
    try {
      let categoriesRes = await api.getCategories()
      categoriesData = ensureArray(extractData(categoriesRes))
      
      if (!categoriesData || categoriesData.length === 0) {
        try {
          const seedRes = await api.seedCategories()
          categoriesData = ensureArray(extractData(seedRes))
        } catch (seedErr) {
          console.log('Seed categories failed:', seedErr.message)
        }
      }
      setCategories(ensureArray(categoriesData))
    } catch (err) {
      console.error('Failed to load categories:', err.message)
      if (categoriesData === null) {
        setCategories([])
      }
    }
    
    try {
      const budgetsRes = await api.getBudgets()
      const loadedBudgets = extractData(budgetsRes)
      budgetsData = ensureArray(loadedBudgets?.budgets || loadedBudgets)
      setBudgets(budgetsData)
    } catch (err) {
      console.error('Failed to load budgets:', err.message)
      if (budgetsData === null) {
        setBudgets([])
      }
    }
    
    setIsLoading(false)
  }, [token])

  useEffect(() => {
    if (isAuthenticated && token) {
      loadData()
    } else if (!isAuthenticated) {
      setTransactions([])
      setCategories([])
      setIsLoading(false)
    }
  }, [isAuthenticated, token, loadData])

  const refreshData = useCallback(async () => {
    if (!token) return
    
    try {
      const transactionsRes = await api.getTransactions()
      setTransactions(ensureArray(extractData(transactionsRes)))
    } catch (err) {
      console.error('Failed to refresh transactions:', err.message)
    }
    
    try {
      const categoriesRes = await api.getCategories()
      let categoriesData = extractData(categoriesRes) || []
      
      if (!categoriesData || categoriesData.length === 0) {
        try {
          const seedRes = await api.seedCategories()
          categoriesData = extractData(seedRes) || []
        } catch (seedErr) {
          console.log('Seed categories failed:', seedErr.message)
        }
      }
      setCategories(categoriesData || [])
    } catch (err) {
      console.error('Failed to refresh categories:', err.message)
    }
  }, [token])

  const refreshCategories = useCallback(async () => {
    if (!token) return
    
    try {
      const categoriesRes = await api.getCategories()
      setCategories(ensureArray(extractData(categoriesRes)))
    } catch (err) {
      console.error('Failed to refresh categories:', err)
    }
  }, [token])

  const addTransaction = useCallback(async (transaction) => {
    try {
      const newTransaction = await api.addTransaction(transaction)
      await refreshData()
      return extractData(newTransaction)
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

  const addCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = await api.createCategory(categoryData)
      await refreshCategories()
      return extractData(newCategory)
    } catch (err) {
      console.error('Add category failed:', err)
      throw err
    }
  }, [refreshCategories])

  const deleteCategory = useCallback(async (id) => {
    try {
      await api.deleteCategory(id)
      await refreshCategories()
    } catch (err) {
      console.error('Delete category failed:', err)
      throw err
    }
  }, [refreshCategories])

  const refreshBudgets = useCallback(async () => {
    if (!token) return
    
    try {
      const budgetsRes = await api.getBudgets()
      const loadedBudgets = extractData(budgetsRes)
      setBudgets(ensureArray(loadedBudgets?.budgets || loadedBudgets))
    } catch (err) {
      console.error('Failed to refresh budgets:', err)
    }
  }, [token])

  const addBudget = useCallback(async (budgetData) => {
    try {
      const newBudget = await api.createBudget(budgetData)
      await refreshBudgets()
      return extractData(newBudget)
    } catch (err) {
      console.error('Add budget failed:', err)
      throw err
    }
  }, [refreshBudgets])

  const updateBudget = useCallback(async (id, updates) => {
    try {
      await api.updateBudget(id, updates)
      await refreshBudgets()
    } catch (err) {
      console.error('Update budget failed:', err)
      throw err
    }
  }, [refreshBudgets])

  const deleteBudget = useCallback(async (id) => {
    try {
      await api.deleteBudget(id)
      await refreshBudgets()
    } catch (err) {
      console.error('Delete budget failed:', err)
      throw err
    }
  }, [refreshBudgets])

  const getCategoryById = useCallback((id) => {
    return categories.find(c => c.id === id)
  }, [categories])

  const getCategoryName = useCallback((id) => {
    const cat = categories.find(c => c.id === id)
    return cat ? cat.name : id
  }, [categories])

  const getCategoryColor = useCallback((id) => {
    const cat = categories.find(c => c.id === id)
    return cat ? cat.color : '#6366f1'
  }, [categories])

  const getTransactionsByType = useCallback((type) => {
    return (Array.isArray(transactions) ? transactions : []).filter(t => t.type === type)
  }, [transactions])

  const getTransactionsByCategory = useCallback((category) => {
    return (Array.isArray(transactions) ? transactions : []).filter(t => t.category === category)
  }, [transactions])

  const getTotalIncome = useCallback(() => {
    return (Array.isArray(transactions) ? transactions : [])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [transactions])

  const getTotalExpenses = useCallback(() => {
    return (Array.isArray(transactions) ? transactions : [])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [transactions])

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpenses()
  }, [getTotalIncome, getTotalExpenses])

  const getSpendingByCategory = useCallback(() => {
    const safeData = Array.isArray(transactions) ? transactions : []
    const expenses = safeData.filter(t => t.type === 'expense')
    return expenses.reduce((acc, t) => {
      const name = getCategoryName(t.category)
      acc[t.category] = acc[t.category] || { name, amount: 0, color: getCategoryColor(t.category) }
      acc[t.category].amount += t.amount || 0
      return acc
    }, {})
  }, [transactions, getCategoryName, getCategoryColor])

  const value = {
    transactions,
    categories,
    budgets,
    isLoading,
    error,
    setIsLoading,
    refreshData,
    refreshCategories,
    refreshBudgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    getCategoryById,
    getCategoryName,
    getCategoryColor,
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
