import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const AppContext = createContext()

export const extractArray = (response, key = null) => {
  if (!response) return []
  
  console.log('[NORMALIZE] Response:', JSON.stringify(response).substring(0, 300))
  
  const data = response?.data
  
  if (key) {
    const value = data?.[key] || data?.data?.[key]
    if (Array.isArray(value)) return value
  }
  
  if (Array.isArray(data)) return data
  if (data?.transactions && Array.isArray(data.transactions)) return data.transactions
  if (data?.budgets && Array.isArray(data.budgets)) return data.budgets
  if (data?.categories && Array.isArray(data.categories)) return data.categories
  if (data?.data && Array.isArray(data.data)) return data.data
  
  if (Array.isArray(response)) return response
  return []
}

const extractData = (response, key = null) => {
  const arr = extractArray(response, key)
  if (arr.length > 0) return arr
  
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
       const transactionsRes = await api.transactions.getAll()
       transactionsData = extractArray(transactionsRes, 'transactions')
       setTransactions(transactionsData)
       console.log('[✅] Transactions loaded:', transactionsData.length)
    } catch (err) {
      console.error('[❌] Failed to load transactions:', err.message)
      setError('Failed to load transactions')
    }
    
     try {
       let categoriesRes = await api.categories.getAll()
       categoriesData = extractArray(categoriesRes, 'categories')
       
       if (!categoriesData || categoriesData.length === 0) {
         try {
           const seedRes = await api.categories.seed()
          categoriesData = extractArray(seedRes, 'categories')
          console.log('[✅] Categories seeded')
        } catch (seedErr) {
          console.log('[❌] Seed categories failed:', seedErr.message)
        }
      }
      setCategories(categoriesData)
      console.log('[✅] Categories loaded:', categoriesData.length)
    } catch (err) {
      console.error('[❌] Failed to load categories:', err.message)
      if (categoriesData === null) {
        setCategories([])
      }
    }
    
     try {
       const budgetsRes = await api.budgets.getAll()
       budgetsData = extractArray(budgetsRes, 'budgets')
       setBudgets(budgetsData)
      console.log('[✅] Budgets loaded:', budgetsData.length)
    } catch (err) {
      console.error('[❌] Failed to load budgets:', err.message)
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
      const transactionsRes = await api.transactions.getAll()
      const tx = extractArray(transactionsRes, 'transactions')
      setTransactions(tx)
      console.log('[REFRESH] Transactions:', tx.length)
    } catch (err) {
      console.error('[REFRESH ERROR] Transactions:', err.message)
    }
    
     try {
       const categoriesRes = await api.categories.getAll()
       let categoriesData = extractArray(categoriesRes, 'categories') || []
       
       if (!categoriesData || categoriesData.length === 0) {
         try {
           const seedRes = await api.categories.seed()
          categoriesData = extractArray(seedRes, 'categories') || []
        } catch (seedErr) {
          console.log('Seed categories failed:', seedErr.message)
        }
      }
      setCategories(categoriesData)
      console.log('[REFRESH] Categories:', categoriesData.length)
    } catch (err) {
      console.error('[REFRESH ERROR] Categories:', err.message)
    }
  }, [token])

  const refreshAll = useCallback(async () => {
    if (!token) return
    console.log('[REFRESH ALL] Starting...')
    
     try {
       const [transactionsRes, categoriesRes, budgetsRes] = await Promise.all([
         api.transactions.getAll(),
         api.categories.getAll(),
         api.budgets.getAll()
       ])
      
      const tx = extractArray(transactionsRes, 'transactions')
      const cat = extractArray(categoriesRes, 'categories')
      const bud = extractArray(budgetsRes, 'budgets')
      
      setTransactions(tx)
      setCategories(cat)
      setBudgets(bud)
      
      console.log('[REFRESH ALL] Done - Transactions:', tx.length, 'Categories:', cat.length, 'Budgets:', bud.length)
    } catch (err) {
      console.error('[REFRESH ALL ERROR]:', err.message)
    }
  }, [token])

   const refreshCategories = useCallback(async () => {
     if (!token) return
     
     try {
       const categoriesRes = await api.categories.getAll()
       setCategories(extractArray(categoriesRes, 'categories'))
    } catch (err) {
      console.error('[REFRESH ERROR] Categories:', err)
    }
  }, [token])

   const addTransaction = useCallback(async (transaction) => {
     try {
       const newTransaction = await api.transactions.create(transaction)
       await refreshAll()
      console.log('[✅] Transaction added successfully')
      return newTransaction?.data?.data || newTransaction?.data || newTransaction
    } catch (err) {
      console.error('[❌] Add transaction failed:', err)
      throw err
    }
  }, [refreshAll])

   const updateTransaction = useCallback(async (id, updates) => {
     try {
       await api.transactions.update(id, updates)
       await refreshAll()
      console.log('[✅] Transaction updated successfully')
    } catch (err) {
      console.error('[❌] Update transaction failed:', err)
      throw err
    }
  }, [refreshAll])

   const deleteTransaction = useCallback(async (id) => {
     try {
       await api.transactions.delete(id)
       await refreshAll()
      console.log('[✅] Transaction deleted successfully')
    } catch (err) {
      console.error('[❌] Delete transaction failed:', err)
      throw err
    }
  }, [refreshData])

   const addCategory = useCallback(async (categoryData) => {
     try {
       const newCategory = await api.categories.create(categoryData)
       await refreshAll()
      console.log('[✅] Category added')
      return newCategory?.data?.data || newCategory?.data || newCategory
    } catch (err) {
      console.error('[❌] Add category failed:', err)
      throw err
    }
  }, [refreshAll])

   const deleteCategory = useCallback(async (id) => {
     try {
       await api.categories.delete(id)
       await refreshAll()
      console.log('[✅] Category deleted')
    } catch (err) {
      console.error('[❌] Delete category failed:', err)
      throw err
    }
  }, [refreshAll])

   const refreshBudgets = useCallback(async () => {
     if (!token) return
     
     try {
       const budgetsRes = await api.budgets.getAll()
       const loadedBudgets = extractData(budgetsRes)
      setBudgets(ensureArray(loadedBudgets?.budgets || loadedBudgets))
    } catch (err) {
      console.error('Failed to refresh budgets:', err)
    }
  }, [token])

   const addBudget = useCallback(async (budgetData) => {
     try {
       const newBudget = await api.budgets.create(budgetData)
       await refreshBudgets()
      return extractData(newBudget)
    } catch (err) {
      console.error('Add budget failed:', err)
      throw err
    }
  }, [refreshBudgets])

   const updateBudget = useCallback(async (id, updates) => {
     try {
       await api.budgets.update(id, updates)
       await refreshBudgets()
    } catch (err) {
      console.error('Update budget failed:', err)
      throw err
    }
  }, [refreshBudgets])

   const deleteBudget = useCallback(async (id) => {
     try {
       await api.budgets.delete(id)
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
    refreshAll,
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
