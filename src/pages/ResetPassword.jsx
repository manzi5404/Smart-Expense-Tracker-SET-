import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const { token: authToken, isAuthenticated } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

   const token = searchParams.get('token');

   useEffect(() => {
     console.log('🔍 ResetPassword - Token from URL:', token);
     console.log('🔍 Full URL:', window.location.href);
     if (!token && !isAuthenticated) {
       setError('Invalid or missing reset token');
     }
   }, [token, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

     setIsLoading(true);

      console.log('🔑 Attempting password reset with:', {
        token: token,
        tokenLength: token?.length,
        passwordLength: password.length
      });

      try {
        if (token) {
          const response = await api.auth.resetPassword(token, password);
          console.log('✅ Reset API response:', response.data);
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
       } else {
         await api.profile.update({ password });
        setSuccess('Password changed successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The reset link is invalid or expired.</p>
          <Button onClick={() => navigate('/login')} className="bg-gray-600 hover:bg-gray-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const isAuthenticatedChange = !token && isAuthenticated;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate(isAuthenticatedChange ? '/settings' : '/login')}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          {isAuthenticatedChange ? 'Back to Settings' : 'Back to Login'}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAuthenticatedChange ? 'Change Password' : 'Reset Password'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAuthenticatedChange 
                ? 'Enter your new password' 
                : 'Enter your new password for your account'}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8">
            {success && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isAuthenticatedChange ? 'New Password' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                size="lg"
                loading={isLoading}
                disabled={password !== confirmPassword}
              >
                {isAuthenticatedChange ? 'Change Password' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;

