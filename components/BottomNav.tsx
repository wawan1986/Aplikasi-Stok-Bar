import React from 'react';
import ChartBarIcon from './icons/ChartBarIcon';
import ListBulletIcon from './icons/ListBulletIcon';
import UsersIcon from './icons/UsersIcon';
import { Role } from '../types';
import type { View, User } from '../types';

interface BottomNavProps {
  view: View;
  setView: (view: View) => void;
  role: User['role'];
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex-1 flex justify-center items-center p-3 transition-colors duration-300 focus:outline-none ${
        isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
      }`}
    >
      <div className={`relative p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-brand-primary/10' : ''}`}>
        {children}
        {isActive && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-primary rounded-full"></div>
        )}
      </div>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ view, setView, role }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800/80 backdrop-blur-lg border-t border-gray-700 shadow-lg z-20 flex justify-around items-center">
      <NavButton
        label="Dashboard"
        isActive={view === 'dashboard'}
        onClick={() => setView('dashboard')}
      >
        <ChartBarIcon className="w-7 h-7" />
      </NavButton>
      <NavButton
        label="Daftar Stok"
        isActive={view === 'stockList'}
        onClick={() => setView('stockList')}
      >
        <ListBulletIcon className="w-7 h-7" />
      </NavButton>
      {role === Role.Owner && (
        <NavButton
          label="Manajemen User"
          isActive={view === 'userManagement'}
          onClick={() => setView('userManagement')}
        >
          <UsersIcon className="w-7 h-7" />
        </NavButton>
      )}
    </nav>
  );
};

export default BottomNav;
