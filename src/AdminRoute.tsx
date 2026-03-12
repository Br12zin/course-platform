'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { User } from '@/types';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
 async function checkAdmin() {

   const user = await getCurrentUser();

   if (!user) {
     router.push('/login');
     return;
   }

   if (!user.is_admin) {
     router.push('/tela-inicial');
     return;
   }

   setIsAdmin(true);
   setLoading(false);

 }

 checkAdmin();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Nunca deve chegar aqui, mas por segurança
  }

  return <>{children}</>;
}