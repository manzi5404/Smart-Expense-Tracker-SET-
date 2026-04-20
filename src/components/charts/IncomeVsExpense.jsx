import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/formatters'

function IncomeVsExpense({ data }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Income vs Expenses</Card.Title>
        <Card.Description>Monthly comparison</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <Bar
                dataKey="income"
                name="Income"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  )
}

export default IncomeVsExpense