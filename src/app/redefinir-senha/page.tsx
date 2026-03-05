'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { validateToken, resetPassword } from '@/lib/auth';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken && urlEmail) {
      setToken(urlToken);
      setEmail(urlEmail);
      validateTokenFromUrl(urlEmail, urlToken);
    } else {
      setError('Link inválido ou expirado');
      setValidating(false);
    }
  }, [searchParams]);

  const validatePasswordStrength = (pass: string) => {
    if (!pass) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;
    
    let strength = 0;
    if (isLongEnough) strength++;
    if (hasUpperCase && hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    
    setPasswordStrength(strength);
    
    if (strength === 0) setPasswordFeedback('Muito fraca');
    else if (strength === 1) setPasswordFeedback('Fraca');
    else if (strength === 2) setPasswordFeedback('Média');
    else if (strength === 3) setPasswordFeedback('Forte');
    else if (strength === 4) setPasswordFeedback('Muito forte');
  };

  useEffect(() => {
    validatePasswordStrength(password);
  }, [password]);

  const validateTokenFromUrl = async (email: string, token: string) => {
    try {
      await validateToken(email, token);
      setValidating(false);
    } catch (err) {
      setError('Token inválido ou expirado');
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, token, password);
      setSuccess(true);
      
      // ✅ Redireciona para login após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-green-500';
    return 'bg-gray-200';
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4">Validando token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 relative">
      
      {/* BOTÃO VOLTAR (só aparece se NÃO estiver em sucesso) */}
      {!success && (
        <button
          onClick={() => router.push('/login')}
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/30 backdrop-blur-sm"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-96"
      >
        {success ? (
          // ✅ TELA DE SUCESSO (SEM BOTÃO DE VOLTAR, SÓ REDIRECIONA)
          <div className="text-center">
            <div className="bg-green-100 text-green-700 p-6 rounded-lg">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">✅ Sucesso!</h2>
              <p className="mb-4">Sua senha foi redefinida com sucesso.</p>
              <p className="text-sm">Redirecionando para o login em 3 segundos...</p>
            </div>
          </div>
        ) : error ? (
          // TELA DE ERRO
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-6 rounded-lg">
              <p className="font-medium text-lg mb-2">❌ Erro</p>
              <p className="mb-4">{error}</p>
              <Link
                href="/esqueceu-senha"
                className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Solicitar novo link
              </Link>
            </div>
          </div>
        ) : (
          // FORMULÁRIO
          <>
            <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Nova senha</h1>
            <p className="text-center text-gray-600 mb-6 text-sm">
              Digite sua nova senha para {email}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos de senha (mantém igual) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">Força da senha:</div>
                    <div className="text-xs font-medium" 
                         style={{ 
                           color: passwordStrength === 0 ? '#6b7280' :
                                  passwordStrength === 1 ? '#ef4444' :
                                  passwordStrength === 2 ? '#f97316' :
                                  passwordStrength === 3 ? '#eab308' :
                                  '#22c55e'
                         }}>
                      {passwordFeedback}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">As senhas não coincidem</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}