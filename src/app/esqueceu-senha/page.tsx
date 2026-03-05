'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { forgotPassword } from '@/lib/auth';

export default function EsqueceuSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 relative">
      
      {/* BOTÃO VOLTAR (sempre visível) */}
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
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Esqueceu a senha?</h1>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Digite seu email para receber instruções
        </p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success ? (
          // ✅ MENSAGEM DE SUCESSO COM BOTÃO VOLTAR
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="bg-green-100 text-green-700 p-6 rounded-lg">
              <Mail size={48} className="mx-auto mb-4 text-green-600" />
              <p className="font-medium text-lg mb-2">✅ Email enviado!</p>
              <p className="text-sm">
                Enviamos um email para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
              <p className="text-xs mt-4 text-gray-600">
                Verifique sua caixa de entrada e pasta de spam.
              </p>
            </div>

            {/* ✅ BOTÃO PARA VOLTAR AO LOGIN */}
            <Link
              href="/login"
              className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Voltar para login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}