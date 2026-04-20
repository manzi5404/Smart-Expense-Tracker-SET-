import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/formatters'

function MonthlyTrend({ data }) {
  const processedData = data.map(item => ({
    ...item,
    balance: item.income - item.expenses
  }))

  return (
    <Card>
      <Card.Header>
        <Card.Title>Monthly Trend</Card.Title>
        <Card.Description>Your financial journey over time</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9CA3AF"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorExpenses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Income</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(data.reduce((sum, d) => sum + d.income, 0) / data.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(data.reduce((sum, d) => sum + d.expenses, 0) / data.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Savings</p>
            <p className="text-lg font-semibold text-primary-600">
              {formatCurrency(processedData.reduce((sum, d) => sum + d.balance, 0) / processedData.length)}
            </p>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default MonthlyTrend