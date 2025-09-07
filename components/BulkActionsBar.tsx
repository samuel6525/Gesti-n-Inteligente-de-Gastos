
import React from 'react';
import { CheckCircleIcon, TrashIcon, XCircleIcon } from './icons';

interface BulkActionsBarProps {
  count: number;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ count, onApprove, onReject, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mb-6 flex justify-between items-center animate-fade-in-down">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        <span className="bg-kimi-green text-white rounded-full h-6 w-6 inline-flex items-center justify-center mr-2">{count}</span>
        {count === 1 ? 'gasto seleccionado' : 'gastos seleccionados'}
      </p>
      <div className="space-x-2">
        <button
          onClick={onApprove}
          className="flex items-center justify-center bg-white dark:bg-gray-800 text-kimi-green dark:text-green-400 font-bold py-2 px-4 rounded-lg border-2 border-kimi-green dark:border-green-400 hover:bg-kimi-green hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kimi-green-dark transition-all duration-200"
        >
          <CheckCircleIcon className="mr-2" />
          Aprobar
        </button>
        <button
          onClick={onReject}
          className="flex items-center justify-center bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 font-bold py-2 px-4 rounded-lg border-2 border-red-500 dark:border-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-400 dark:hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-all duration-200"
        >
          <XCircleIcon className="mr-2" />
          Rechazar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
        >
          <TrashIcon className="mr-2" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;