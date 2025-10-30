import React, { useState, useEffect } from 'react';
import type { StockItem } from '../types';
import MinusIcon from './icons/MinusIcon';

interface RecordOutgoingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem;
  onConfirm: (amount: number) => void;
}

const RecordOutgoingModal: React.FC<RecordOutgoingModalProps> = ({ isOpen, onClose, item, onConfirm }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue > item.quantity) {
      setError(`Tidak bisa mengeluarkan lebih dari stok yang ada (${item.quantity})`);
    } else {
      setError('');
    }
  };

  const handleConfirm = () => {
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount > 0 && numericAmount <= item.quantity) {
      onConfirm(numericAmount);
    }
  };

  const isInvalid = !amount || parseInt(amount, 10) <= 0 || parseInt(amount, 10) > item.quantity;

  return (
    <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Catat Stok Keluar</h2>
        <p className="text-gray-400 mb-4">Item: <span className="font-semibold text-brand-secondary">{item.name}</span></p>
        <p className="text-gray-400 mb-4">Stok saat ini: <span className="font-semibold text-white">{item.quantity} {item.unit}</span></p>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Jumlah</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className={`w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:border-brand-secondary ${error ? 'border-red-500 ring-red-500' : 'focus:ring-brand-secondary'}`}
            placeholder="e.g., 10"
            min="1"
            max={item.quantity}
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
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
            disabled={isInvalid}
            className="px-4 py-2 bg-brand-secondary hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
          >
            <MinusIcon className="w-5 h-5 mr-2" />
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordOutgoingModal;
