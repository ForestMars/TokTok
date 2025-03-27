
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const Login = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-workflow-blue rounded-md flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">
            Sign in to PEDAL
          </h1>
          <p className="text-muted-foreground mt-2">
            Product Engineering Delivery Automation Lifecycle
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <Github className="w-5 h-5 mr-2" />
                Sign in with GitHub
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            This is a demo application. In a real implementation, you would be redirected to GitHub for authentication.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
