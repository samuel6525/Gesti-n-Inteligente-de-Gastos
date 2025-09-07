export interface Receipt {
  name: string;
  type: string;
  data: string; // Base64 Data URL
}

export enum ExpenseCategory {
  VIAJES = 'Viajes',
  COMIDAS = 'Comidas',
  SUMINISTROS = 'Suministros',
  TRANSPORTE = 'Transporte',
  ALOJAMIENTO = 'Alojamiento',
  OTROS = 'Otros',
}

export enum ExpenseStatus {
  PENDIENTE = 'Pendiente',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;
  receipt?: Receipt;
  otherCategoryDetail?: string;
  invoiceNumber?: string;
}