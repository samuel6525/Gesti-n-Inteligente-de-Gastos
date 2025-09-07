

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseStatus, Receipt } from './types';
import { EXPENSE_CATEGORIES } from './constants';
import ExpenseTable from './components/ExpenseTable';
import Summary from './components/Summary';
import InstructionsModal from './components/InstructionsModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import BulkActionsBar from './components/BulkActionsBar';
import Filters from './components/Filters';
import Dashboard from './components/Dashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import ProjectionDashboard from './components/ProjectionDashboard';
import { DownloadIcon, HelpIcon, SaveIcon, ChartBarIcon, TableCellsIcon, MoonIcon, SunIcon, TrendingUpIcon } from './components/icons';
import { useI18n } from './context/i18n';

type View = 'table' | 'dashboard' | 'projection';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { t } = useI18n();

  const getRelativeDate = (monthsAgo: number, day: number): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    date.setDate(day);
    return date.toISOString().split('T')[0];
  };

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
    // Generate expenses with dates relative to today
    return [
      { id: crypto.randomUUID(), date: getRelativeDate(5, 15), description: 'Vuelos a conferencia', category: ExpenseCategory.VIAJES, amount: 4500.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-001' },
      { id: crypto.randomUUID(), date: getRelativeDate(5, 20), description: 'Comida con equipo de ventas', category: ExpenseCategory.COMIDAS, amount: 1250.50, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-002' },
      { id: crypto.randomUUID(), date: getRelativeDate(4, 10), description: 'Suministros de Oficina', category: ExpenseCategory.SUMINISTROS, amount: 800.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-003' },
      { id: crypto.randomUUID(), date: getRelativeDate(4, 22), description: 'Transporte Aeropuerto', category: ExpenseCategory.TRANSPORTE, amount: 600.00, status: ExpenseStatus.APROBADO },
      { id: crypto.randomUUID(), date: getRelativeDate(3, 5), description: 'Hotel para viaje de negocios', category: ExpenseCategory.ALOJAMIENTO, amount: 6200.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-004' },
      { id: crypto.randomUUID(), date: getRelativeDate(3, 18), description: 'Cena con cliente potencial', category: ExpenseCategory.COMIDAS, amount: 1800.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-005' },
      { id: crypto.randomUUID(), date: getRelativeDate(2, 1), description: 'Software de diseño', category: ExpenseCategory.OTROS, otherCategoryDetail: 'Software', amount: 3000.00, status: ExpenseStatus.APROBADO },
      { id: crypto.randomUUID(), date: getRelativeDate(2, 25), description: 'Alquiler de coche', category: ExpenseCategory.TRANSPORTE, amount: 2500.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-006' },
      { id: crypto.randomUUID(), date: getRelativeDate(1, 12), description: 'Billetes de tren', category: ExpenseCategory.VIAJES, amount: 1500.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-007' },
      { id: crypto.randomUUID(), date: getRelativeDate(1, 28), description: 'Gastos de internet', category: ExpenseCategory.SUMINISTROS, amount: 750.00, status: ExpenseStatus.APROBADO },
      { id: crypto.randomUUID(), date: getRelativeDate(0, 7), description: 'Almuerzo de equipo', category: ExpenseCategory.COMIDAS, amount: 2100.00, status: ExpenseStatus.APROBADO, invoiceNumber: 'INV-008' },
      { id: crypto.randomUUID(), date: getRelativeDate(0, new Date().getDate()), description: 'Reporte pendiente', category: ExpenseCategory.OTROS, amount: 500.00, status: ExpenseStatus.PENDIENTE },
    ];
  }, []);

  const [expenses, setExpenses] = useState<Expense[]>(getInitialExpenses);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{messageKey: string, type: 'success' | 'error'} | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [newExpenseId, setNewExpenseId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('table');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        return 'dark';
      }
    }
    return 'light';
  });
  const [budget, setBudget] = useState<number>(() => {
    try {
        const item = window.localStorage.getItem('monthlyBudget');
        return item ? JSON.parse(item) : 10000;
    } catch (error) {
        return 10000;
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('monthlyBudget', JSON.stringify(budget));
    } catch (error) {
        console.error("Could not save budget to localStorage", error);
    }
  }, [budget]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const searchTermMatch =
        expense.description.toLowerCase().includes(searchTermLower) ||
        (expense.invoiceNumber && expense.invoiceNumber.toLowerCase().includes(searchTermLower)) ||
        (expense.receipt && expense.receipt.name.toLowerCase().includes(searchTermLower));
        
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

  const showNotification = useCallback((messageKey: string, type: 'success' | 'error', duration: number = 3000) => {
    setNotification({ messageKey, type });
    setTimeout(() => setNotification(null), duration);
  }, []);

  const handleAddExpense = useCallback(() => {
    const newId = crypto.randomUUID();
    const newExpense: Expense = {
      id: newId,
      date: getRelativeDate(0, new Date().getDate()),
      description: '',
      category: ExpenseCategory.VIAJES,
      amount: 0,
      status: ExpenseStatus.PENDIENTE,
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    setNewExpenseId(newId);
    setTimeout(() => setNewExpenseId(null), 1500);
  }, []);

  const handleUpdateExpense = useCallback((id: string, field: keyof Expense, value: string | number | ExpenseCategory | ExpenseStatus | Receipt | undefined | null) => {
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
      showNotification('notifications.saveSuccess', 'success');
    } catch (error) {
      console.error("Failed to save expenses to localStorage", error);
      showNotification('notifications.saveError', 'error');
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
    const headers = [
        t('csv.date'), 
        t('csv.description'), 
        t('csv.category'), 
        t('csv.invoiceNumber'),
        t('csv.amount'), 
        t('csv.status'), 
        t('csv.receiptAttached')
    ];
    const rows = filteredExpenses.map(ex => {
      const categoryDisplay = ex.category === ExpenseCategory.OTROS && ex.otherCategoryDetail
        ? `${t(`categories.${ex.category}`)} (${ex.otherCategoryDetail})`
        : t(`categories.${ex.category}`);
      return [
        ex.date, 
        `"${ex.description.replace(/"/g, '""')}"`, 
        categoryDisplay, 
        ex.invoiceNumber || '',
        ex.amount.toFixed(2), 
        t(`statuses.${ex.status}`), 
        ex.receipt ? t('csv.yes') : t('csv.no')
      ];
    });
    
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
  }, [filteredExpenses, t]);
  
  const renderView = () => {
    switch (activeView) {
      case 'table':
        return (
          <>
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
          </>
        );
      case 'dashboard':
        return <Dashboard expenses={filteredExpenses} />;
      case 'projection':
        return <ProjectionDashboard expenses={filteredExpenses} budget={budget} setBudget={setBudget} />;
      default:
        return null;
    }
  }

  return (
    <div className="bg-kimi-gray dark:bg-gray-900 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">{t('header.title')}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('header.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
             <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-kimi-green dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={t('header.toggleTheme')}>
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            {/* View Switcher */}
            <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg flex items-center">
              <button
                  onClick={() => setActiveView('table')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeView === 'table' ? 'bg-white dark:bg-gray-600 text-kimi-green dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                  aria-pressed={activeView === 'table'}
              >
                  <TableCellsIcon className="inline-block mr-2 h-4 w-4" />
                  {t('viewSwitcher.table')}
              </button>
              <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeView === 'dashboard' ? 'bg-white dark:bg-gray-600 text-kimi-green dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                  aria-pressed={activeView === 'dashboard'}
              >
                  <ChartBarIcon className="inline-block mr-2 h-4 w-4" />
                  {t('viewSwitcher.dashboard')}
              </button>
              <button
                  onClick={() => setActiveView('projection')}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeView === 'projection' ? 'bg-white dark:bg-gray-600 text-kimi-green dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                  aria-pressed={activeView === 'projection'}
                >
                  <TrendingUpIcon className="inline-block mr-2 h-4 w-4" />
                  {t('viewSwitcher.projection')}
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-gray-500 dark:text-gray-400 hover:text-kimi-green dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={t('header.help')}
              title={t('header.helpTooltip')}
            >
              <HelpIcon />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center bg-kimi-green text-white font-bold py-2 px-4 rounded-lg hover:bg-kimi-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kimi-green-dark transition-all duration-200"
              title={t('header.saveTooltip')}
            >
              <SaveIcon className="mr-2" />
              {t('header.save')}
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center bg-white text-kimi-green dark:bg-gray-800 dark:text-green-400 font-bold py-2 px-4 rounded-lg border-2 border-kimi-green dark:border-green-400 hover:bg-kimi-green hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kimi-green-dark transition-all duration-200"
              title={t('header.exportTooltip')}
            >
              <DownloadIcon className="mr-2" />
              {t('header.export')}
            </button>
          </div>
        </header>
        
        <main>
          {renderView()}
        </main>

        <footer className="text-center mt-8 text-gray-400 dark:text-gray-500 text-sm">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </footer>
      </div>
      <InstructionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <ConfirmationModal
        isOpen={expenseToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        titleKey="modals.delete.title"
        messageKey="modals.delete.message"
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        titleKey="modals.bulkDelete.title"
        messageKey="modals.bulkDelete.message"
        messageOptions={{ count: selectedExpenseIds.length }}
      />

      <Toast 
        messageKey={notification?.messageKey || ''} 
        type={notification?.type || 'success'} 
        show={notification !== null} 
      />
    </div>
  );
};

export default App;