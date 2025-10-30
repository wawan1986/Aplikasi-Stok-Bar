import React, { useState } from 'react';
import Spinner from './Spinner';

interface LoginProps {
  onLogin: (username, password) => Promise<void>;
  error: string | null;
  loading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, error, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
            <img src="https://makassarwebsite.com/wp-content/uploads/2025/10/Icon-De-Ori.webp" alt="Stok Selis Logo" className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-white tracking-tight mt-4">
                Stok Bar
            </h1>
            <p className="text-gray-400 mt-1">Silakan login untuk melanjutkan</p>
        </div>
        
        <form 
            onSubmit={handleSubmit}
            className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
        >
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              // FIX: Corrected typo from e.targe to e.target
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-wait flex items-center justify-center"
          >
            {loading ? <Spinner /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
