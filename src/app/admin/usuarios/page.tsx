'use client';

import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser, makeAdmin } from '@/lib/auth'; // <-- IMPORT makeAdmin
import { User } from '@/types';
import { Edit, Trash2, Save, X, Shield, ShieldOff, UserPlus } from 'lucide-react'; // <-- IMPORT UserPlus

export default function AdminUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: number) {
    try {
      const updated = await updateUser(id, editForm);
      setUsers(users.map(u => u.id === id ? updated : u));
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      alert('Erro ao atualizar usuário');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Erro ao deletar usuário');
    }
  }

  async function toggleAdmin(user: User) {
    try {
      const updated = await updateUser(user.id, { 
        is_admin: !user.is_admin 
      });
      setUsers(users.map(u => u.id === user.id ? updated : u));
    } catch (err) {
      alert('Erro ao alterar permissão');
    }
  }

  // 🔥 NOVA FUNÇÃO: Promover a admin
  async function handleMakeAdmin(id: number, userName: string) {
    if (!confirm(`Tornar ${userName} administrador?`)) return;
    
    try {
      const updated = await makeAdmin(id);
      setUsers(users.map(u => u.id === id ? updated : u));
      alert(`${userName} agora é administrador!`);
    } catch (err: any) {
      alert(err.message || 'Erro ao promover usuário');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

 return (
  <div className="w-full max-w-full px-4 sm:px-6 py-6">
    <h1 className="text-2xl sm:text-3xl font-bold mb-8">Gerenciar Usuários</h1>

    {error && (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
        {error}
      </div>
    )}

    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Admin
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Criado em
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {user.id}
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={editForm.name || user.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">{user.name}</span>
                  )}
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {editingId === user.id ? (
                    <input
                      type="email"
                      value={editForm.email || user.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="text-gray-500">{user.email}</span>
                  )}
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleAdmin(user)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      user.is_admin
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {user.is_admin ? <Shield size={14} /> : <ShieldOff size={14} />}
                    {user.is_admin ? 'Admin' : 'Usuário'}
                  </button>
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(user.created_at || '').toLocaleDateString('pt-BR')}
                </td>

                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2 flex-wrap">
                    {editingId === user.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save size={18} />
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setEditForm(user);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>

                        {!user.is_admin && (
                          <button
                            onClick={() => handleMakeAdmin(user.id, user.name)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <UserPlus size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.id === 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}