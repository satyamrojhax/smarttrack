import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  board: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, className: string, board: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if user exists in registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
    
    if (!existingUser) {
      throw new Error('Invalid credentials. Please register first or check your login details.');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userToLogin: User = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      class: existingUser.class,
      board: existingUser.board
    };
    
    setUser(userToLogin);
    localStorage.setItem('user', JSON.stringify(userToLogin));
    return true;
  };

  const register = async (name: string, email: string, password: string, className: string, board: string): Promise<boolean> => {
    // Check if user already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: any) => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists with this email. Please login instead.');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      class: className,
      board,
      password
    };
    
    // Save to registered users
    const updatedUsers = [...registeredUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = registeredUsers.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, isLoading }}>
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
