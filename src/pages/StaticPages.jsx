import { Link } from 'react-router-dom'
import { CheckCircle, Star, Zap, Shield, Users, TrendingUp, PieChart, Target, Calendar, Bell, Smartphone } from 'lucide-react'
import Card from '../components/common/Card'

const features = [
  {
    icon: TrendingUp,
    title: 'Track Income & Expenses',
    description: 'Record all your daily transactions instantly. Know exactly where every RWF goes.',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    icon: PieChart,
    title: 'Category Management',
    description: 'Organize spending by custom categories. Food, transport, bills, and more.',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    icon: Target,
    title: 'Budget Planning',
    description: 'Set monthly budgets per category. Stay in control of your spending limits.',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  },
  {
    icon: TrendingUp,
    title: 'Financial Reports',
    description: 'Visual insights with charts. Track spending patterns over time.',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  },
  {
    icon: Calendar,
    title: 'Weekly & Monthly Views',
    description: 'Filter transactions by period. Get weekly or monthly summaries.',
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Access your finances from any device. Fast and responsive experience.',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
  }
]

export function Features() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Smart Finance Control for Everyone in{' '}
          <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Rwanda
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Powerful features designed to help you take control of your money and build better financial habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to take control of your finances?</h2>
        <p className="text-white/90 mb-6">Start tracking your expenses today - completely free</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  )
}

export function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple and Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We're focused on building value first. Pricing will be introduced soon.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Free While in Development</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Smart Expense Tracker is currently free to use while we continue building the best financial tracking experience for Rwanda and beyond.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Unlimited Transactions</h3>
              <p className="text-sm text-gray-500">Record as many transactions as you need</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Budget Tracking</h3>
              <p className="text-sm text-gray-500">Set and monitor multiple budgets</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Financial Reports</h3>
              <p className="text-sm text-gray-500">Access detailed analytics and insights</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coming Soon</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">Pro Tier - Advanced Analytics</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">Business Tier - Multi-user Support</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">Mobile App</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Updates() {
  const updates = [
    {
      version: '1.2.0',
      date: 'April 2026',
      title: 'Enhanced Reporting System',
      description: 'New spending by category charts, monthly trends, and improved financial insights.'
    },
    {
      version: '1.1.0',
      date: 'March 2026',
      title: 'Budget Management',
      description: 'Added complete budget tracking system with progress indicators and alerts.'
    },
    {
      version: '1.0.0',
      date: 'February 2026',
      title: 'Initial Release',
      description: 'Core expense tracking, categories, transactions, and basic reporting launched.'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          What's New in SET
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We're constantly improving your financial tracking experience
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {updates.map((update, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                v{update.version}
              </span>
              <span className="text-sm text-gray-500">{update.date}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {update.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {update.description}
            </p>
          </div>
        ))}

        <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Coming Soon</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary-500" />
              Mobile app for iOS and Android
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary-500" />
              AI-powered financial insights
            </li>
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500" />
              Family and team sharing
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Built in{' '}
          <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Rwanda
          </span>
          , for Financial Clarity
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Empowering individuals to take control of their finances
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <Card.Header>
            <Card.Title>Our Mission</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-600 dark:text-gray-400">
              Smart Expense Tracker (SET) is a modern financial management system built to help individuals in Rwanda and beyond take control of their money. We believe that everyone deserves access to simple, powerful tools for managing their finances.
            </p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Why SET?</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                Simple and intuitive interface
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                Designed for Rwandan Franc (RWF)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                Works offline and on mobile
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                Your data stays private and secure
              </li>
            </ul>
          </Card.Content>
        </Card>
      </div>

      <div className="bg-gray-900 dark:bg-gray-950 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Made with ❤️ in Rwanda</h2>
        <p className="text-gray-400">
          Building the future of personal finance for East Africa
        </p>
      </div>
    </div>
  )
}

export function HelpCenter() {
  const helpTopics = [
    {
      title: 'How to create an account',
      content: 'Click "Get Started" on the landing page, fill in your name, email, and password. You\'ll be redirected to the dashboard immediately.'
    },
    {
      title: 'How to add transactions',
      content: 'Click the "Add" button or navigate to "Add Transaction". Select type (income/expense), enter amount, choose category, and save.'
    },
    {
      title: 'How to create categories',
      content: 'Go to Categories page and click "Add Category". You can create custom categories for both income and expenses.'
    },
    {
      title: 'How to set budgets',
      content: 'Navigate to Budgets page, click "Add Budget", select a category, set your monthly limit, and save.'
    },
    {
      title: 'How reports work',
      content: 'The Reports page shows your spending by category, income vs expenses, and monthly trends. Use the period selector to filter data.'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          We're Here to Help
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Find answers to common questions below
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {helpTopics.map((topic, index) => (
          <details
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <summary className="flex items-center justify-between p-6 cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {topic.title}
              </h3>
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400">
              {topic.content}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Still need help?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Contact us directly and we'll get back to you within 24-48 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:manziluckyun@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Email Support
          </a>
          <a
            href="tel:+250791832523"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Call +250 791 832 523
          </a>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We'd love to hear from you
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <Card.Header>
              <Card.Title>Email Us</Card.Title>
              <Card.Description>For general inquiries and support</Card.Description>
            </Card.Header>
            <Card.Content>
              <a
                href="mailto:manziluckyun@gmail.com"
                className="text-lg text-primary-600 dark:text-primary-400 hover:underline"
              >
                manziluckyun@gmail.com
              </a>
              <p className="text-sm text-gray-500 mt-2">We typically respond within 24-48 hours</p>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Call Us</Card.Title>
              <Card.Description>Mon-Fri, 9am-5pm CAT</Card.Description>
            </Card.Header>
            <Card.Content>
              <a
                href="tel:+250791832523"
                className="text-lg text-primary-600 dark:text-primary-400 hover:underline"
              >
                +250 791 832 523
              </a>
              <p className="text-sm text-gray-500 mt-2">Available during business hours</p>
            </Card.Content>
          </Card>

          <Card className="md:col-span-2">
            <Card.Header>
              <Card.Title>Location</Card.Title>
              <Card.Description>Based in Rwanda</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 dark:text-gray-400">
                Smart Expense Tracker is proudly built and based in Rwanda, serving users across East Africa and beyond.
              </p>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function Privacy() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data We Collect</h2>
            <p>We store only necessary user data including:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Account information (name, email)</li>
              <li>Transactions (amount, category, date, type)</li>
              <li>Categories you create</li>
              <li>Budget settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Protection</h2>
            <p>Your data is protected through:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Encrypted authentication tokens (JWT)</li>
              <li>Secure database storage</li>
              <li>No third-party data sharing</li>
              <li>User-controlled data deletion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h2>
            <p>You can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access your data at any time</li>
              <li>Delete your account and all associated data</li>
              <li>Request data export</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
            <p>For privacy concerns, contact: <a href="mailto:manziluckyun@gmail.com" className="text-primary-600 hover:underline">manziluckyun@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}

export function Terms() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Acceptance of Terms</h2>
            <p>By using Smart Expense Tracker, you agree to these terms. If you disagree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User Responsibilities</h2>
            <p>As a user, you agree to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide accurate information during registration</li>
              <li>Keep your account credentials secure</li>
              <li>Enter transactions accurately and honestly</li>
              <li>Not abuse or attempt to manipulate the system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Service Availability</h2>
            <p>SET is provided "as is" during the development phase. We strive to maintain high availability but may occasionally experience downtime for maintenance and updates.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Termination</h2>
            <p>We reserve the right to restrict or terminate access for:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Violation of these terms</li>
              <li>Abuse of the system</li>
              <li>Suspicious or fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
            <p>For questions about these terms, contact: <a href="mailto:manziluckyun@gmail.com" className="text-primary-600 hover:underline">manziluckyun@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}

