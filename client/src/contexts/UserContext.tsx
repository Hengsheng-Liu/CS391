import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User{
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null; 
  setUser: (user: User) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Provide the context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  return (
    <AuthContext.Provider value={{ user, setUser}}>
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
