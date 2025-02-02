import storage from './storage';
import { User, UserProfile } from '@/types';

export async function loginUser(email: string, password: string) {
  try {
    const result = await storage.authenticateUser(email, password);
    return result;
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Invalid credentials'
    };
  }
}

export async function getUsers(): Promise<User[]> {
  // For now, just return empty array since we're using local storage
  return [];
}

export async function addUser(user: Omit<User, 'id'> & { password: string }): Promise<User> {
  throw new Error('Not implemented');
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  throw new Error('Not implemented');
}

export async function updateProfile(userId: string, profile: UserProfile): Promise<User> {
  throw new Error('Not implemented');
}

export async function deleteUser(userId: string): Promise<void> {
  throw new Error('Not implemented');
}