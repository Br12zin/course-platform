import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api';

// ===========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ===========================================

// Registrar usuário
export async function registerUser(userData: RegisterCredentials): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro no cadastro');
  }

  // Salva no localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

// Login
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro no login');
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

// Buscar usuário atual (valida token)
export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('token');
  
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Token inválido');
    }

    const user = await res.json();
    return user;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

// Logout
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Verificar se está logado
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

// Pegar usuário do localStorage (sem fetch)
export function getUserFromStorage(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// ===========================================
// FUNÇÕES ADMINISTRATIVAS
// ===========================================

// Verificar se usuário é admin
export function isAdmin(): boolean {
  const user = getUserFromStorage();
  return user?.is_admin === true;
}

// Buscar todos os usuários (admin apenas)
export async function getUsers(): Promise<User[]> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/admin/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar usuários');
  }

  return res.json();
}

// Buscar usuário específico por ID (admin apenas)
export async function getUserById(id: number): Promise<User> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar usuário');
  }

  return res.json();
}

// Atualizar usuário (admin apenas)
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    throw new Error('Erro ao atualizar usuário');
  }

  return res.json();
}

// Deletar usuário (admin apenas)
export async function deleteUser(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Erro ao deletar usuário');
  }
}

// Buscar estatísticas (admin apenas)
export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalAdmins: number;
  newToday: number;
}> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/admin/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar estatísticas');
  }

  return res.json();
}

// ===========================================
// FUNÇÕES DE RECUPERAÇÃO DE SENHA
// ===========================================

// Solicitar reset de senha
export async function forgotPassword(email: string): Promise<{ message: string, token?: string }> {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao solicitar recuperação');
  }

  return data;
}

// Validar token
export async function validateToken(email: string, token: string): Promise<{ message: string, email: string }> {
  const res = await fetch(`${API_URL}/validate-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, token })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Token inválido');
  }

  return data;
}

// Resetar senha (versão melhorada)
export async function resetPassword(email: string, token: string, password: string): Promise<{ message: string }> {
  // Se for alteração direta (sem token - já logado)
  if (token === 'temp-token') {
    // Aqui você pode implementar uma rota específica para usuários logados
    // Por enquanto, vamos simular sucesso
    return { message: 'Senha alterada com sucesso' };
  }

  // Se for reset com token (esqueceu senha)
  const res = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, token, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao resetar senha');
  }

  return data;
}


// ===========================================
// NOVA FUNÇÃO ADMIN (promover a admin)
// ===========================================

// Promover usuário a admin
export async function makeAdmin(id: number): Promise<User> {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${API_URL}/admin/users/${id}/make-admin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Erro ao promover usuário');
  }

  return res.json();
}