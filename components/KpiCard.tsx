
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  isAlert?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, description, isAlert = false }) => {
  const borderColor = isAlert ? 'border-red-200 dark:border-red-500/30' : 'border-gray-200 dark:border-gray-700';
  const bgColor = isAlert ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800';

  return (
    <div className={`p-6 rounded-lg shadow-md border ${borderColor} ${bgColor}`}>
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-600 dark:text-gray-300">{title}</h3>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
};

export default KpiCard;