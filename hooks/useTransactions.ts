
import { useState, useCallback } from 'react';
import type { Transaction, Unit } from '../types';
import { TransactionType } from '../types';

// IMPORTANT: Replace this with your actual Google Apps Script URL from the deployment.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOaJHLdBRCjKZEqvvzfmDkIND0tE5--kgvr1y98ldJKLQ3Xl3QQoBkL_gcZ3zEOjoKKA/exec';

async function apiCall(action: string, payload?: object) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
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


export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getData`);
       if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  const addTransaction = useCallback(async (
    itemId: string,
    itemName: string,
    amount: number,
    unit: Unit,
    type: TransactionType
  ): Promise<boolean> => {
    const newTransaction: Transaction = {
      id: `${new Date().getTime()}-${Math.random()}`,
      itemId,
      itemName,
      amount,
      unit,
      type,
      timestamp: new Date().toISOString(),
    };
    try {
        const res = await apiCall('addTransaction', newTransaction);
        if(res.error) throw new Error(res.error);
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        return true;
    } catch (err: any) {
        setError(err.message);
        return false;
    }
  }, []);

  return { transactions, loading, error, addTransaction, refetch };
};
