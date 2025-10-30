import React, { useState, useMemo } from 'react';
import type { Transaction, FilterOption } from '../types';
import { TransactionType } from '../types';
import FilterControls from './FilterControls';
import { getFilterDateRange } from '../utils/dateUtils';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<FilterOption>('today');
  const today = new Date().toISOString().split('T')[0];
  const [customRange, setCustomRange] = useState({ start: today, end: today });

  const filteredTransactions = useMemo(() => {
    const range = getFilterDateRange(filter, customRange.start, customRange.end);
    if (!range) {
      if (filter === 'custom' && (!customRange.start || !customRange.end)) {
        return [];
      }
       return transactions;
    }
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      return transactionDate >= range.startDate && transactionDate <= range.endDate;
    });
  }, [transactions, filter, customRange]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Aktivitas Terbaru</h2>
      <FilterControls
        activeFilter={filter}
        setActiveFilter={setFilter}
        customRange={customRange}
        setCustomRange={setCustomRange}
      />
      <div className="mt-6 flow-root">
        <ul className="-my-4 divide-y divide-gray-700">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(t => (
              <li key={t.id} className="flex items-center py-4 gap-4">
                <div className={`flex-shrink-0 p-2 rounded-full ${t.type === TransactionType.In ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {t.type === TransactionType.In 
                    ? <ArrowUpIcon className="w-5 h-5 text-green-400" /> 
                    : <ArrowDownIcon className="w-5 h-5 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{t.itemName}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(t.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className={`text-right font-semibold whitespace-nowrap ${t.type === TransactionType.In ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === TransactionType.In ? '+' : '-'}{t.amount} {t.unit}
                </div>
              </li>
            ))
          ) : (
            <div className="text-center py-12">
                <p className="text-gray-400 font-semibold">Tidak Ada Transaksi</p>
                <p className="text-sm text-gray-500 mt-1">Tidak ada aktivitas pada periode yang dipilih.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RecentTransactions;
