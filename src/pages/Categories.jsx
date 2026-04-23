import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { formatCurrency } from '../utils/formatters'
import * as LucideIcons from 'lucide-react'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORY_COLORS = ['#f59e0b', '#3b82f6', '#ec4899', '#ef4444', '#8b5cf6', '#10b981', '#06b6d4', '#0ea5e9', '#84cc16', '#f97316']
const CATEGORY_ICONS = ['Tag', 'Briefcase', 'Laptop', 'TrendingUp', 'Plus', 'Utensils', 'Car', 'ShoppingBag', 'Receipt', 'Film', 'Heart', 'Book', 'MoreHorizontal', 'Home', 'Gift', 'Coffee', 'Plane', 'Smartphone', 'Wifi', 'Zap']

function Categories() {
  const { categories, incomeCategories, expenseCategories, getCategoryStats } = useCategories()
  const { transactions, addCategory, deleteCategory } = useApp()
  const { success, error: showError } = useToast()

  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense',
    color: CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0]
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const renderCategoryCard = (category) => {
    const stats = getCategoryStats(category.id)
    const IconComponent = LucideIcons[category.icon] || LucideIcons.Tag

    return (
      <div
        key={category.id}
        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${category.color || '#6366f1'}20` }}
            >
              <IconComponent
                className="w-5 h-5"
                style={{ color: category.color || '#6366f1' }}
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.count} transaction{stats.count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDeleteConfirm(category)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {stats.count > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(stats.total)}
            </p>
          </div>
        )}
      </div>
    )
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Category name is required')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      await addCategory(newCategory)
      success('Category created successfully!')
      setShowModal(false)
      setNewCategory({
        name: '',
        type: 'expense',
        color: CATEGORY_COLORS[0],
        icon: CATEGORY_ICONS[0]
      })
    } catch (err) {
      setError(err.message || 'Failed to create category')
      showError(err.message || 'Failed to create category')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deleteConfirm) return

    try {
      await deleteCategory(deleteConfirm.id)
      success('Category deleted successfully!')
      setDeleteConfirm(null)
    } catch (err) {
      showError(err.message || 'Failed to delete category')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your income and expense categories</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto min-w-fit"
        >
          New Category
        </Button>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Income Categories
          <span className="text-sm font-normal text-gray-500">({incomeCategories.length})</span>
        </h2>
        {incomeCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map(renderCategoryCard)}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No income categories yet</p>
            <Button onClick={() => {
              setNewCategory(prev => ({ ...prev, type: 'income' }))
              setShowModal(true)
            }} icon={<Plus className="w-4 h-4" />}>
              Create Income Category
            </Button>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Expense Categories
          <span className="text-sm font-normal text-gray-500">({expenseCategories.length})</span>
        </h2>
        {expenseCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map(renderCategoryCard)}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No expense categories yet</p>
            <Button onClick={() => {
              setNewCategory(prev => ({ ...prev, type: 'expense' }))
              setShowModal(true)
            }} icon={<Plus className="w-4 h-4" />}>
              Create Expense Category
            </Button>
          </Card>
        )}
      </section>

      <Card>
        <Card.Header>
          <Card.Title>Category Summary</Card.Title>
          <Card.Description>Overview of your spending and income by category</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {incomeCategories.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Income Categories</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {expenseCategories.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Expense Categories</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">All Categories</p>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Category">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Groceries"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewCategory(prev => ({ ...prev, type: 'income' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  newCategory.type === 'income'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className={newCategory.type === 'income' ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}>
                  Income
                </span>
              </button>
              <button
                type="button"
                onClick={() => setNewCategory(prev => ({ ...prev, type: 'expense' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  newCategory.type === 'expense'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className={newCategory.type === 'expense' ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}>
                  Expense
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    newCategory.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={isCreating}
              icon={<Plus className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Category">
        <div>
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteCategory}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Categories