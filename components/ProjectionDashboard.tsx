
import React, { useMemo } from 'react';
import { Expense, ExpenseStatus } from '../types';
import { useI18n } from '../context/i18n';
import ProjectionChart from './ProjectionChart';

interface ProjectionDashboardProps {
  expenses: Expense[];
  budget: number;
  setBudget: (value: number) => void;
}

const ProjectionDashboard: React.FC<ProjectionDashboardProps> = ({ expenses, budget, setBudget }) => {
  const { t, locale } = useI18n();
  
  const { historicalData, projectedData, analysis } = useMemo(() => {
    const approved = expenses.filter(e => e.status === ExpenseStatus.APROBADO);
    
    const monthlyExpenses: Record<string, number> = {};
    for (const { date, amount } of approved) {
        const month = date.substring(0, 7);
        monthlyExpenses[month] = (monthlyExpenses[month] || 0) + amount;
    }
    
    const sortedMonths = Object.keys(monthlyExpenses).sort().slice(-6); // Last 6 months
    if (sortedMonths.length === 0) {
        return { historicalData: [], projectedData: [], analysis: { avg: 0, trend: 0, totalProjected: 0 } };
    }

    const historicalData = sortedMonths.map(month => ({
        month,
        amount: monthlyExpenses[month],
    }));

    // Projection Logic
    let monthlyChanges: number[] = [];
    for (let i = 1; i < historicalData.length; i++) {
        const change = historicalData[i].amount - historicalData[i-1].amount;
        monthlyChanges.push(change);
    }

    const averageChange = monthlyChanges.reduce((a, b) => a + b, 0) / (monthlyChanges.length || 1);
    const lastAmount = historicalData[historicalData.length - 1].amount;

    const projectedData = [];
    let currentAmount = lastAmount;
    const lastDate = new Date(`${sortedMonths[sortedMonths.length - 1]}-02`);

    for (let i = 1; i <= 3; i++) {
        currentAmount += averageChange;
        const nextDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + i, 1);
        projectedData.push({
            month: nextDate.toISOString().substring(0, 7),
            amount: Math.max(0, currentAmount), // Ensure projection is not negative
        });
    }

    const totalHistorical = historicalData.reduce((sum, d) => sum + d.amount, 0);
    const avg = totalHistorical / (historicalData.length || 1);
    const totalProjected = projectedData.reduce((sum, d) => sum + d.amount, 0);

    return { historicalData, projectedData, analysis: { avg, trend: averageChange, totalProjected } };

  }, [expenses]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: locale === 'es' ? 'MXN' : 'USD',
  }).format(amount);

  return (
    <div className="space-y-6 animate-fade-in-down">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('projectionDashboard.title')}</h2>
        <div className="flex items-center space-x-4">
            <label htmlFor="budget" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('projectionDashboard.monthlyBudgetLabel')}:</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">$</span>
                <input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                    className="w-48 p-2 pl-7 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
                />
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('projectionDashboard.chartTitle')}</h3>
           {historicalData.length < 2 ? (
                <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">{t('projectionDashboard.noData')}</div>
           ) : (
                <ProjectionChart historicalData={historicalData} projectedData={projectedData} budget={budget} />
           )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{t('projectionDashboard.analysisTitle')}</h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('projectionDashboard.avgSpendLabel')}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(analysis.avg)}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('projectionDashboard.trendLabel')}</p>
                    <p className={`text-2xl font-bold ${analysis.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {formatCurrency(analysis.trend)} ({analysis.trend > 0 ? t('projectionDashboard.increase') : analysis.trend < 0 ? t('projectionDashboard.decrease') : t('projectionDashboard.stable')})
                    </p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('projectionDashboard.projectedSpendLabel')}</p>
                    <p className="text-2xl font-bold text-blue-500">{formatCurrency(analysis.totalProjected)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionDashboard;
