import React, { useState, useEffect } from 'react';
import PencilIcon from './icons/PencilIcon';
import { Unit, StockItem, StockType } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem;
  onConfirm: (id: string, newName: string, newUnit: Unit, minStock: number, stockType: StockType) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item, onConfirm }) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<Unit>(Unit.Pcs);
  const [minStock, setMinStock] = useState('');
  const [stockType, setStockType] = useState<StockType>(StockType.Manual);

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setUnit(item.unit);
      setMinStock(item.minStock.toString());
      setStockType(item.stockType || StockType.Manual); // Default to manual if not set
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const numericMinStock = parseInt(minStock, 10);
    if (name.trim() && !isNaN(numericMinStock) && numericMinStock >= 0) {
      onConfirm(item.id, name.trim(), unit, numericMinStock, stockType);
    }
  };
  
  const isInvalid = !name.trim() || !minStock || parseInt(minStock, 10) < 0;

  return (
    <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Edit Item</h2>
        
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
            <PencilIcon className="w-5 h-5 mr-2" />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;