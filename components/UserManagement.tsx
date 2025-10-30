import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import { Role } from '../types';
import Spinner from './Spinner';
import UsersIcon from './icons/UsersIcon';
import PlusIcon from './icons/PlusIcon';

const UserManagement: React.FC = () => {
    const { fetchUsers, addUser, error: authError } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        const fetchedUsers = await fetchUsers();
        // Filter to show only staff users
        setUsers(fetchedUsers.filter(u => u.role === Role.Staff));
        setLoading(false);
    }, [fetchUsers]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newUsername || !newPassword) {
            setFormError("Username dan password tidak boleh kosong.");
            return;
        }
        setFormError(null);
        setIsSubmitting(true);
        try {
            const newUser = await addUser(newUsername, newPassword, Role.Staff);
            setUsers(prev => [...prev, newUser]);
            setNewUsername('');
            setNewPassword('');
        } catch (err: any) {
            setFormError(err.message || "Gagal menambahkan user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Tambah User Staff Baru</h2>
                 <form onSubmit={handleAddUser} className="space-y-4">
                    {formError && <p className="text-red-400 text-sm">{formError}</p>}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="newUsername" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                                placeholder="e.g., staff01"
                            />
                        </div>
                         <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-brand-primary hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? <Spinner /> : <><PlusIcon className="w-5 h-5 mr-2" /> Tambah User</>}
                        </button>
                    </div>
                </form>
            </div>
        
            <div className="bg-gray-800 rounded-xl p-6">
                 <h2 className="text-2xl font-bold text-white mb-4">Daftar User Staff</h2>
                 {loading ? <Spinner /> : (
                    <div className="flow-root">
                        {users.length > 0 ? (
                            <ul className="-my-4 divide-y divide-gray-700">
                                {users.map(user => (
                                    <li key={user.username} className="flex items-center py-4 gap-4">
                                        <div className="flex-shrink-0 p-3 rounded-full bg-gray-700">
                                            <UsersIcon className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{user.username}</p>
                                            <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-8">Belum ada user staff yang ditambahkan.</p>
                        )}
                    </div>
                 )}
            </div>
        </div>
    );
};

export default UserManagement;
