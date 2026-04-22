import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import api from '../services/api';
import emailjs from '@emailjs/browser';

function ForgotPassword() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setIsLoading(true);

    try {
      const response = await api.auth.forgotPassword(email);
      const resetUrl = response.data?.resetUrl;

      if (resetUrl) {
        const templateParams = {
          email: email,
          reset_link: resetUrl
        };

        console.log('📧 Sending EmailJS payload:', templateParams);

        const emailResult = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        if (emailResult.status !== 200 && emailResult.status !== 202) {
          console.error('❌ EmailJS error:', emailResult);
          throw new Error('Failed to send reset email');
        }

        console.log('✅ EmailJS sent successfully:', emailResult.status);
      }

      setStatus(response.data?.message || 'If an account exists, reset instructions have been sent.');
    } catch (error) {
      console.error('❌ EmailJS FULL ERROR:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        status: error.status,
        statusText: error.statusText
      });
      setError(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8">
            {status && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-300">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{status}</span>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                size="lg"
                loading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Return to Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
            We'll send you a secure link to reset your password. It expires in 30 minutes.
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword

