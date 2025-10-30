import React, { useState, useEffect } from 'react';
import type { StockItem } from '../types';
import PlusIcon from './icons/PlusIcon';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem;
  onConfirm: (amount: number) => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, item, onConfirm }) => {
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onConfirm(numericAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Input Stok Masuk</h2>
        <p className="text-gray-400 mb-4">Item: <span className="font-semibold text-brand-primary">{item.name}</span></p>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Jumlah</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            placeholder="e.g., 50"
            min="1"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!amount || parseInt(amount, 10) <= 0}
            className="px-4 py-2 bg-brand-primary hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
