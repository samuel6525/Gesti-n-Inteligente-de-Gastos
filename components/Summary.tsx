import React from 'react';

interface SummaryProps {
  total: number;
}

const Summary: React.FC<SummaryProps> = ({ total }) => {
  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(total);

  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-md mb-6 border border-green-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-600">Gasto Total</h2>
        <p className="text-4xl font-bold text-kimi-green">{formattedTotal}</p>
      </div>
    </div>
  );
};

export default Summary;