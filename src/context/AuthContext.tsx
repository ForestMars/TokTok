
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'product_owner' | 'product_manager' | 'technical_project_manager' | 'engineer' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  githubUsername?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock data for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
    githubUsername: 'adminuser',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'product_owner',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    githubUsername: 'johndoe',
  },
  {
    id: '3',
    name: 'Lisa King',
    email: 'lisa@example.com',
    role: 'product_manager',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+King&background=random',
    githubUsername: 'lisaking',
  },
  {
    id: '4',
    name: 'Sam Peterson',
    email: 'sam@example.com',
    role: 'technical_project_manager',
    avatar: 'https://ui-avatars.com/api/?name=Sam+Peterson&background=random',
    githubUsername: 'sampeterson',
  },
  {
    id: '5',
    name: 'Emma Lee',
    email: 'emma@example.com',
    role: 'engineer',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Lee&background=random',
    githubUsername: 'emmalee',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('pedal_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // For demo purposes, we'll simulate GitHub auth with a mock user
    // In a real application, you would redirect to GitHub OAuth flow
    setIsLoading(true);
    
    // Simulating API delay
    setTimeout(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      setUser(randomUser);
      localStorage.setItem('pedal_user', JSON.stringify(randomUser));
      toast.success(`Logged in as ${randomUser.name}`);
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pedal_user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    // In a real application, you would call an API to update the user's role
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('pedal_user', JSON.stringify(updatedUser));
      toast.success(`Role updated to ${role}`);
    }
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
