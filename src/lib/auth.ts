import storage from './storage';

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