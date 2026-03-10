'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';
import { Users, Home, LogOut, Video, ArrowLeft } from 'lucide-react'; // <-- Importar ArrowLeft
import { logout, getUserFromStorage } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); // <-- pegar router para voltar
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Usuários', href: '/admin/usuarios', icon: Users },
    { name: 'Vídeos', href: '/admin/videos', icon: Video },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar Admin */}
        <div className="w-64 bg-gray-900 text-white relative">
          {/* BOTÃO VOLTAR */}
          <button
            onClick={() => router.push("/tela-inicial")} // <-- Voltar para a tela inicial
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/30 backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="p-4 mt-12">
            <h2 className="text-xl font-bold mb-6 mt-10">Painel Admin</h2>
            <p className="text-sm text-gray-400 mb-4">
              Admin: {user?.name}
            </p>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600/20 text-red-400 transition mt-4"
              >
                <LogOut size={20} />
                Sair
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </AdminRoute>
  );
}