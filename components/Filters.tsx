import React from 'react';
import { ExpenseCategory, ExpenseStatus } from '../types';
import { SearchIcon } from './icons';
import DatePicker from './DatePicker';

interface FiltersProps {
  filters: {
    searchTerm: string;
    category: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  categories: ExpenseCategory[];
  statuses: ExpenseStatus[];
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, categories, statuses }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (name: 'startDate' | 'endDate', date: string) => {
    setFilters((prev: any) => ({ ...prev, [name]: date }));
  }

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Search by Description */}
        <div className="lg:col-span-2">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-gray-400" />
                </div>
                <input
                    type="text"
                    id="searchTerm"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={handleInputChange}
                    placeholder="Buscar por descripción..."
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm"
                />
            </div>
        </div>

        {/* Filter by Category */}
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm"
            >
                <option value="all">Todas</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        {/* Filter by Status */}
        <div>
             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kimi-green focus:border-transparent text-sm"
            >
                <option value="all">Todos</option>
                {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
             <button
                onClick={clearFilters}
                className="w-full h-[42px] bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200 text-sm"
            >
                Limpiar Filtros
            </button>
        </div>

        {/* Date Range Filter */}
        <div className="lg:col-span-5 md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Fechas</label>
            <div className="flex items-center space-x-2">
                <div className="flex-1">
                    <DatePicker selectedDate={filters.startDate} onChange={(date) => handleDateChange('startDate', date)} />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1">
                    <DatePicker selectedDate={filters.endDate} onChange={(date) => handleDateChange('endDate', date)} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Filters;