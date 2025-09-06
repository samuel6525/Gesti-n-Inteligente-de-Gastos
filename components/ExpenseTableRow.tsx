import React, { useEffect, useRef, useState } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus, Receipt } from '../types';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../constants';
import { TrashIcon, CheckCircleIcon, XCircleIcon, PaperclipIcon } from './icons';
import DatePicker from './DatePicker';

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
    onUpdateExpense: (id: string, field: keyof Expense, value: string | number | ExpenseCategory | ExpenseStatus | Receipt | undefined) => void;
    onRequestDelete: (id: string) => void;
    onToggleSelect: (id: string) => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const ExpenseTableRow: React.FC<ExpenseTableRowProps> = ({ expense, isSelected, isNew, onUpdateExpense, onRequestDelete, onToggleSelect, showNotification }) => {
    
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
        const finalValue = name === 'amount' ? parseFloat(value) || 0 : value;
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

        e.target.value = ''; // Reset input to allow re-uploading the same file

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

        if (file.size > MAX_SIZE) {
            showNotification('El archivo supera el tamaño máximo de 5MB.', 'error');
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            showNotification('Formato no permitido. Use JPG, PNG o PDF.', 'error');
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
            showNotification('Error al leer el archivo.', 'error');
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

    let rowClasses = `border-b border-gray-200 transition-colors`;
    if (isSelected) {
        rowClasses += ' bg-blue-50';
    } else if (expense.status === ExpenseStatus.APROBADO) {
        rowClasses += ' bg-green-50/70';
    } else if (expense.status === ExpenseStatus.RECHAZADO) {
        rowClasses += ' bg-red-50/70';
    } else {
        rowClasses += ' hover:bg-gray-50';
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
                    className="h-4 w-4 rounded border-gray-300 text-kimi-green focus:ring-kimi-green"
                    checked={isSelected}
                    onChange={() => onToggleSelect(expense.id)}
                    aria-label={`Seleccionar gasto: ${expense.description}`}
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
                    placeholder="Ej. Cena con cliente"
                    value={expense.description}
                    onChange={handleInputChange}
                    className={`w-full p-2 bg-white border rounded-md focus:ring-2 focus:border-transparent text-sm text-gray-900 ${isDescriptionInvalid ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-kimi-green'}`}
                />
            </td>
            <td className="py-5 px-3">
                <select
                    name="category"
                    value={expense.category}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm text-gray-900"
                >
                    {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
                </select>
            </td>
            <td className="py-5 px-3">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        value={expense.amount}
                        onChange={handleInputChange}
                        className={`w-full p-2 pl-7 bg-white border rounded-md focus:ring-2 focus:border-transparent text-sm text-gray-900 ${isAmountInvalid ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-kimi-green'}`}
                        min="0"
                        step="0.01"
                    />
                </div>
            </td>
             <td className="py-5 px-3">
                {expense.status === ExpenseStatus.APROBADO ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1.5" /> Aprobado
                    </span>
                ) : expense.status === ExpenseStatus.RECHAZADO ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        <XCircleIcon className="mr-1.5" /> Rechazado
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                        Pendiente
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
                            className="text-kimi-green hover:underline truncate max-w-[120px]"
                            title={expense.receipt.name}
                        >
                            <PaperclipIcon className="inline h-4 w-4 mr-1 flex-shrink-0"/>
                            <span className="truncate">{expense.receipt.name}</span>
                        </a>
                        <button
                            onClick={handleRemoveReceipt}
                            className="text-gray-400 hover:text-red-500 ml-2 p-1 rounded-full hover:bg-red-100 flex-shrink-0"
                            aria-label="Eliminar factura"
                        >
                            <TrashIcon className="h-4 w-4"/>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAttachClick}
                        className="flex items-center text-sm text-kimi-green hover:text-kimi-green-dark font-semibold"
                    >
                        <PaperclipIcon className="mr-1 h-4 w-4" />
                        Adjuntar
                    </button>
                )}
            </td>
            <td className="py-5 px-3 text-center">
                <button 
                    onClick={() => onRequestDelete(expense.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-100"
                    aria-label="Eliminar gasto"
                >
                    <TrashIcon />
                </button>
            </td>
        </tr>
    );
};

export default ExpenseTableRow;