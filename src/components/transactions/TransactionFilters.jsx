import { Search, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function TransactionFilters({ filters, updateFilters, resetFilters, categories }) {
  const hasActiveFilters = filters.type !== 'all' || filters.category !== 'all' || filters.search

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => updateFilters('type', e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-fit"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => updateFilters('category', e.target.value)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-fit"
        >
          <option value="all">All Categories</option>
          <optgroup label="Income">
            {categories.filter(c => c.type === 'income').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Expense">
            {categories.filter(c => c.type === 'expense').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        </select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default TransactionFilters