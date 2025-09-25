import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types';
import allureLogo from '../assets/ALLURE---MARCA-BRANCA---SEM-FUNDO.png';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginCredentials) => {
    console.log('Login attempt:', data);
    setLoginError('');
    
    const success = await login(data);
    console.log('Login result:', success);
    
    if (!success) {
      setLoginError('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-allure-light via-white to-allure-light flex items-center justify-center p-6 font-spartan">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="bg-allure-brown rounded-2xl p-8 shadow-lg inline-block">
            <img 
              src={allureLogo} 
              alt="Allure Music Hall" 
              className="h-16 w-auto mx-auto filter brightness-0 invert"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-allure-brown mb-2">
              Administração de Eventos
            </h1>
            <p className="text-allure-secondary font-medium">
              Allure Music Hall
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-allure-brown mb-2"
              >
                E-mail
              </label>
              <input
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                  }
                })}
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-stone-300'
                }`}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-allure-brown mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border-2 font-medium transition-all duration-200 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-stone-300'
                  }`}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-allure-brown transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Error */}
            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-800 font-medium">{loginError}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-allure-brown text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-allure-secondary hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-allure-brown/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-stone-500">
              Credenciais de demonstração:<br />
              <span className="font-medium">Allure@mangoia.com.br</span> | 
              <span className="font-medium"> AllureMusic2025!</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-stone-600">
            © 2025 Allure Music Hall - Sistema de Administração
          </p>
        </div>
      </div>
    </div>
  );
}