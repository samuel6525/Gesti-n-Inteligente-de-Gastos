
import React, { useMemo } from 'react';
import { useI18n } from '../context/i18n';

interface MonthlyData {
  month: string;
  amount: number;
  trend: 'increase' | 'decrease' | 'same';
}

interface MonthlyTrendChartProps {
  data: MonthlyData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const { locale, t } = useI18n();

  const maxAmount = useMemo(() => Math.max(...data.map(d => d.amount), 0), [data]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: locale === 'es' ? 'MXN' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (data.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-10 h-64 flex items-center justify-center">No hay datos de gastos aprobados para mostrar.</p>;
  }

  return (
    <div className="h-64 flex items-end space-x-2 md:space-x-4" role="graphics-document" aria-label="Gráfico de evolución mensual de gastos">
      {data.map(({ month, amount, trend }) => {
        const heightPercentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
        const barColor = trend === 'increase' ? 'bg-red-400' : trend === 'decrease' ? 'bg-green-400' : 'bg-blue-400';
        const monthDate = new Date(`${month}-02`);
        const monthName = t(`monthsShort.${monthDate.getMonth()}`);
        
        return (
          <div key={month} className="flex-1 h-full flex flex-col items-center justify-end group">
            <div className="relative w-full h-full flex items-end">
                <div 
                    className={`w-full rounded-t-md transition-all duration-300 ease-in-out transform group-hover:scale-105 ${barColor}`}
                    style={{ height: `${heightPercentage}%` }}
                >
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none">
                        {formatCurrency(amount)}
                    </div>
                </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{monthName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MonthlyTrendChart;