import React, { useRef, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus, Receipt } from '../types';
import { PlusIcon } from './icons';
import ExpenseTableRow from './ExpenseTableRow';
import { useI18n } from '../context/i18n';

interface ExpenseTableProps {
  expenses: Expense[];
  selectedIds: string[];
  newExpenseId: string | null;
  onAddExpense: () => void;
  onUpdateExpense: (id: string, field: keyof Expense, value: string | number | ExpenseCategory | ExpenseStatus | Receipt | undefined) => void;
  onRequestDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, selectedIds, newExpenseId, onAddExpense, onUpdateExpense, onRequestDelete, onToggleSelect, onToggleSelectAll, showNotification }) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const numSelected = selectedIds.length;
      const numExpenses = expenses.length;
      selectAllCheckboxRef.current.checked = numSelected === numExpenses && numExpenses > 0;
      selectAllCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numExpenses;
    }
  }, [selectedIds, expenses.length]);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="p-3 w-12 text-center">
                 <input
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-kimi-green focus:ring-kimi-green dark:bg-gray-700 dark:checked:bg-kimi-green"
                    onChange={onToggleSelectAll}
                    aria-label="Seleccionar todos los gastos"
                />
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.date')}</th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.description')}</th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.category')}</th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.invoiceNumber')}</th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.amount')}</th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.status')}</th>
              <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">{t('table.receipt')}</th>
              <th className="p-3 text-center text-sm font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <ExpenseTableRow 
                key={expense.id} 
                expense={expense}
                isSelected={selectedIds.includes(expense.id)}
                isNew={newExpenseId === expense.id}
                onUpdateExpense={onUpdateExpense}
                onRequestDelete={onRequestDelete}
                onToggleSelect={onToggleSelect}
                showNotification={showNotification}
              />
            ))}
          </tbody>
        </table>
      </div>
       {expenses.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>{t('table.noExpenses')}</p>
          <p>{t('table.addExpensePrompt')}</p>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={onAddExpense}
          className="flex items-center justify-center bg-kimi-green text-white font-bold py-2 px-4 rounded-lg hover:bg-kimi-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kimi-green-dark transition-all duration-200"
        >
          <PlusIcon className="mr-2" />
          {t('table.addExpense')}
        </button>
      </div>
    </div>
  );
};

export default ExpenseTable;