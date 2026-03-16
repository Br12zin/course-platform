'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserFromStorage, logout } from '@/lib/auth';
import { User } from '@/types';
import { LogIn, UserPlus, LogOut } from 'lucide-react';

export default function LoginButtons() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = getUserFromStorage();
      setUser(storedUser);
    };

    loadUser();

    // Atualiza se o localStorage mudar
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 flex flex-wrap items-center gap-3">
      
      {!user ? (
        <>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-green-700/70 hover:bg-green-800/70 text-white rounded-lg transition border border-white/30 backdrop-blur-sm"
          >
            <LogIn size={18} />
            Entrar
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition backdrop-blur-sm"
          >
            <UserPlus size={18} />
            Cadastrar
          </Link>
        </>
      ) : (
        <>
          <span className="text-white/90 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            Olá, <span className="font-semibold text-white">{user.name}</span>
          </span>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition border border-red-500/30 backdrop-blur-sm"
          >
            <LogOut size={18} />
            Sair
          </button>
        </>
      )}

    </div>
  );
}