
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  board: string;
}

interface AuthContextProps {
  user: User | null;
  login: (userData: { email: string; password: string }) => Promise<boolean>;
  signup: (userData: { name: string; email: string; password: string; class: string; board: string }) => void;
  logout: () => void;
  updateUser: (updatedUser: { name: string; email: string; class: string; board: string }) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => false,
  signup: () => {},
  logout: () => {},
  updateUser: () => {},
  isLoading: true,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: { email: string; password: string }): Promise<boolean> => {
    // Check if user exists in registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = registeredUsers.find((u: any) => 
      u.email === userData.email && u.password === userData.password
    );
    
    if (!existingUser) {
      return false; // User not found or wrong credentials
    }
    
    // Create user object without password
    const { password, ...userWithoutPassword } = existingUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const signup = (userData: { 
    name: string; 
    email: string; 
    password: string; 
    class: string; 
    board: string; 
  }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      class: userData.class,
      board: userData.board,
    };
    
    // Store user in registered users list
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Set current user
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: { name: string; email: string; class: string; board: string }) => {
    if (user) {
      const updatedUserData: User = { ...user, ...updatedUser };
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
