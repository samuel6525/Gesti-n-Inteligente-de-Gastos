import React, { useState, useMemo, useCallback } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus, Receipt } from './types';
import { EXPENSE_CATEGORIES } from './constants';
import ExpenseTable from './components/ExpenseTable';
import Summary from './components/Summary';
import InstructionsModal from './components/InstructionsModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import BulkActionsBar from './components/BulkActionsBar';
import Filters from './components/Filters';
import { DownloadIcon, HelpIcon, SaveIcon } from './components/icons';

const App: React.FC = () => {
  const getInitialDate = () => new Date().toISOString().split('T')[0];
  
  const getInitialExpenses = useCallback((): Expense[] => {
    try {
      const savedExpenses = localStorage.getItem('kimi-expense-report');
      if (savedExpenses) {
        const parsedExpenses = JSON.parse(savedExpenses);
        if (Array.isArray(parsedExpenses) && parsedExpenses.length > 0) {
          return parsedExpenses.map(exp => ({ ...exp, status: exp.status || ExpenseStatus.PENDIENTE }));
        }
      }
    } catch (error) {
      console.error("Failed to parse expenses from localStorage", error);
    }
    return [
      { id: crypto.randomUUID(), date: getInitialDate(), description: 'Vuelos a conferencia', category: ExpenseCategory.VIAJES, amount: 4500.00, status: ExpenseStatus.PENDIENTE },
      { id: crypto.randomUUID(), date: getInitialDate(), description: 'Comida con equipo de ventas', category: ExpenseCategory.COMIDAS, amount: 1250.50, status: ExpenseStatus.APROBADO },
    ];
  }, []);

  const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [newExpenseId, setNewExpenseId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const searchTermMatch = expense.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const categoryMatch = filters.category === 'all' || expense.category === filters.category;
      const statusMatch = filters.status === 'all' || expense.status === filters.status;
      
      let dateMatch = true;
      if (filters.startDate && filters.endDate) {
        dateMatch = expense.date >= filters.startDate && expense.date <= filters.endDate;
      } else if (filters.startDate) {
        dateMatch = expense.date >= filters.startDate;
      } else if (filters.endDate) {
        dateMatch = expense.date <= filters.endDate;
      }

      return searchTermMatch && categoryMatch && statusMatch && dateMatch;
    });
  }, [expenses, filters]);

  const totalFilteredExpenses = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [filteredExpenses]);

  const showNotification = useCallback((message: string, type: 'success' | 'error', duration: number = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }, []);

  const handleAddExpense = useCallback(() => {
    const newId = crypto.randomUUID();
    const newExpense: Expense = {
      id: newId,
      date: getInitialDate(),
      description: '',
      category: ExpenseCategory.VIAJES,
      amount: 0,
      status: ExpenseStatus.PENDIENTE,
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    setNewExpenseId(newId);
    setTimeout(() => setNewExpenseId(null), 1500);
  }, []);

  const handleUpdateExpense = useCallback((id: string, field: keyof Expense, value: string | number | ExpenseCategory | ExpenseStatus | Receipt | undefined) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  }, []);

  const handleRequestDelete = useCallback((id: string) => {
    setExpenseToDelete(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (expenseToDelete) {
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseToDelete));
      setExpenseToDelete(null);
    }
  }, [expenseToDelete]);

  const handleCancelDelete = useCallback(() => {
    setExpenseToDelete(null);
  }, []);
  
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('kimi-expense-report', JSON.stringify(expenses));
      showNotification('Informe guardado con éxito.', 'success');
    } catch (error) {
      console.error("Failed to save expenses to localStorage", error);
      showNotification('Error al guardar el informe.', 'error');
    }
  }, [expenses, showNotification]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedExpenseIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const filteredIds = filteredExpenses.map(ex => ex.id);
    const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedExpenseIds.includes(id));

    if (allFilteredSelected) {
      setSelectedExpenseIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedExpenseIds(prev => [...new Set([...prev, ...filteredIds])]);
    }
  }, [filteredExpenses, selectedExpenseIds]);

  const handleBulkApprove = useCallback(() => {
    setExpenses(prev =>
      prev.map(ex =>
        selectedExpenseIds.includes(ex.id) ? { ...ex, status: ExpenseStatus.APROBADO } : ex
      )
    );
    setSelectedExpenseIds([]);
  }, [selectedExpenseIds]);
  
  const handleBulkReject = useCallback(() => {
    setExpenses(prev =>
      prev.map(ex =>
        selectedExpenseIds.includes(ex.id) ? { ...ex, status: ExpenseStatus.RECHAZADO } : ex
      )
    );
    setSelectedExpenseIds([]);
  }, [selectedExpenseIds]);


  const handleConfirmBulkDelete = useCallback(() => {
    setExpenses(prev => prev.filter(ex => !selectedExpenseIds.includes(ex.id)));
    setSelectedExpenseIds([]);
    setIsBulkDeleteModalOpen(false);
  }, [selectedExpenseIds]);

  const exportToCSV = useCallback(() => {
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto', 'Estado', 'Factura Adjunta'];
    const rows = filteredExpenses.map(ex => 
        [ex.date, `"${ex.description.replace(/"/g, '""')}"`, ex.category, ex.amount.toFixed(2), ex.status, ex.receipt ? 'Sí' : 'No']
    );
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(',') + '\n' 
        + rows.map(e => e.join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "informe_de_gastos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredExpenses]);

  return (
    <div className="bg-kimi-gray min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Informe de Gastos Kimi</h1>
            <p className="text-lg text-gray-500">Genere y gestione sus envíos de gastos de empleado.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-500 hover:text-kimi-green transition-colors p-2 rounded-full hover:bg-gray-200"
              aria-label="Ayuda"
              title="Mostrar guía de usuario"
            >
              <HelpIcon />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center bg-kimi-green text-white font-bold py-2 px-4 rounded-lg hover:bg-kimi-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kimi-green-dark transition-all duration-200"
              title="Guardar el informe en el navegador"
            >
              <SaveIcon className="mr-2" />
              Guardar
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center bg-white text-kimi-green font-bold py-2 px-4 rounded-lg border-2 border-kimi-green hover:bg-kimi-green hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kimi-green-dark transition-all duration-200"
              title="Descargar el informe como archivo CSV"
            >
              <DownloadIcon className="mr-2" />
              Exportar a CSV
            </button>
          </div>
        </header>
        
        <main>
          {selectedExpenseIds.length > 0 && (
            <BulkActionsBar
              count={selectedExpenseIds.length}
              onApprove={handleBulkApprove}
              onReject={handleBulkReject}
              onDelete={() => setIsBulkDeleteModalOpen(true)}
            />
          )}
          <Filters 
            filters={filters}
            setFilters={setFilters}
            categories={EXPENSE_CATEGORIES}
            statuses={Object.values(ExpenseStatus)}
          />
          <Summary total={totalFilteredExpenses} />
          <ExpenseTable
            expenses={filteredExpenses}
            selectedIds={selectedExpenseIds}
            newExpenseId={newExpenseId}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onRequestDelete={handleRequestDelete}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            showNotification={showNotification}
          />
        </main>

        <footer className="text-center mt-8 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Kimi Corp. Todos los derechos reservados.</p>
        </footer>
      </div>
      <InstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={expenseToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Está seguro de que desea eliminar este gasto? Esta acción no se puede deshacer."
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Confirmar Eliminación Múltiple"
        message={`¿Está seguro de que desea eliminar los ${selectedExpenseIds.length} gastos seleccionados?`}
      />

      <Toast 
        message={notification?.message || ''} 
        type={notification?.type || 'success'} 
        show={notification !== null} 
      />
    </div>
  );
};

export default App;