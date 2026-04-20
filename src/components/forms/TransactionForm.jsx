import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import Button from '../common/Button'
import Card from '../common/Card'
import { ArrowUpRight, ArrowDownRight, Save } from 'lucide-react'

function TransactionForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTransaction, updateTransaction, categories } = useApp()

  const editTransaction = location.state?.editTransaction
  const initialType = location.state?.type || 'expense'

  const [formData, setFormData] = useState({
    type: initialType,
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        type: editTransaction.type,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        date: editTransaction.date,
        description: editTransaction.description || '',
      })
    } else if (location.state?.type) {
      setFormData(prev => ({ ...prev, type: location.state.type }))
    }
  }, [editTransaction, location.state])

  const filteredCategories = categories.filter(c => c.type === formData.type)

  const validate = () => {
    const newErrors = {}
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description.trim(),
    }

    if (editTransaction) {
      updateTransaction(editTransaction.id, transactionData)
    } else {
      addTransaction(transactionData)
    }

    navigate('/transactions')
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    if (field === 'type') {
      setFormData(prev => ({ ...prev, category: '' }))
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <Card.Header>
        <Card.Title>
          {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </Card.Title>
        <Card.Description>
          {editTransaction
            ? 'Update the details of your transaction'
            : 'Record your income or expense'}
        </Card.Description>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('type', 'income')}
                className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                }`}
              >
                <ArrowUpRight className={`w-5 h-5 ${formData.type === 'income' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${formData.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Income
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'expense')}
                className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                }`}
              >
                <ArrowDownRight className={`w-5 h-5 ${formData.type === 'expense' ? 'text-red-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${formData.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Expense
                </span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (FRW)
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0"
                className={`w-full px-4 py-3 text-xl font-semibold border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {formData.amount && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  ≈ {formatCurrency(parseFloat(formData.amount))}
                </div>
              )}
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select a category</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add a note about this transaction..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={<Save className="w-4 h-4" />}
              className="flex-1"
            >
              {editTransaction ? 'Update' : 'Save'} Transaction
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  )
}

export default TransactionForm