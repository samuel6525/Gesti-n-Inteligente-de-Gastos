import React, { useEffect, useRef, useState } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus, Receipt } from '../types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../constants';
import { TrashIcon, CheckCircleIcon, XCircleIcon, PaperclipIcon } from './icons';
import DatePicker from './DatePicker';
import { useI18n } from '../context/i18n';

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};


interface ExpenseTableRowProps {
    expense: Expense;
    isSelected: boolean;
    isNew: boolean;
    onUpdateExpense: (id: string, field: keyof Expense, value: string | number | ExpenseCategory | ExpenseStatus | Receipt | undefined | null) => void;
    onRequestDelete: (id: string) => void;
    onToggleSelect: (id: string) => void;
    showNotification: (messageKey: string, type: 'success' | 'error') => void;
}

const ExpenseTableRow: React.FC<ExpenseTableRowProps> = ({ expense, isSelected, isNew, onUpdateExpense, onRequestDelete, onToggleSelect, showNotification }) => {
    const { t } = useI18n();
    const [isJustApproved, setIsJustApproved] = useState(false);
    const prevStatus = usePrevious(expense.status);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (prevStatus === ExpenseStatus.PENDIENTE && expense.status === ExpenseStatus.APROBADO) {
            setIsJustApproved(true);
            const timer = setTimeout(() => setIsJustApproved(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [expense.status, prevStatus]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let finalValue: string | number | null = value;
        if (name === 'amount') {
            finalValue = parseFloat(value) || 0;
        }
        if (name === 'otherCategoryDetail' && value === '') {
            finalValue = null;
        }

        onUpdateExpense(expense.id, name as keyof Expense, finalValue);
    };

    const handleDateChange = (newDate: string) => {
      onUpdateExpense(expense.id, 'date', newDate);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        e.target.value = '';

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (file.size > MAX_SIZE) {
            showNotification('notifications.fileSizeError', 'error');
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            showNotification('notifications.fileTypeError', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const newReceipt: Receipt = {
                name: file.name,
                type: file.type,
                data: reader.result as string,
            };
            onUpdateExpense(expense.id, 'receipt', newReceipt);
        };
        reader.onerror = () => {
            showNotification('notifications.fileReadError', 'error');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveReceipt = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onUpdateExpense(expense.id, 'receipt', undefined);
    };

    const isDescriptionInvalid = expense.description.trim() === '';
    const isAmountInvalid = expense.amount <= 0;

    let rowClasses = `border-b border-gray-200 dark:border-gray-700 transition-colors`;
    if (isSelected) {
        rowClasses += ' bg-blue-50 dark:bg-blue-900/20';
    } else if (expense.status === ExpenseStatus.APROBADO) {
        rowClasses += ' bg-green-50/70 dark:bg-green-900/20';
    } else if (expense.status === ExpenseStatus.RECHAZADO) {
        rowClasses += ' bg-red-50/70 dark:bg-red-900/20';
    } else {
        rowClasses += ' hover:bg-gray-50 dark:hover:bg-gray-700/50';
    }
    if (isNew) {
        rowClasses += ' animate-row-in';
    }
    if (isJustApproved) {
        rowClasses += ' animate-flash-green';
    }


    return (
        <tr className={rowClasses}>
            <td className="py-5 px-3 w-12 text-center">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-kimi-green focus:ring-kimi-green dark:bg-gray-700 dark:checked:bg-kimi-green"
                    checked={isSelected}
                    onChange={() => onToggleSelect(expense.id)}
                    aria-label={t('table.selectExpenseAria', { description: expense.description })}
                />
            </td>
            <td className="py-5 px-3">
                <DatePicker 
                  selectedDate={expense.date}
                  onChange={handleDateChange}
                />
            </td>
            <td className="py-5 px-3">
                <input
                    type="text"
                    name="description"
                    placeholder={t('table.descriptionPlaceholder')}
                    value={expense.description}
                    onChange={handleInputChange}
                    className={`w-full p-2 bg-white dark:bg-gray-700 border rounded-md focus:ring-2 focus:border-transparent text-sm text-gray-900 dark:text-gray-100 ${isDescriptionInvalid ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-kimi-green'}`}
                />
            </td>
            <td className="py-5 px-3">
                <select
                    name="category"
                    value={expense.category}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
                >
                    {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {t(`categories.${cat}`)}</option>)}
                </select>
                {expense.category === ExpenseCategory.OTROS && (
                    <input
                        type="text"
                        name="otherCategoryDetail"
                        placeholder={t('table.specifyPlaceholder')}
                        value={expense.otherCategoryDetail || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
                    />
                )}
            </td>
            <td className="py-5 px-3">
                 <input
                    type="text"
                    name="invoiceNumber"
                    placeholder={t('table.invoiceNumberPlaceholder')}
                    value={expense.invoiceNumber || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm text-gray-900 dark:text-gray-100"
                />
            </td>
            <td className="py-5 px-3">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">$</span>
                    <input
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        value={expense.amount}
                        onChange={handleInputChange}
                        className={`w-full p-2 pl-7 bg-white dark:bg-gray-700 border rounded-md focus:ring-2 focus:border-transparent text-sm text-gray-900 dark:text-gray-100 ${isAmountInvalid ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-kimi-green'}`}
                        min="0"
                        step="0.01"
                    />
                </div>
            </td>
             <td className="py-5 px-3">
                {expense.status === ExpenseStatus.APROBADO ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                        <CheckCircleIcon className="mr-1.5" /> {t('statuses.Aprobado')}
                    </span>
                ) : expense.status === ExpenseStatus.RECHAZADO ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                        <XCircleIcon className="mr-1.5" /> {t('statuses.Rechazado')}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                        {t('statuses.Pendiente')}
                    </span>
                )}
            </td>
            <td className="py-5 px-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                />
                {expense.receipt ? (
                    <div className="flex items-center justify-between text-sm">
                        <a
                            href={expense.receipt.data}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-kimi-green dark:text-green-400 hover:underline truncate max-w-[120px]"
                            title={expense.receipt.name}
                        >
                            <PaperclipIcon className="inline h-4 w-4 mr-1 flex-shrink-0"/>
                            <span className="truncate">{expense.receipt.name}</span>
                        </a>
                        <button
                            onClick={handleRemoveReceipt}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 flex-shrink-0"
                            aria-label={t('table.removeReceiptAria')}
                        >
                            <TrashIcon className="h-4 w-4"/>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAttachClick}
                        className="flex items-center text-sm text-kimi-green dark:text-green-400 hover:text-kimi-green-dark dark:hover:text-green-300 font-semibold"
                    >
                        <PaperclipIcon className="mr-1 h-4 w-4" />
                        {t('table.attach')}
                    </button>
                )}
            </td>
            <td className="py-5 px-3 text-center">
                <button 
                    onClick={() => onRequestDelete(expense.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                    aria-label={t('table.deleteExpenseAria')}
                >
                    <TrashIcon />
                </button>
            </td>
        </tr>
    );
};

export default ExpenseTableRow;