'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '@/lib/auth';
import { User } from '@/types';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    newToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const users = await getUsers();
        const today = new Date().toDateString();
        
        setStats({
          total: users.length,
          admins: users.filter(u => u.is_admin).length,
          users: users.filter(u => !u.is_admin).length,
          newToday: users.filter(u => {
            if (!u.created_at) return false;
            return new Date(u.created_at).toDateString() === today;
          }).length
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      title: 'Total de Usuários',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/usuarios'
    },
    {
      title: 'Administradores',
      value: stats.admins,
      icon: UserCheck,
      color: 'bg-green-500',
      link: '/admin/usuarios'
    },
    {
      title: 'Usuários Comuns',
      value: stats.users,
      icon: UserX,
      color: 'bg-purple-500',
      link: '/admin/usuarios'
    },
    {
      title: 'Novos Hoje',
      value: stats.newToday,
      icon: Calendar,
      color: 'bg-yellow-500',
      link: '/admin/usuarios'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              href={card.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/usuarios"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h3 className="font-medium">👥 Gerenciar Usuários</h3>
            <p className="text-sm text-gray-600 mt-1">
              Editar, excluir ou alterar permissões
            </p>
          </Link>
          
          <Link
            href="/admin/usuarios?new=true"
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <h3 className="font-medium">➕ Criar Novo Usuário</h3>
            <p className="text-sm text-gray-600 mt-1">
              Adicionar um novo usuário manualmente
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}