import storage from '@/lib/storage';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}