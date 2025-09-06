import { ExpenseCategory } from './types';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  ExpenseCategory.VIAJES,
  ExpenseCategory.COMIDAS,
  ExpenseCategory.SUMINISTROS,
  ExpenseCategory.TRANSPORTE,
  ExpenseCategory.ALOJAMIENTO,
  ExpenseCategory.OTROS,
];

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.VIAJES]: '✈️',
  [ExpenseCategory.COMIDAS]: '🍽️',
  [ExpenseCategory.SUMINISTROS]: '🧾',
  [ExpenseCategory.TRANSPORTE]: '🚗',
  [ExpenseCategory.ALOJAMIENTO]: '🏨',
  [ExpenseCategory.OTROS]: '📦',
};