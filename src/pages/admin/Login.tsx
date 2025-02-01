import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import storage from '@/lib/storage';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = storage.getCurrentUser();
      if (user) {
        navigate('/admin/dashboard', { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await storage.authenticateUser(email, password);
      
      if (result.success && result.user) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Anmeldung fehlgeschlagen');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', { email: resetEmail });
      setResetSuccess(response.data.message);
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || 'Fehler beim Senden der Zurücksetzungs-E-Mail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <Container className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">
              {showResetForm ? 'Passwort zurücksetzen' : 'Geschützter Bereich'}
            </h1>
          </div>
          
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {resetSuccess && (
            <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
              {resetSuccess}
            </div>
          )}

          {showResetForm ? (
            <form onSubmit={handleResetPassword} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Wird gesendet...' : 'Zurücksetzen anfordern'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  className="text-sm text-gray-600 hover:text-accent"
                >
                  Zurück zur Anmeldung
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Passwort
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent sm:text-sm"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-accent px-4 py-2 text-white transition-colors hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-sm text-gray-600 hover:text-accent"
                >
                  Passwort vergessen?
                </button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}