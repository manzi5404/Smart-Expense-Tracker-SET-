export const FINANCIAL_TIPS = {
  weekly: [
    {
      id: 'weekly_1',
      type: 'weekly',
      title: 'Daily Spending Habit',
      shortMessage: 'Track your spending daily to identify patterns.',
      message: 'Tracking your daily expenses helps you understand where your money goes. Small daily purchases can add up to significant amounts over time.',
      learnMore: true,
      icon: 'TrendingUp'
    },
    {
      id: 'weekly_2',
      type: 'weekly',
      title: 'Weekend Spending Alert',
      shortMessage: 'Your weekend spending is higher than weekdays.',
      message: 'Many users find that weekend spending spikes significantly. Consider setting a weekend budget to keep your finances on track.',
      learnMore: true,
      icon: 'Calendar'
    },
    {
      id: 'weekly_3',
      type: 'weekly',
      title: 'Daily Coffee Habit',
      shortMessage: 'Daily coffee purchases add up quickly.',
      message: 'That daily coffee might cost you more than you think. Consider brewing at home a few days a week to save hundreds monthly.',
      learnMore: true,
      icon: 'Coffee'
    },
    {
      id: 'weekly_4',
      type: 'weekly',
      title: 'Quick Expense Check',
      shortMessage: 'Review your spending weekly for better control.',
      message: 'A quick weekly review of your expenses helps you stay accountable. Set aside 10 minutes each week to check your transactions.',
      learnMore: true,
      icon: 'Clock'
    }
  ],
  monthly: [
    {
      id: 'monthly_1',
      type: 'monthly',
      title: 'Category Spending Trend',
      shortMessage: 'One category dominates your monthly expenses.',
      message: 'Analysis of your transactions shows a dominant spending category. Reviewing this can help identify potential savings areas.',
      learnMore: true,
      icon: 'PieChart'
    },
    {
      id: 'monthly_2',
      type: 'monthly',
      title: 'Budget Alert',
      shortMessage: 'Approaching your budget limit this month.',
      message: 'Your current spending trajectory suggests you may exceed your budget. Consider reducing non-essential expenses in the remaining days.',
      learnMore: true,
      icon: 'AlertTriangle'
    },
    {
      id: 'monthly_3',
      type: 'monthly',
      title: 'Savings Opportunity',
      shortMessage: 'You could save more by reducing dining out.',
      message: 'Dining out expenses are a significant portion of your monthly spending. Cooking at home more often could save you a substantial amount.',
      learnMore: true,
      icon: 'Utensils'
    },
    {
      id: 'monthly_4',
      type: 'monthly',
      title: 'Subscription Review',
      shortMessage: 'Review your subscriptions this month.',
      message: 'Monthly subscriptions can silently drain your budget. Review all active subscriptions and cancel those you rarely use.',
      learnMore: true,
      icon: 'RefreshCw'
    }
  ],
  yearly: [
    {
      id: 'yearly_1',
      type: 'yearly',
      title: 'Annual Financial Health',
      shortMessage: 'Your yearly financial overview looks positive.',
      message: 'Looking at your annual data shows your overall financial health. Positive savings rate indicates good financial habits.',
      learnMore: true,
      icon: 'Award'
    },
    {
      id: 'yearly_2',
      type: 'yearly',
      title: 'Long-term Savings Growth',
      shortMessage: 'Your savings have grown significantly this year.',
      message: 'Consistent saving habits have contributed to your financial growth. Continue this trend for long-term financial security.',
      learnMore: true,
      icon: 'TrendingUp'
    },
    {
      id: 'yearly_3',
      type: 'yearly',
      title: 'Yearly Spending Pattern',
      shortMessage: 'Holiday seasons drive your biggest expenses.',
      message: 'Your annual spending shows clear patterns during holiday periods. Planning ahead for these seasons can help manage costs better.',
      learnMore: true,
      icon: 'Gift'
    },
    {
      id: 'yearly_4',
      type: 'yearly',
      title: 'Income Growth',
      shortMessage: 'Your income has increased this year.',
      message: 'Congratulations! Your income has grown compared to last year. Consider allocating a portion to savings or investments.',
      learnMore: true,
      icon: 'Briefcase'
    }
  ]
};

export const getTipForPeriod = (period, transactionStats = {}) => {
  const tips = FINANCIAL_TIPS[period] || FINANCIAL_TIPS.monthly;
  const { totalExpenses = 0, totalIncome = 0, topCategory = null } = transactionStats;
  
  let selectedTip = tips[Math.floor(Math.random() * tips.length)];
  
  if (period === 'monthly' && totalExpenses > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate < 0) {
      selectedTip = tips.find(t => t.id === 'monthly_2') || selectedTip;
    } else if (topCategory === 'Food & Dining' || topCategory === 'food') {
      selectedTip = tips.find(t => t.id === 'monthly_3') || selectedTip;
    }
  }
  
  if (period === 'weekly' && totalExpenses > 50000) {
    selectedTip = tips.find(t => t.id === 'weekly_1') || selectedTip;
  }
  
  if (period === 'yearly' && totalIncome > totalExpenses) {
    selectedTip = tips.find(t => t.id === 'yearly_1') || selectedTip;
  }
  
  return selectedTip;
};

export const generateAIInsight = (period, transactions = [], stats = {}) => {
  const { totalIncome = 0, totalExpenses = 0, categoryBreakdown = {}, incomeCount = 0, expenseCount = 0 } = stats;
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;
  const topSpendingCategory = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)[0];
  
  const insights = [];
  
  insights.push({
    title: 'Spending Overview',
    content: `During this ${period}, you had ${expenseCount} expense transactions totaling ${formatAmount(totalExpenses)}. Your income was ${formatAmount(totalIncome)}.`
  });
  
  if (savingsRate >= 20) {
    insights.push({
      title: 'Savings Achievement',
      content: `Great job! You're saving ${savingsRate}% of your income, which is above the recommended 20%. Keep it up!`
    });
  } else if (savingsRate >= 0) {
    insights.push({
      title: 'Savings Opportunity',
      content: `Your savings rate is ${savingsRate}%. Try to save at least 20% of your income for financial security.`
    });
  } else {
    insights.push({
      title: 'Spending Alert',
      content: `You're spending more than you earn. Review your expenses to identify areas to cut back.`
    });
  }
  
  if (topSpendingCategory) {
    const [category, amount] = topSpendingCategory;
    const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0;
    insights.push({
      title: 'Top Spending Category',
      content: `Your highest spending was ${category} at ${formatAmount(amount)} (${percentage}% of total expenses).`
    });
  }
  
  if (incomeCount > 0 && expenseCount > 0) {
    insights.push({
      title: 'Transaction Activity',
      content: `You had ${incomeCount} income and ${expenseCount} expense transactions this ${period}.`
    });
  }
  
  const recommendations = [];
  
  if (savingsRate < 20) {
    recommendations.push('Consider the 50/30/20 budget rule: 50% needs, 30% wants, 20% savings');
  }
  
  if (topSpendingCategory && ['Food & Dining', 'food', 'Entertainment', 'entertainment'].includes(topSpendingCategory[0])) {
    recommendations.push(`Look for ways to reduce ${topSpendingCategory[0]} expenses`);
  }
  
  if (expenseCount > 20) {
    recommendations.push('Track daily expenses to identify unexpected spending patterns');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue your current financial habits - they seem healthy!');
  }
  
  return {
    period,
    summary: {
      totalIncome,
      totalExpenses,
      savingsRate: parseFloat(savingsRate),
      transactionCount: incomeCount + expenseCount,
      topCategory: topSpendingCategory ? topSpendingCategory[0] : null
    },
    insights,
    recommendations
  };
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('RWF', 'FRW');
};

export default FINANCIAL_TIPS;
