import React from 'react';
import { Role, StockType } from '../types';
import type { StockItem } from '../types';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import PencilIcon from './icons/PencilIcon';
import SyncIcon from './icons/SyncIcon';

interface StockItemCardProps {
  item: StockItem;
  role: Role;
  onAddStockClick: () => void;
  onRecordOutgoingClick: () => void;
  onEditClick: () => void;
}

const getStockStatusDetails = (quantity: number, minStock: number) => {
  if (quantity <= 0) return { text: 'Stok Habis', colorClass: 'text-red-400 font-bold' };
  if (quantity <= minStock) return { text: 'Stok Kritis', colorClass: 'text-red-400' };
  if (quantity <= minStock * 1.5) return { text: 'Stok Rendah', colorClass: 'text-yellow-400' };
  return { text: 'Stok Aman', colorClass: 'text-green-400' };
};

const StockItemCard: React.FC<StockItemCardProps> = ({ item, role, onAddStockClick, onRecordOutgoingClick, onEditClick }) => {
  const status = getStockStatusDetails(item.quantity, item.minStock);
  const isDynamic = item.stockType === StockType.Dynamic;

  const renderAction = () => {
    if (role === Role.Owner) {
      return (
        <button
          onClick={onAddStockClick}
          className="w-full flex items-center justify-center bg-brand-primary hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-lg transition-colors duration-300 text-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Input Masuk
        </button>
      );
    }
    // For Staff
    if (isDynamic) {
        return (
            <div className="w-full text-center bg-gray-700/50 text-gray-400 font-semibold py-2.5 px-3 rounded-lg text-sm">
                Otomatis
            </div>
        )
    }
    return (
       <button
        onClick={onRecordOutgoingClick}
        className="w-full flex items-center justify-center bg-brand-secondary hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-lg transition-colors duration-300 text-sm"
        >
        <MinusIcon className="w-5 h-5 mr-2" />
        Catat Stock
        </button>
    )
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg flex flex-col p-4 border border-gray-700/50 transition-colors hover:bg-gray-700/60 min-h-[200px]">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-base text-white leading-tight break-words">{item.name}</h3>
          <p className={`text-xs mt-1 ${status.colorClass}`}>{status.text}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
           {isDynamic && (
             <div title="Stok Dinamis" className="cursor-help">
                <SyncIcon className="w-4 h-4 text-purple-300" />
             </div>
          )}
          {role === Role.Owner && (
            <button 
              onClick={onEditClick} 
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors"
              aria-label="Edit Item"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Body */}
      <div className="my-auto py-2 text-center flex flex-col items-center justify-center">
         <span className="text-4xl font-bold text-white tracking-tight leading-none">{item.quantity}</span>
         <span className="text-sm text-gray-400 mt-1">{item.unit}</span>
      </div>
      
      {/* Footer / Actions */}
      <div className="mt-auto">
        {renderAction()}
      </div>
    </div>
  );
};

export default StockItemCard;