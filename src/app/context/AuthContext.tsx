import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'empresa.user',
    role: 'EMPRESA',
    companyName: 'Corporación Industrial S.A.',
    companyRuc: '1790000001001',
    email: 'admin@corporacion.com',
  });

  const login = async (username: string, password: string) => {
    const mockUser: User = {
      id: '1',
      username,
      role: 'EMPRESA',
      companyName: 'Corporación Industrial S.A.',
      companyRuc: '1790000001001',
      email: 'admin@corporacion.com',
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role,
        companyName: role === 'EMPRESA' ? 'Corporación Industrial S.A.' : undefined,
        companyRuc: role === 'EMPRESA' ? '1790000001001' : undefined,
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
