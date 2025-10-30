
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

// IMPORTANT: Replace this with your actual Google Apps Script URL from the deployment.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyuxI7Xsr5QILcYk4rhy7wIZXURX-2rcCY7vt0TMU0wUnqzv8ktonX3xaHm1dITBhQ/exec';
const SESSION_STORAGE_KEY = 'stock-app-user';

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
    // Try to parse the error from the server script if possible
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || 'API call failed');
    } catch(e) {
      throw new Error(`API call failed: ${errorText}`);
    }
  }
  return response.json();
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to parse user from session storage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall('login', { username, password });
      if (response.success) {
        const loggedInUser = response.user;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiCall('getUsers');
      if(res.error) throw new Error(res.error);
      return res;
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  const addUser = useCallback(async (username, password, role) => {
    try {
      const response = await apiCall('addUser', { username, password, role });
      if (response.success) {
        return response.user;
      }
      throw new Error(response.message || "Failed to add user");
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { user, isAuthenticated, loading, error, login, logout, fetchUsers, addUser };
};
