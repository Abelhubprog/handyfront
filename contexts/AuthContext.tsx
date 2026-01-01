import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../mocks';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to Admin for development
  const [user, setUser] = useState<User | null>(MOCK_USERS.find(u => u.role === 'admin') || null);

  const login = (email: string) => {
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) setUser(found);
  };

  const logout = () => setUser(null);

  const switchRole = (role: UserRole) => {
    const found = MOCK_USERS.find(u => u.role === role);
    if (found) setUser(found);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};