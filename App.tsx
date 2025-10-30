import React, { useState, useCallback, useEffect } from 'react';
import { useStock } from './hooks/useStock';
import { useTransactions } from './hooks/useTransactions';
import { useAuth } from './hooks/useAuth';

import Header from './components/Header';
import StockList from './components/StockList';
import Dashboard from './components/Dashboard';
import AddStockModal from './components/AddStockModal';
import RecordOutgoingModal from './components/RecordOutgoingModal';
import AddNewItemModal from './components/AddNewItemModal';
import EditItemModal from './components/EditItemModal';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import Spinner from './components/Spinner';

import { Role, Unit, TransactionType, StockType } from './types';
import type { StockItem, User, View } from './types';

function MainApp({ user, onLogout }: { user: User, onLogout: () => void }) {
  const { stock, refetch: refetchStock, addNewItem, editItem, loading: stockLoading, error: stockError } = useStock();
  const { transactions, refetch: refetchTransactions, addTransaction, loading: transactionsLoading, error: transactionsError } = useTransactions();
  const [view, setView] = useState<View>('dashboard');
  
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isAddStockModalOpen, setAddStockModalOpen] = useState(false);
  const [isRecordOutgoingModalOpen, setRecordOutgoingModalOpen] = useState(false);
  const [isAddNewItemModalOpen, setAddNewItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setEditItemModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    refetchStock();
    refetchTransactions();
  }, [refetchStock, refetchTransactions]);

  const handleOpenAddStock = useCallback((item: StockItem) => {
    setSelectedItem(item);
    setAddStockModalOpen(true);
  }, []);

  const handleOpenRecordOutgoing = useCallback((item: StockItem) => {
    setSelectedItem(item);
    setRecordOutgoingModalOpen(true);
  }, []);
  
  const handleOpenAddNewItem = useCallback(() => {
    setAddNewItemModalOpen(true);
  }, []);
  
  const handleOpenEditItem = useCallback((item: StockItem) => {
    setSelectedItem(item);
    setEditItemModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setSelectedItem(null);
    setAddStockModalOpen(false);
    setRecordOutgoingModalOpen(false);
    setAddNewItemModalOpen(false);
    setEditItemModalOpen(false);
  }, []);

  const handleConfirmAddStock = useCallback(async (amount: number) => {
    if (selectedItem) {
      setIsProcessing(true);
      // New Architecture: ONLY add a transaction.
      await addTransaction(selectedItem.id, selectedItem.name, amount, selectedItem.unit, TransactionType.In);
      // Refetch stock to get the latest quantity calculated by the sheet's formula.
      await refetchStock();
      // Also refetch transactions to update the dashboard
      await refetchTransactions();
      setIsProcessing(false);
    }
    handleCloseModals();
  }, [selectedItem, addTransaction, handleCloseModals, refetchStock, refetchTransactions]);

  const handleConfirmRecordOutgoing = useCallback(async (amount: number) => {
    if (selectedItem && selectedItem.stockType === StockType.Manual) {
      setIsProcessing(true);
      // New Architecture: ONLY add a transaction.
      await addTransaction(selectedItem.id, selectedItem.name, amount, selectedItem.unit, TransactionType.Out);
      // Refetch stock to get the latest quantity calculated by the sheet's formula.
      await refetchStock();
      // Also refetch transactions to update the dashboard
      await refetchTransactions();
      setIsProcessing(false);
    }
    handleCloseModals();
  }, [selectedItem, addTransaction, handleCloseModals, refetchStock, refetchTransactions]);

  const handleConfirmAddNewItem = useCallback(async (name: string, unit: Unit, minStock: number, stockType: StockType) => {
    setIsProcessing(true);
    const success = await addNewItem(name, unit, minStock, stockType);
    if (success) {
      // Refetch to get the full list including the new item with its calculated quantity (which will be 0)
      await refetchStock();
    }
    setIsProcessing(false);
    handleCloseModals();
  }, [addNewItem, handleCloseModals, refetchStock]);

  const handleConfirmEditItem = useCallback(async (id: string, newName: string, newUnit: Unit, minStock: number, stockType: StockType) => {
    setIsProcessing(true);
    const success = await editItem(id, newName, newUnit, minStock, stockType);
     if (success) {
      // Refetch to update the item details in the list
      await refetchStock();
    }
    setIsProcessing(false);
    handleCloseModals();
  }, [editItem, handleCloseModals, refetchStock]);
  
  const isLoading = stockLoading || transactionsLoading;
  const error = stockError || transactionsError;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      {(isProcessing) && ( // Only show processing spinner, not the initial loading one
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Spinner />
        </div>
      )}
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8 pb-24">
        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-4">Error: {error}</div>}
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        ) : (
            <>
                {view === 'dashboard' && <Dashboard stock={stock} transactions={transactions} />}
                {view === 'stockList' && (
                  <StockList
                    items={stock}
                    role={user.role}
                    onAddStock={handleOpenAddStock}
                    onRecordOutgoing={handleOpenRecordOutgoing}
                    onAddNewItem={handleOpenAddNewItem}
                    onEditItem={handleOpenEditItem}
                  />
                )}
                {view === 'userManagement' && user.role === Role.Owner && <UserManagement />}
            </>
        )}
      </main>

      {selectedItem && (
        <AddStockModal
          isOpen={isAddStockModalOpen}
          onClose={handleCloseModals}
          item={selectedItem}
          onConfirm={handleConfirmAddStock}
        />
      )}
      
      {selectedItem && (
        <RecordOutgoingModal
          isOpen={isRecordOutgoingModalOpen}
          onClose={handleCloseModals}
          item={selectedItem}
          onConfirm={handleConfirmRecordOutgoing}
        />
      )}
      
      {selectedItem && (
        <EditItemModal
          isOpen={isEditItemModalOpen}
          onClose={handleCloseModals}
          item={selectedItem}
          onConfirm={handleConfirmEditItem}
        />
      )}

      <AddNewItemModal
        isOpen={isAddNewItemModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmAddNewItem}
      />

      <BottomNav view={view} setView={setView} role={user.role} />
    </div>
  );
}


export default function App() {
    const { user, isAuthenticated, login, logout, loading: authLoading, error: authError } = useAuth();
    
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }
    
    if (!isAuthenticated || !user) {
        return <Login onLogin={login} error={authError} loading={authLoading} />;
    }
    
    return <MainApp user={user} onLogout={logout} />;
}