import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';
import type { User, AuthState, LoginCredentials } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_ERROR'; payload: string };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_AUTH':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Configurações de usuários válidos (em produção, isso viria de uma API)
const VALID_USERS = [
  {
    id: '1',
    email: 'Allure@mangoia.com.br',
    password: 'AllureMusic2025!',
    name: 'Administrador Allure',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'manager@allure.com.br',
    password: 'AllureManager2025!',
    name: 'Gerente Allure',
    role: 'manager' as const,
  },
];

// Simular JWT Token (em produção, isso viria do backend)
function generateToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
  };
  
  // Em produção, usar uma biblioteca JWT real
  return btoa(JSON.stringify(payload));
}

function validateToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token));
    
    // Verificar se o token não expirou
    if (payload.exp < Date.now()) {
      return null;
    }
    
    // Buscar usuário
    const user = VALID_USERS.find(u => u.id === payload.sub);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    const token = Cookies.get('allure_auth_token');
    if (token) {
      const user = validateToken(token);
      if (user) {
        dispatch({ type: 'SET_USER', payload: { user, token } });
      } else {
        // Token inválido, remover
        Cookies.remove('allure_auth_token');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    console.log('Auth login called with:', credentials);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciais
      console.log('Valid users:', VALID_USERS);
      const user = VALID_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found, login failed');
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
      
      // Gerar token
      const userInfo: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      
      const token = generateToken(userInfo);
      
      // Salvar token no cookie (httpOnly em produção)
      Cookies.set('allure_auth_token', token, { 
        expires: 1, // 1 dia
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
      
      dispatch({ type: 'SET_USER', payload: { user: userInfo, token } });
      return true;
      
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('allure_auth_token');
    dispatch({ type: 'CLEAR_AUTH' });
  };

  const refreshAuth = () => {
    const token = Cookies.get('allure_auth_token');
    if (token) {
      const user = validateToken(token);
      if (user) {
        dispatch({ type: 'SET_USER', payload: { user, token } });
      } else {
        logout();
      }
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}