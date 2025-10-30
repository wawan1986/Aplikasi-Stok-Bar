import React from 'react';
import type { User } from '../types';
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 bg-gray-800/80 backdrop-blur-sm shadow-md z-10 border-b border-gray-700/50">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="https://makassarwebsite.com/wp-content/uploads/2025/10/Icon-De-Ori.webp" alt="Stok Selis Logo" className="w-8 h-8" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Stok Selis
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-sm font-semibold text-white">{user.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Logout"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;