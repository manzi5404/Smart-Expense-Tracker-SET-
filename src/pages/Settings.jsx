import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useOnboarding } from '../context/OnboardingContext'
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Lock,
  Globe,
  DollarSign,
  Moon,
  Sun,
  Mail,
  AlertTriangle,
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react'

function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { onboardingCompleted, resetOnboarding, startOnboarding } = useOnboarding()
  const navigate = useNavigate()
  
  const [preferences, setPreferences] = useState({
    currency: 'RWF',
    language: 'English'
  })
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    weeklySummary: false
  })

  const handleToggle = (category, key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      {/* Preferences Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary-600" />
          Preferences
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Default Currency</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred currency</p>
              </div>
            </div>
            <select
              value={preferences.currency}
              onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="RWF">RWF (RwF)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose light or dark mode</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="text-gray-900 dark:text-white">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="text-gray-900 dark:text-white">Light</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Language</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your language</p>
              </div>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary-600" />
          Notifications
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="settings-toggle-row">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'emailNotifications')}
              className={`settings-toggle-btn ${
                notifications.emailNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`settings-toggle-knob ${
                  notifications.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="settings-toggle-row">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Budget Alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when approaching budget limit</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'budgetAlerts')}
              className={`settings-toggle-btn ${
                notifications.budgetAlerts ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`settings-toggle-knob ${
                  notifications.budgetAlerts ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="settings-toggle-row">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Weekly Summary</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly spending summary</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications', 'weeklySummary')}
              className={`settings-toggle-btn ${
                notifications.weeklySummary ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`settings-toggle-knob ${
                  notifications.weeklySummary ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-primary-600" />
          Security
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-gray-900 dark:text-white font-medium">Change Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Onboarding Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-600" />
          Getting Started
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Tutorial</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {onboardingCompleted ? 'Replay the guided tutorial' : 'Complete the getting started guide'}
                  </p>
                </div>
              </div>
              <button
                onClick={onboardingCompleted ? resetOnboarding : startOnboarding}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                {onboardingCompleted ? 'Replay Tutorial' : 'Start Tutorial'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Smart Expense Tracker v1.0.0</p>
        <p className="mt-1">Made with ❤️</p>
      </div>
    </div>
  )
}

export default Settings