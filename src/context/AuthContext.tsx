
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem('cegor-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulação de login - em produção seria uma chamada API
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Administrador CEGOR',
        email: 'admin@cegor.gov.br',
        role: 'cegor',
        subrole: 'gestor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Gestor Regional Centro-Sul',
        email: 'gestor@centrosul.gov.br',
        role: 'regional',
        subrole: 'gestor',
        regional_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Operador Regional Centro-Sul',
        email: 'operador@centrosul.gov.br',
        role: 'regional',
        subrole: 'operador',
        regional_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Fiscal Regional Centro-Sul',
        email: 'fiscal@centrosul.gov.br',
        role: 'regional',
        subrole: 'fiscal',
        regional_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Empresa Limpeza BH',
        email: 'empresa@limpezabh.com.br',
        role: 'empresa',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('cegor-user', JSON.stringify(foundUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cegor-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
