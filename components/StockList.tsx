import React from 'react';
import StockItemCard from './StockItemCard';
import { Role } from '../types';
import type { StockItem } from '../types';
import PlusIcon from './icons/PlusIcon';

interface StockListProps {
  items: StockItem[];
  role: Role;
  onAddStock: (item: StockItem) => void;
  onRecordOutgoing: (item: StockItem) => void;
  onAddNewItem: () => void;
  onEditItem: (item: StockItem) => void;
}

const StockList: React.FC<StockListProps> = ({ items, role, onAddStock, onRecordOutgoing, onAddNewItem, onEditItem }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <StockItemCard
          key={item.id}
          item={item}
          role={role}
          onAddStockClick={() => onAddStock(item)}
          onRecordOutgoingClick={() => onRecordOutgoing(item)}
          onEditClick={() => onEditItem(item)}
        />
      ))}
      {role === Role.Owner && (
        <button
          onClick={onAddNewItem}
          className="group flex flex-col items-center justify-center p-4 bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl hover:border-brand-primary hover:bg-gray-700/50 transition-all duration-300 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <PlusIcon className="w-12 h-12 text-gray-500 group-hover:text-brand-primary transition-colors" />
          <span className="mt-2 text-center font-semibold text-gray-400 group-hover:text-white">Tambah Item Baru</span>
        </button>
      )}
    </div>
  );
};

export default StockList;