import React, { useState, useEffect } from 'react';
import PlusIcon from './icons/PlusIcon';
import { Unit, StockType } from '../types';

interface AddNewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, unit: Unit, minStock: number, stockType: StockType) => void;
}

const AddNewItemModal: React.FC<AddNewItemModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<Unit>(Unit.Pcs);
  const [minStock, setMinStock] = useState('');
  const [stockType, setStockType] = useState<StockType>(StockType.Manual);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setUnit(Unit.Pcs);
      setMinStock('');
      setStockType(StockType.Manual);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const numericMinStock = parseInt(minStock, 10);
    if (name.trim() && !isNaN(numericMinStock) && numericMinStock >= 0) {
      onConfirm(name.trim(), unit, numericMinStock, stockType);
    }
  };
  
  const isInvalid = !name.trim() || !minStock || parseInt(minStock, 10) < 0;

  return (
    <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Tambah Item Baru</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-300 mb-2">Nama Item</label>
            <input
              type="text"
              id="itemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              placeholder="e.g., Biji Kopi"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label htmlFor="minStock" className="block text-sm font-medium text-gray-300 mb-2">Stok Minimal</label>
              <input
                type="number"
                id="minStock"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                placeholder="e.g., 10"
                min="0"
              />
            </div>
             <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-2">Satuan</label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              >
                {Object.values(Unit).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipe Stok</label>
            <div className="flex gap-4 p-1 bg-gray-700 rounded-lg">
                <button 
                    onClick={() => setStockType(StockType.Manual)}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${stockType === StockType.Manual ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    Manual
                </button>
                <button 
                    onClick={() => setStockType(StockType.Dynamic)}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors ${stockType === StockType.Dynamic ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    Dinamis
                </button>
            </div>
             <p className="text-xs text-gray-500 mt-2">
                Pilih 'Dinamis' jika jumlah stok akan dihitung otomatis oleh formula di spreadsheet.
             </p>
          </div>
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
            className="px-4 py-2 bg-brand-primary hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tambah Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewItemModal;