import React from 'react';
import type { StockItem } from '../types';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

interface LowStockWarningProps {
  items: StockItem[];
}

const getStockStatus = (item: StockItem): 'critical' | 'low' | 'healthy' => {
    if (item.quantity <= item.minStock) return 'critical';
    if (item.quantity <= item.minStock * 1.5) return 'low';
    return 'healthy';
}

const statusStyles = {
    critical: {
        dot: 'bg-red-500',
        text: 'text-red-400'
    },
    low: {
        dot: 'bg-yellow-500',
        text: 'text-yellow-400'
    }
}

const LowStockWarning: React.FC<LowStockWarningProps> = ({ items }) => {
  const itemsToShow = items
    .map(item => ({...item, status: getStockStatus(item)}))
    .filter(item => item.status === 'critical' || item.status === 'low')
    .sort((a, b) => {
        if (a.status === 'critical' && b.status !== 'critical') return -1;
        if (a.status !== 'critical' && b.status === 'critical') return 1;
        return a.quantity - b.quantity;
    });

  if (itemsToShow.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
        <h2 className="text-xl font-bold text-white">Peringatan Stok</h2>
      </div>
      <p className="text-gray-400 text-sm mb-5">
        Item berikut membutuhkan perhatian. Segera lakukan pengadaan ulang untuk item kritis.
      </p>
      <ul className="space-y-3">
        {itemsToShow.map(item => {
            const style = item.status === 'critical' ? statusStyles.critical : statusStyles.low;
            return (
                <li key={item.id} className="bg-gray-900/70 p-3 rounded-lg flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`}></div>
                        <span className="font-semibold text-white truncate pr-2">{item.name}</span>
                    </div>
                    <span className={`font-bold whitespace-nowrap ${style.text}`}>{item.quantity} / {item.minStock} {item.unit}</span>
                </li>
            )
        })}
      </ul>
    </div>
  );
};

export default LowStockWarning;