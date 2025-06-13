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
  login: (userData: { email: string; password: string }) => void;
  signup: (userData: { name: string; email: string; password: string; class: string; board: string }) => void;
  logout: () => void;
  updateUser: (updatedUser: { name: string; email: string; class: string; board: string }) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
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

  const login = (userData: { email: string; password: string }) => {
    // For demonstration purposes, we're not validating the password
    // In a real application, you'd validate the email and password against a database
    const mockUser: User = {
      id: Date.now().toString(),
      name: 'Test User',
      email: userData.email,
      class: 'Class 10',
      board: 'CBSE',
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = (userData: { 
    name: string; 
    email: string; 
    password: string; 
    class: string; 
    board: string; 
  }) => {
    // Remove ICSE validation since we're removing it
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      class: userData.class,
      board: userData.board, // Only CBSE will be available
    };
    
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
