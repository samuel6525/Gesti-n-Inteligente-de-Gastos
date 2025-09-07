
import React, { useMemo } from 'react';
import { Expense, ExpenseStatus } from '../types';
import KpiCard from './KpiCard';
import CategoryPieChart from './CategoryPieChart';
import CategoryBarChart from './CategoryBarChart';
import MonthlyTrendChart from './MonthlyTrendChart';
import { CheckCircleIcon, ExclamationCircleIcon, PaperclipIcon } from './icons';
import { useI18n } from '../context/i18n';

interface DashboardProps {
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const { locale } = useI18n();

  const {
    totalApproved,
    totalPending,
    receiptPercentage,
    receiptCount,
    expensesWithoutReceipt,
    topExpenses,
    categoryData,
    monthlyData,
  } = useMemo(() => {
    const approved = expenses.filter(e => e.status === ExpenseStatus.APROBADO);
    const pending = expenses.filter(e => e.status === ExpenseStatus.PENDIENTE);

    const totalApproved = approved.reduce((sum, e) => sum + e.amount, 0);
    const totalPending = pending.reduce((sum, e) => sum + e.amount, 0);

    const receiptCount = expenses.filter(e => e.receipt).length;
    const receiptPercentage = expenses.length > 0 ? (receiptCount / expenses.length) * 100 : 0;
    const expensesWithoutReceipt = expenses.length - receiptCount;

    const topExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

    const categoryData = approved.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyExpenses = approved.reduce((acc, { date, amount }) => {
        const month = date.substring(0, 7); // YYYY-MM
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += amount;
        return acc;
    }, {} as Record<string, number>);

    const sortedMonths = Object.keys(monthlyExpenses).sort();

    let lastMonthAmount = 0;
    const monthlyData = sortedMonths.map((month, index) => {
        const amount = monthlyExpenses[month];
        let trend: 'increase' | 'decrease' | 'same' = 'same';
        if (index > 0) {
            if (amount > lastMonthAmount) trend = 'increase';
            else if (amount < lastMonthAmount) trend = 'decrease';
        }
        lastMonthAmount = amount;
        return { month, amount, trend };
    });


    return { totalApproved, totalPending, receiptPercentage, expensesWithoutReceipt, topExpenses, categoryData, receiptCount, monthlyData };
  }, [expenses]);
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', { style: 'currency', currency: locale === 'es' ? 'MXN' : 'USD' }).format(amount);

  return (
    <div className="space-y-6 animate-fade-in-down">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Gasto Total Aprobado"
          value={formatCurrency(totalApproved)}
          icon={<CheckCircleIcon className="text-green-500" />}
          description="Suma de todos los gastos aprobados"
        />
        <KpiCard
          title="Gastos Pendientes"
          value={formatCurrency(totalPending)}
          icon={<ExclamationCircleIcon className="text-yellow-500" />}
          description="Suma de gastos esperando aprobación"
        />
        <KpiCard
          title="% de Gastos con Factura"
          value={`${receiptPercentage.toFixed(1)}%`}
          icon={<PaperclipIcon className="text-blue-500" />}
          description={`${receiptCount} de ${expenses.length} gastos tienen factura`}
        />
        <KpiCard
          title="Gastos sin Factura"
          value={expensesWithoutReceipt.toString()}
          icon={<ExclamationCircleIcon className="text-red-500" />}
          description="Gastos que requieren una factura"
          isAlert={expensesWithoutReceipt > 0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Gastos por Categoría (Distribución)</h3>
           <CategoryPieChart data={categoryData} />
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Gastos por Categoría (Total)</h3>
            <CategoryBarChart data={categoryData} />
        </div>
      </div>
      
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Evolución Mensual de Gastos (Aprobados)</h3>
        <MonthlyTrendChart data={monthlyData} />
      </div>

      {/* Top Expenses */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Top 5 Gastos de Mayor Valor</h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {topExpenses.length > 0 ? topExpenses.map(expense => (
                <li key={expense.id} className="py-3 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{expense.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category} - {expense.date}</p>
                    </div>
                    <p className="font-bold text-lg text-kimi-green dark:text-green-400">{formatCurrency(expense.amount)}</p>
                </li>
            )) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay gastos para mostrar.</p>
            )}
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;