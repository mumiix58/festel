import { useState, useEffect } from 'react';
import { User, UserProfile } from '@/types';
import { getUsers, addUser, updateUser, updateProfile, deleteUser } from '@/lib/auth';

export function useAuth() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const loadedUsers = await getUsers();
      setUsers(loadedUsers);
      setError(null);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (user: Omit<User, 'id'> & { password: string }) => {
    try {
      await addUser(user);
      await loadUsers();
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user');
      return false;
    }
  };

  const updateUserData = async (userId: string, updates: Partial<User>) => {
    try {
      await updateUser(userId, updates);
      await loadUsers();
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
      return false;
    }
  };

  const updateUserProfile = async (userId: string, profile: UserProfile) => {
    try {
      await updateProfile(userId, profile);
      await loadUsers();
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return false;
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await loadUsers();
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser: updateUserData,
    updateProfile: updateUserProfile,
    deleteUser: removeUser,
    reloadUsers: loadUsers
  };
}