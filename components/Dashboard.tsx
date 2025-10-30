import React from 'react';
import type { StockItem, Transaction } from '../types';
import LowStockWarning from './LowStockWarning';
import RecentTransactions from './RecentTransactions';

interface DashboardProps {
  stock: StockItem[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ stock, transactions }) => {
  return (
    <div className="space-y-8">
      <LowStockWarning items={stock} />
      <RecentTransactions transactions={transactions} />
    </div>
  );
};

export default Dashboard;
