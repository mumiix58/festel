import storage from './storage';
import { User, UserProfile } from '@/types';
import api from './api';

export async function loginUser(email: string, password: string) {
  try {
    // Use content endpoint for auth
    const response = await api.post('/content/auth/login', { 
      email, 
      password,
      // Add timestamp to prevent caching
      _t: Date.now()
    });
    
    if (response?.user) {
      // Store auth token and user data
      localStorage.setItem('authToken', response.user.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return { success: true, user: response.user };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'Login failed. Please try again.'
    };
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('authToken');
  const user = storage.getCurrentUser();
  return !!(token && user);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export async function refreshToken(): Promise<boolean> {
  try {
    const response = await api.post('/content/auth/refresh', {
      _t: Date.now() // Add timestamp to prevent caching
    });
    if (response?.token) {
      localStorage.setItem('authToken', response.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.get('/content/users');
    return response || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function addUser(user: Omit<User, 'id'> & { password: string }): Promise<User> {
  const response = await api.post('/content/users', user);
  return response;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const response = await api.put(`/content/users/${userId}`, updates);
  return response;
}

export async function updateProfile(userId: string, profile: UserProfile): Promise<User> {
  const response = await api.put(`/content/users/${userId}/profile`, profile);
  return response;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/content/users/${userId}`);
}

export function logoutUser() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  window.location.href = '/admin/login';
}