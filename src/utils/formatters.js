import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('RWF', 'FRW')
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('rw-RW').format(num)
}

export const formatDate = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
  return format(date, 'MMM d, yyyy')
}

export const formatDateShort = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
  return format(date, 'MMM d')
}

export const formatDateRelative = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString

  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  if (isThisWeek(date)) return format(date, 'EEEE')
  if (isThisMonth(date)) return format(date, 'MMM d')
  return format(date, 'MMM d, yyyy')
}

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`
}

export const getCategoryColor = (categoryId, categories) => {
  const category = categories?.find(c => c.id === categoryId)
  return category?.color || '#6b7280'
}

export const getCategoryName = (categoryId, categories) => {
  const category = categories?.find(c => c.id === categoryId)
  return category?.name || categoryId
}

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return (value / total) * 100
}

export const generateId = () => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}