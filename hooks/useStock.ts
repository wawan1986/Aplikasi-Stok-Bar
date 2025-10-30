
import { useState, useCallback } from 'react';
import type { StockItem, StockType } from '../types';
import { Unit } from '../types';

// IMPORTANT: Replace this with your actual Google Apps Script URL from the deployment.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuxI7Xsr5QILcYk4rhy7wIZXURX-2rcCY7vt0TMU0wUnqzv8ktonX3xaHm1dITBhQ/exec';

async function apiCall(action: string, payload?: object) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Required for Apps Script
    },
    body: JSON.stringify({ action, payload }),
    mode: 'cors',
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${errorText}`);
  }
  return response.json();
}

export const useStock = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // This single GET endpoint will fetch both stock and transactions
      const res = await fetch(`${SCRIPT_URL}?action=getData`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      setStock(data.stock || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewItem = useCallback(async (name: string, unit: Unit, minStock: number, stockType: StockType): Promise<boolean> => {
    // Quantity is no longer set from the app. It's calculated by the spreadsheet formula.
    const newItemPayload = {
      id: new Date().getTime().toString(),
      name,
      unit,
      minStock,
      stockType
    };
    try {
      const res = await apiCall('addNewItem', newItemPayload);
      if(res.error) throw new Error(res.error);
      // The local state will be updated via refetch in the App component for accuracy.
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  const editItem = useCallback(async (id: string, newName: string, newUnit: Unit, minStock: number, stockType: StockType): Promise<boolean> => {
    const payload = { id, name: newName, unit: newUnit, minStock, stockType };
    try {
      const res = await apiCall('editItem', payload);
      if(res.error) throw new Error(res.error);
      setStock(prevStock =>
        prevStock.map(item =>
          item.id === id ? { ...item, ...payload } : item
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, []);

  return { stock, loading, error, refetch, addNewItem, editItem };
};
