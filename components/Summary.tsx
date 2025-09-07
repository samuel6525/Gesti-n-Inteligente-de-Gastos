
import React from 'react';
import { useI18n } from '../context/i18n';

interface SummaryProps {
  total: number;
}

const Summary: React.FC<SummaryProps> = ({ total }) => {
  const { locale } = useI18n();

  const formattedTotal = new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: locale === 'es' ? 'MXN' : 'USD',
  }).format(total);

  return (
    <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-green-200 dark:border-green-900">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Gasto Total</h2>
        <p className="text-4xl font-bold text-kimi-green dark:text-green-400">{formattedTotal}</p>
      </div>
    </div>
  );
};

export default Summary;