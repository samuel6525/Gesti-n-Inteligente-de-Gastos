
import React, { useMemo } from 'react';
import { CATEGORY_ICONS } from '../constants';

interface CategoryPieChartProps {
  data: Record<string, number>;
}

const COLORS = ['#16a34a', '#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const { pieData, total } = useMemo(() => {
    const total = Object.values(data).reduce((sum, amount) => sum + amount, 0);
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    
    let cumulativePercentage = 0;
    const pieData = sortedData.map(([category, amount], index) => {
      const percentage = total > 0 ? (amount / total) * 100 : 0;
      const item = {
        category,
        amount,
        percentage,
        color: COLORS[index % COLORS.length],
        offset: cumulativePercentage,
      };
      cumulativePercentage += percentage;
      return item;
    });
    return { pieData, total };
  }, [data]);

  if (total === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No hay datos para mostrar en el gráfico.</p>;
  }
  
  const gradient = pieData.map(d => `${d.color} ${d.offset}% ${d.offset + d.percentage}%`).join(', ');

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
      <div 
        className="w-40 h-40 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
        role="img"
        aria-label="Gráfico de pastel de gastos por categoría"
      ></div>
      <ul className="space-y-2 text-sm">
        {pieData.map(item => (
          <li key={item.category} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
            <span className="font-semibold text-gray-700 dark:text-gray-300 mr-1">{CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS]} {item.category}:</span>
            <span className="text-gray-500 dark:text-gray-400">{item.percentage.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPieChart;