import { useNavigate } from 'react-router-dom'
import { Plus, Tags, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Card from '../common/Card'

function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'Add Income',
      icon: ArrowUpRight,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      onClick: () => navigate('/add', { state: { type: 'income' } }),
    },
    {
      label: 'Add Expense',
      icon: ArrowDownRight,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      onClick: () => navigate('/add', { state: { type: 'expense' } }),
    },
    {
      label: 'View Reports',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      onClick: () => navigate('/reports'),
    },
    {
      label: 'Manage Categories',
      icon: Tags,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      onClick: () => navigate('/categories'),
    },
  ]

  return (
    <Card>
      <Card.Header>
        <Card.Title>Quick Actions</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {action.label}
                </span>
              </button>
            )
          })}
        </div>
      </Card.Content>
    </Card>
  )
}

export default QuickActions