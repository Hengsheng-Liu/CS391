import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Define user object
interface User {
  id: number;
  email: string;
  name: string;
}

// Define shape of auth context
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

// Initialize auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Update user state and localStorage
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  // Handle user logout
  const logout = () => {
    handleSetUser(null);
    router.push('/login');
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
