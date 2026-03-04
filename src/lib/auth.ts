import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api';

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
  window.location.href = '/'; // Redireciona para a capa
}

// Verificar se está logado
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

// Pegar usuário do localStorage (sem fetch - mais rápido)
export function getUserFromStorage(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}