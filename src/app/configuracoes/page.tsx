'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromStorage, updateUser, resetPassword } from '@/lib/auth';
import { User } from '@/types';
import { 
  Save, User as UserIcon, Mail, Lock, Moon, Sun, Bell, 
  ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Estado para edição de perfil
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });
  
  // Estado para alterar senha
  const [passwordForm, setPasswordForm] = useState({
    new: '',
    confirm: ''
  });

  // 🔥 Estados para mostrar/esconder senha
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  // 🔥 Estados para força da senha
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Estado para preferências
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    emailUpdates: false
  });

  // 🔥 Função para validar força da senha
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

  // 🔥 Função para cor da barra de força
  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-green-500';
    return 'bg-gray-200';
  };

  // Carregar dados do usuário
  useEffect(() => {
    const userData = getUserFromStorage();
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(userData);
    setProfileForm({
      name: userData.name || '',
      email: userData.email || ''
    });
    
    // Carregar preferências do localStorage
    const savedPrefs = localStorage.getItem('preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, [router]);

  // 🔥 FUNÇÃO PARA VOLTAR
  const handleGoBack = () => {
    router.back();
  };

  // 🔥 FUNÇÃO PARA SALVAR COM ANIMAÇÃO
  const showSuccessMessage = (text: string) => {
    setMessage({ type: 'success', text });
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setMessage({ type: '', text: '' });
      router.push('/tela-inicial');
    }, 1500);
  };

  // Atualizar perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!user) return;
      const updated = await updateUser(user.id, profileForm);
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      showSuccessMessage('✅ Perfil atualizado com sucesso!');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
      setLoading(false);
    }
  };

  // Alterar senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.new !== passwordForm.confirm) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      setLoading(false);
      return;
    }

    if (passwordForm.new.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
      setLoading(false);
      return;
    }

    // 🔥 Validar força mínima (opcional)
    if (passwordStrength < 2) {
      setMessage({ type: 'error', text: 'Use uma senha mais forte (mínimo 8 caracteres, letras e números)' });
      setLoading(false);
      return;
    }

    try {
      // 🔥 USANDO A FUNÇÃO DE RESET PASSWORD
      await resetPassword(user?.email || '', 'temp-token', passwordForm.new);
      
      setPasswordForm({ new: '', confirm: '' });
      setPasswordStrength(0);
      setPasswordFeedback('');
      showSuccessMessage('✅ Senha alterada com sucesso!');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha' });
      setLoading(false);
    }
  };

  // Salvar preferências
  const handleSavePreferences = () => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
    showSuccessMessage('✅ Preferências salvas!');
    
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs = [
    { id: 'perfil', name: 'Perfil', icon: UserIcon },
    { id: 'seguranca', name: 'Segurança', icon: Lock },
    { id: 'preferencias', name: 'Preferências', icon: Sun }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 relative">
      
      {/* BOTÃO VOLTAR */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow hover:shadow-md transition border border-gray-200 dark:border-gray-700 z-10"
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      {/* MENSAGEM DE SUCESSO COM ANIMAÇÃO */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle size={20} />
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 pt-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Configurações</h1>

        {/* Mensagem de erro */}
        {message.type === 'error' && message.text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-400 flex items-center gap-2"
          >
            <AlertCircle size={20} />
            {message.text}
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conteúdo das abas */}
          <div className="p-6">
            
            {/* =========================================== */}
            {/* ABA PERFIL */}
            {/* =========================================== */}
            {activeTab === 'perfil' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleUpdateProfile}>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informações Pessoais</h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Save size={18} />
                      {loading ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* =========================================== */}
            {/* ABA SEGURANÇA (COM OLHO E FORÇA DA SENHA) */}
            {/* =========================================== */}
            {activeTab === 'seguranca' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleChangePassword}>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Alterar Senha</h2>
                  
                  <div className="space-y-4 max-w-md">
                    
                    {/* CAMPO NOVA SENHA COM OLHO */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nova senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordForm.new}
                          onChange={(e) => {
                            setPasswordForm({...passwordForm, new: e.target.value});
                            validatePasswordStrength(e.target.value);
                          }}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                          minLength={6}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* INDICADOR DE FORÇA DA SENHA */}
                    {passwordForm.new && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Força da senha:</div>
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
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span className={passwordForm.new.length >= 8 ? 'text-green-500' : ''}>
                            {passwordForm.new.length >= 8 ? '✓' : '✗'} 8+ caracteres
                          </span>
                          <span className={/[A-Z]/.test(passwordForm.new) && /[a-z]/.test(passwordForm.new) ? 'text-green-500' : ''}>
                            {/[A-Z]/.test(passwordForm.new) && /[a-z]/.test(passwordForm.new) ? '✓' : '✗'} Maiúsc/minúsc
                          </span>
                          <span className={/\d/.test(passwordForm.new) ? 'text-green-500' : ''}>
                            {/\d/.test(passwordForm.new) ? '✓' : '✗'} Números
                          </span>
                          <span className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new) ? 'text-green-500' : ''}>
                            {/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new) ? '✓' : '✗'} Caractere especial
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CAMPO CONFIRMAR SENHA COM OLHO */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmar nova senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* VALIDAÇÃO DE IGUALDADE */}
                    {passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                      <p className="text-xs text-red-500">As senhas não coincidem</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      <Lock size={18} />
                      {loading ? 'Alterando...' : 'Alterar senha'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* =========================================== */}
            {/* ABA PREFERÊNCIAS */}
            {/* =========================================== */}
            {activeTab === 'preferencias' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferências do Sistema</h2>
                
                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {preferences.darkMode ? (
                        <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Modo escuro</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ativar tema escuro</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreferences({...preferences, darkMode: !preferences.darkMode})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Save size={18} />
                    Salvar preferências
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}