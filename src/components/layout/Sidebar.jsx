import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  Tags,
  BarChart3,
  Wallet
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/add', label: 'Add Transaction', icon: PlusCircle },
  { path: '/categories', label: 'Categories', icon: Tags },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
]

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white">ExpenseTracker</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Smart Money Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
            Pro Tip
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Track your spending daily for better insights
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar