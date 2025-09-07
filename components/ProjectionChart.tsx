
import React, { useMemo } from 'react';
import { useI18n } from '../context/i18n';

interface ChartData {
  month: string;
  amount: number;
}

interface ProjectionChartProps {
  historicalData: ChartData[];
  projectedData: ChartData[];
  budget: number;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ historicalData, projectedData, budget }) => {
  const { locale, t } = useI18n();

  const combinedData = useMemo(() => {
    return [
      ...historicalData.map(d => ({ ...d, type: 'historical' as const })),
      ...projectedData.map(d => ({ ...d, type: 'projected' as const }))
    ];
  }, [historicalData, projectedData]);

  const maxAmount = useMemo(() => Math.max(...combinedData.map(d => d.amount), budget, 0), [combinedData, budget]);
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: locale === 'es' ? 'MXN' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="h-96 relative" role="graphics-document" aria-label={t('projectionChartTitle')}>
      {/* Budget Line */}
      {budget > 0 && maxAmount > 0 && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed z-10"
            style={{ bottom: `${(budget / maxAmount) * 100}%` }}
            title={t('tooltipBudget', { amount: formatCurrency(budget) })}
          >
            <span className="absolute -right-2 -translate-y-1/2 text-xs text-red-500 bg-white dark:bg-gray-800 px-1 pointer-events-none">{formatCurrency(budget)}</span>
          </div>
      )}

      <div className="h-full flex items-end space-x-2 md:space-x-4">
        {combinedData.map(({ month, amount, type }) => {
          const heightPercentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
          const monthDate = new Date(`${month}-02`);
          const monthName = t(`monthsShort.${monthDate.getMonth()}`);
          
          return (
            <div key={month} className="flex-1 h-full flex flex-col items-center justify-end group">
              <div className="relative w-full h-full flex items-end">
                  <div 
                      className={`w-full rounded-t-md transition-all duration-300 ease-in-out transform group-hover:opacity-80
                        ${type === 'historical' ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-800'}`
                      }
                      style={{ height: `${heightPercentage}%`,
                               ...(type === 'projected' && { backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.2) 10px, rgba(255, 255, 255, 0.2) 20px)` })
                             }}
                  >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-700 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg pointer-events-none z-20 whitespace-nowrap">
                          <p><strong>{type === 'historical' ? t('tooltipHistorical') : t('tooltipProjected')}</strong></p>
                          <p>{formatCurrency(amount)}</p>
                      </div>
                  </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{monthName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectionChart;
