
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth, UserRole, User } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const UserRoleLabels: Record<string, string> = {
  'admin': 'Administrator',
  'product_owner': 'Product Owner',
  'product_manager': 'Product Manager',
  'technical_project_manager': 'Technical Project Manager',
  'engineer': 'Engineer',
};

// Mock users for demonstration
const mockUserList: User[] = [
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

const UserManagement = () => {
  const { user: currentUser, updateUserRole } = useAuth();
  const [users] = useState<User[]>(mockUserList);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!newRole) return;
    
    setLoadingUserId(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-display font-semibold mb-2 tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions for the PEDAL system
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">User</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">GitHub</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Role</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {user.avatar && (
                              <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            )}
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {user.githubUsername ? `@${user.githubUsername}` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              user.role === 'admin' 
                                ? 'bg-workflow-purple' 
                                : user.role === 'product_owner' 
                                  ? 'bg-workflow-blue' 
                                  : user.role === 'product_manager' 
                                    ? 'bg-workflow-green' 
                                    : user.role === 'technical_project_manager' 
                                      ? 'bg-amber-500' 
                                      : 'bg-workflow-orange'
                            }`}></span>
                            {UserRoleLabels[user.role as string] || 'Unknown'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {currentUser?.role === 'admin' && (
                            <div className="flex items-center justify-end">
                              <Select
                                value={user.role as string}
                                onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                                disabled={loadingUserId === user.id}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="product_owner">Product Owner</SelectItem>
                                  <SelectItem value="product_manager">Product Manager</SelectItem>
                                  <SelectItem value="technical_project_manager">Technical PM</SelectItem>
                                  <SelectItem value="engineer">Engineer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserManagement;
