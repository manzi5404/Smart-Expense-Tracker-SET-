import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Edit2, Trash2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

function Budgets() {
  const { budgets, categories, addBudget, updateBudget, deleteBudget, transactions } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    limit_amount: '',
    period: 'monthly'
  })

  const getSpentAmount = (categoryName) => {
    return transactions
      .filter(t => t.category === categoryName && t.type === 'expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  }

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return 'exceeded'
    if (percentage >= 80) return 'warning'
    return 'safe'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category || !formData.limit_amount) return

    const budgetData = {
      category: formData.category,
      limit_amount: parseFloat(formData.limit_amount),
      period: formData.period
    }

    try {
      if (editingId) {
        await updateBudget(editingId, budgetData)
      } else {
        await addBudget(budgetData)
      }
      setFormData({ category: '', limit_amount: '', period: 'monthly' })
      setShowForm(false)
      setEditingId(null)
    } catch (err) {
      console.error('Failed to save budget:', err)
    }
  }

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      limit_amount: budget.limit_amount,
      period: budget.period
    })
    setEditingId(budget.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id)
    }
  }

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#6366f1'
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ category: '', limit_amount: '', period: 'monthly' }) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 w-full sm:w-auto min-w-fit"
        >
          <Plus size={20} />
          <span className="sm:hidden lg:inline">Add Budget</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select category</option>
                {expenseCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget Amount
              </label>
              <input
                type="number"
                value={formData.limit_amount}
                onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex-1 sm:flex-none min-w-fit"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null) }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 flex-1 sm:flex-none min-w-fit"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
          <p>No budgets yet. Create one to start tracking!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => {
            const spent = getSpentAmount(budget.category)
            const limit = parseFloat(budget.limit_amount) || 0
            const remaining = limit - spent
            const status = getBudgetStatus(spent, limit)
            const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0

            return (
              <div
                key={budget.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 truncate">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(budget.category) }}
                      />
                      <span className="truncate">{budget.category}</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{budget.period}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      ${spent.toFixed(2)} spent
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ${limit.toFixed(2)} limit
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        status === 'exceeded' ? 'bg-red-500' :
                        status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${
                    status === 'exceeded' ? 'text-red-600' :
                    status === 'warning' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {status === 'exceeded' ? <AlertTriangle size={14} /> :
                     status === 'warning' ? <AlertTriangle size={14} /> :
                     <CheckCircle size={14} />}
                    <span className="whitespace-nowrap">
                      {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                    </span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Budgets