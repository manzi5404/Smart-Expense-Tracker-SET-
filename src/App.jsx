import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { OnboardingProvider } from './context/OnboardingContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/layout/Layout'
import MainLayout from './components/layout/MainLayout'
import ToastContainer from './components/common/ToastContainer'
import GuidedOnboarding from './components/onboarding/GuidedOnboarding'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Categories from './pages/Categories'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import { Pricing, Updates, About, HelpCenter, Contact, Privacy, Terms } from './pages/StaticPages'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <OnboardingProvider>
          <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 prevent-overflow" style={{ overflowX: 'visible', maxWidth: 'none' }}>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Public pages with layout */}
          <Route element={<MainLayout />}>
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          <ToastContainer />
          <GuidedOnboarding />
        </div>
        </AuthProvider>
        </OnboardingProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App