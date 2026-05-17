import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 'dev-user',
    username: 'empresa001',
    role: 'EMPRESA',
    companyName: 'Empresa de Desarrollo',
    companyRuc: '1790000001001',
    email: 'dev@banquito.com',
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password);
      
      const userData: User = {
        id: response.id || '1',
        username: response.usuario || username,
        role: response.rolSwitch || 'EMPRESA',
        companyName: response.nombreEmpresa || '',
        companyRuc: response.rucEmpresa || '',
        email: response.usuario || '',
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
