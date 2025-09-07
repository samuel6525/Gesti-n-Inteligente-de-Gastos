
import React, { useMemo } from 'react';
import { CATEGORY_ICONS } from '../constants';
import { useI18n } from '../context/i18n';

interface CategoryBarChartProps {
  data: Record<string, number>;
}

const COLORS = ['#16a34a', '#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'];

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  const { locale } = useI18n();

  const { chartData, maxAmount } = useMemo(() => {
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maxAmount = Math.max(...sortedData.map(([, amount]) => amount), 0);
    
    const chartData = sortedData.map(([category, amount], index) => ({
      category,
      amount,
      percentage: maxAmount > 0 ? (amount / maxAmount) * 100 : 0,
      color: COLORS[index % COLORS.length],
    }));
    return { chartData, maxAmount };
  }, [data]);

  if (chartData.length === 0) {
     return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No hay datos para mostrar en el gráfico.</p>;
  }
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: locale === 'es' ? 'MXN' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="space-y-4">
      {chartData.map(item => (
        <div key={item.category} className="flex items-center gap-3 group">
          <div className="w-24 text-right text-sm text-gray-600 dark:text-gray-400 truncate">{CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS]} {item.category}</div>
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6">
            <div
              className="h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end px-2"
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
            >
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {formatCurrency(item.amount)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBarChart;