export enum Role {
  Owner = 'owner',
  Staff = 'staff',
}

export enum Unit {
  Gram = 'Gram',
  Kilogram = 'Kilogram',
  Bungkus = 'Bungkus',
  Pcs = 'Pcs',
  Liter = 'Liter',
  Mililiter = 'Mililiter',
}

export enum StockType {
  Manual = 'manual',
  Dynamic = 'dynamic',
}

export interface StockItem {
  id: string;
  name: string;
  stockIn: number;
  stockOut: number;
  quantity: number;
  unit: Unit;
  minStock: number;
  stockType: StockType;
}

export enum TransactionType {
  In = 'in',
  Out = 'out',
}

export interface Transaction {
  id: string;
  itemId: string;
  itemName: string;
  amount: number;
  unit: Unit;
  type: TransactionType;
  timestamp: string; // ISO string
}

export interface User {
    username: string;
    role: Role;
}

export type View = 'dashboard' | 'stockList' | 'userManagement';

export type FilterOption = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'custom';