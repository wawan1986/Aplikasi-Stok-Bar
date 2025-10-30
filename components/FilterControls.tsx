import React from 'react';
import type { FilterOption } from '../types';

interface FilterControlsProps {
  activeFilter: FilterOption;
  setActiveFilter: (filter: FilterOption) => void;
  customRange: { start: string; end: string };
  setCustomRange: (range: { start: string; end: string }) => void;
}

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'today', label: 'Hari Ini' },
  { key: 'yesterday', label: 'Kemarin' },
  { key: 'this_week', label: 'Minggu Ini' },
  { key: 'last_week', label: 'Minggu Lalu' },
  { key: 'this_month', label: 'Bulan Ini' },
  { key: 'last_month', label: 'Bulan Lalu' },
  { key: 'custom', label: 'Custom' },
];

const FilterControls: React.FC<FilterControlsProps> = ({ activeFilter, setActiveFilter, customRange, setCustomRange }) => {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-primary ${
              activeFilter === key
                ? 'bg-brand-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {activeFilter === 'custom' && (
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div>
            <label htmlFor="start-date" className="block text-xs font-medium text-gray-400 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              id="start-date"
              value={customRange.start}
              onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-xs font-medium text-gray-400 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              id="end-date"
              value={customRange.end}
              onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
