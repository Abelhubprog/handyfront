import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../mocks';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'handywriterz_auth_session';
const LOGGED_OUT_KEY = 'handywriterz_auth_logged_out';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize: Load session from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedSession = localStorage.getItem(SESSION_KEY);
        const hasLoggedOut = localStorage.getItem(LOGGED_OUT_KEY);

        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          const found = MOCK_USERS.find(u => u.id === sessionData.userId);
          if (found) {
            setUser(found);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } else if (!hasLoggedOut) {
          // Default for development: start with admin ONLY if they haven't explicitly logged out
          const defaultAdmin = MOCK_USERS.find(u => u.role === 'admin') || null;
          setUser(defaultAdmin);
          if (defaultAdmin) {
            localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: defaultAdmin.id }));
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        // Small delay to prevent flash of content and simulate auth handshake
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }));
      localStorage.removeItem(LOGGED_OUT_KEY); // Reset logout flag on successful login
    } else {
      setIsLoading(false);
      throw new Error('User not found. Try one of the mock emails.');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.setItem(LOGGED_OUT_KEY, 'true'); // Mark as explicitly logged out
  };

  const switchRole = (role: UserRole) => {
    const found = MOCK_USERS.find(u => u.role === role);
    if (found) {
      setUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: found.id }));
      localStorage.removeItem(LOGGED_OUT_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      switchRole,
      isAuthenticated: !!user 
    }}>
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