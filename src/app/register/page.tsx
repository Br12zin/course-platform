'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/auth';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react'; // <-- IMPORTAR ÍCONE

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [message, setMessage] = useState<{type: String, text:string} | null>(null);

  const checkPasswordStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++; // letra maiúscula
  if (/[0-9]/.test(password)) strength++; // número
  if (/[^A-Za-z0-9]/.test(password)) strength++; // caractere especial

  setPasswordStrength(strength);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // 🔥 Validar força mínima
      if (passwordStrength < 2) {
          setError('Use uma senha mais forte (mínimo 8 caracteres, letras e números)');
          setLoading(false);
        return;
      }
    try {
      await registerUser(formData);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 relative">
      
      {/* 🔥 BOTÃO VOLTAR */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/30 backdrop-blur-sm"
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Cadastro</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            ✅ Cadastro realizado com sucesso! Redirecionando para o login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu Nome"
              disabled={loading || success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu Email"
              disabled={loading || success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
              setFormData({...formData, password: e.target.value});
              checkPasswordStrength(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua Senha"
              disabled={loading || success}
              />
          </div>
          <div className="mt-2">
  <div className="h-2 w-full bg-gray-200 rounded">
    <div
      className={`h-2 rounded transition-all ${
        passwordStrength === 1 ? 'bg-red-500 w-1/4' :
        passwordStrength === 2 ? 'bg-yellow-500 w-2/4' :
        passwordStrength === 3 ? 'bg-blue-500 w-3/4' :
        passwordStrength >= 4 ? 'bg-green-500 w-full' :
        'w-0'
      }`}
    />
  </div>

  <p className="text-xs mt-1 text-gray-500">
    Força da senha:
    {passwordStrength === 0 && " muito fraca"}
    {passwordStrength === 1 && " fraca"}
    {passwordStrength === 2 && " média"}
    {passwordStrength === 3 && " forte"}
    {passwordStrength >= 4 && " muito forte"}
  </p>
</div>
 
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : success ? 'Redirecionando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}